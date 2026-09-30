#!/usr/bin/env python3
"""Read-only integrity checks for the Humanismo Evolutivo design handoff.

The validator uses only the Python standard library and never modifies files.
Run it from any directory with:

    python3 refactor_design/scripts/validate_design.py
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable
from urllib.parse import unquote, urlsplit


EXPECTED_SCREENS = 42
EXPECTED_DESIGNS = 158
BREAKPOINT_MARKERS = {
    "laptop": None,
    "ipad": "-tablet",
    "iphone": "-movil",
}
EXTERNAL_SCHEMES = {"http", "https", "mailto", "tel", "data", "javascript"}
PENDING_FRAGMENTS = {
    "",
    "idioma",
    "facebook",
    "instagram",
    "youtube",
    "spotify",
    "linkedin",
    "x",
    "twitter",
    "tiktok",
    "es",
    "en",
    "club",
    "chatbot",
    "documental",
    "reproducir",
    "reproducir-video",
    "video",
    "descargar",
    "compartir",
    "marzo-2027",
}
PROTECTED_IMAGES = {
    "de-donde-venimos.jpg",
    "hacia-donde-podemos-evolucionar.jpg",
}
COLOR_RE = re.compile(r"#[0-9a-fA-F]{6}\b")
STYLE_DIMENSION_RE = re.compile(r"(?:^|;)\s*(width|height)\s*:\s*([0-9.]+)px\b", re.I)
ROOT_CANVAS_RE = re.compile(
    r"<body\b[^>]*>\s*<(?:div|header|footer|nav|main|section)\b[^>]*\bstyle\s*=\s*([\"'])(?P<style>.*?)\1",
    re.I | re.S,
)


@dataclass
class Finding:
    severity: str
    code: str
    message: str
    file: str | None = None
    line: int | None = None

    def render(self) -> str:
        location = ""
        if self.file:
            location = self.file
            if self.line:
                location += f":{self.line}"
            location += " — "
        return f"[{self.severity.upper()}] {self.code}: {location}{self.message}"


@dataclass
class Node:
    tag: str
    attrs: dict[str, str | None]
    line: int
    parent: "Node | None" = None
    children: list["Node"] = field(default_factory=list)
    text: list[str] = field(default_factory=list)

    @property
    def style(self) -> str:
        return self.attrs.get("style") or ""


class DesignHTMLParser(HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.root = Node("document", {}, 1)
        self.stack = [self.root]
        self.nodes: list[Node] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        node = Node(tag.lower(), dict(attrs), self.getpos()[0], self.stack[-1])
        self.stack[-1].children.append(node)
        self.nodes.append(node)
        if node.tag not in self.VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        if self.stack[-1].tag == tag.lower():
            self.stack.pop()

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                return

    def handle_data(self, data: str) -> None:
        if self.stack:
            self.stack[-1].text.append(data)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root",
        type=Path,
        help="Path to refactor_design (defaults to the parent of this script directory).",
    )
    parser.add_argument(
        "--show-pending",
        action="store_true",
        help="List every pending placeholder fragment instead of grouped counts.",
    )
    return parser.parse_args()


def iter_strings(value: object) -> Iterable[str]:
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for nested in value.values():
            yield from iter_strings(nested)
    elif isinstance(value, list):
        for nested in value:
            yield from iter_strings(nested)


def local_reference(raw: str) -> tuple[str, str] | None:
    parts = urlsplit(raw)
    if parts.scheme.lower() in EXTERNAL_SCHEMES or parts.netloc:
        return None
    return unquote(parts.path), unquote(parts.fragment)


def element_text(node: Node) -> str:
    values = list(node.text)
    for child in node.children:
        values.append(element_text(child))
    return " ".join(values)


def inherited_font_family(node: Node) -> str | None:
    current: Node | None = node
    while current:
        match = re.search(r"font-family\s*:\s*([^;]+)", current.style, re.I)
        if match:
            return match.group(1)
        current = current.parent
    return None


def screen_entries(manifest: list[dict]) -> tuple[list[dict], list[dict]]:
    screens: list[dict] = []
    entries: list[dict] = []
    for section in manifest:
        for screen in section.get("screens", []):
            screens.append(screen)
            for breakpoint in BREAKPOINT_MARKERS:
                for design in screen.get(breakpoint, []):
                    entries.append({**design, "breakpoint": breakpoint, "screen": screen.get("title", "")})
    return screens, entries


def main() -> int:
    args = parse_args()
    root = (args.root or Path(__file__).resolve().parents[1]).resolve()
    html_dir = root / "html"
    manifest_path = root / "screens.json"
    tokens_path = root / "design-tokens.json"
    findings: list[Finding] = []
    pending_fragments: list[Finding] = []

    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        tokens = json.loads(tokens_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"[ERROR] bootstrap: {exc}")
        return 2

    screens, entries = screen_entries(manifest)
    manifest_files = [entry["file"] for entry in entries]
    actual_files = sorted(path.relative_to(root).as_posix() for path in html_dir.glob("*.html"))

    if len(screens) != EXPECTED_SCREENS:
        findings.append(Finding("error", "screen-count", f"Expected {EXPECTED_SCREENS} screens; found {len(screens)}.", "screens.json"))
    if len(entries) != EXPECTED_DESIGNS:
        findings.append(Finding("error", "design-count", f"Expected {EXPECTED_DESIGNS} manifest entries; found {len(entries)}.", "screens.json"))
    if len(actual_files) != EXPECTED_DESIGNS:
        findings.append(Finding("error", "file-count", f"Expected {EXPECTED_DESIGNS} HTML files; found {len(actual_files)}.", "html"))

    duplicate_manifest_files = [name for name, count in Counter(manifest_files).items() if count > 1]
    for name in duplicate_manifest_files:
        findings.append(Finding("error", "manifest-duplicate", "File appears more than once in screens.json.", name))
    for name in sorted(set(manifest_files) - set(actual_files)):
        findings.append(Finding("error", "manifest-missing-file", "Manifest entry has no matching HTML file.", name))
    for name in sorted(set(actual_files) - set(manifest_files)):
        findings.append(Finding("error", "manifest-unlisted-file", "HTML file is not listed in screens.json.", name))

    manifest_by_file = {entry["file"]: entry for entry in entries}
    parsed: dict[str, DesignHTMLParser] = {}
    raw_html: dict[str, str] = {}
    approved_fonts = {
        tokens.get("font", {}).get(role, {}).get("family", "").lower()
        for role in ("display", "label", "text")
    }
    approved_fonts.discard("")

    for breakpoint, specification in tokens.get("breakpoints", {}).items():
        if breakpoint not in BREAKPOINT_MARKERS:
            continue
        token_width = specification.get("width")
        inconsistent = sorted({entry["width"] for entry in entries if entry["breakpoint"] == breakpoint and entry["width"] != token_width})
        if inconsistent:
            findings.append(Finding("error", "token-breakpoint-drift", f"{breakpoint} token width is {token_width}px but manifest also uses {inconsistent}.", "design-tokens.json"))

    for relative in actual_files:
        path = root / relative
        text = path.read_text(encoding="utf-8")
        raw_html[relative] = text
        parser = DesignHTMLParser()
        try:
            parser.feed(text)
        except Exception as exc:  # HTMLParser is tolerant; preserve the file if an exceptional edge case occurs.
            findings.append(Finding("error", "html-parse", str(exc), relative))
        parsed[relative] = parser

        for family_declaration in re.findall(r"font-family\s*:\s*([^;}]+)", text, re.I):
            normalized = family_declaration.lower()
            if "inherit" in normalized or any(font in normalized for font in approved_fonts):
                continue
            findings.append(Finding("error", "token-font-drift", f"Unapproved font-family declaration: {family_declaration.strip()!r}.", relative))

        entry = manifest_by_file.get(relative)
        if entry:
            root_match = ROOT_CANVAS_RE.search(text)
            if not root_match:
                findings.append(Finding("error", "root-canvas", "Could not find the first body canvas div.", relative))
            else:
                dimensions = {key.lower(): float(value) for key, value in STYLE_DIMENSION_RE.findall(root_match.group("style"))}
                for dimension in ("width", "height"):
                    expected = float(entry[dimension])
                    actual = dimensions.get(dimension)
                    if actual is None or actual != expected:
                        findings.append(Finding("error", "canvas-dimension", f"Manifest {dimension}={expected:g}px; root canvas {dimension}={actual if actual is not None else 'missing'}.", relative))

            marker = BREAKPOINT_MARKERS[entry["breakpoint"]]
            basename = Path(relative).stem
            alternate_marker = "Tablet" if entry["breakpoint"] == "ipad" else "Mobile" if entry["breakpoint"] == "iphone" else None
            spanish_mobile_marker = "Movil" if entry["breakpoint"] == "iphone" else None
            if marker and marker not in basename and (not alternate_marker or alternate_marker not in basename) and (not spanish_mobile_marker or spanish_mobile_marker not in basename):
                findings.append(Finding("error", "breakpoint-filename", f"{entry['breakpoint']} file lacks its expected breakpoint marker.", relative))
            if marker is None and ("-tablet" in basename or "-movil" in basename):
                findings.append(Finding("error", "breakpoint-filename", "Laptop entry uses a tablet/mobile filename.", relative))

        ids = defaultdict(list)
        labels_for: set[str] = set()
        for node in parser.nodes:
            node_id = node.attrs.get("id")
            if node_id:
                ids[node_id].append(node.line)
            if node.tag == "label" and node.attrs.get("for"):
                labels_for.add(node.attrs["for"] or "")
        for node_id, lines in ids.items():
            if len(lines) > 1:
                findings.append(Finding("error", "duplicate-id", f"id={node_id!r} occurs {len(lines)} times (lines {', '.join(map(str, lines))}).", relative, lines[1]))

        for node in parser.nodes:
            if node.tag == "img" and "alt" not in node.attrs:
                findings.append(Finding("error", "missing-alt", "Image is missing an alt attribute.", relative, node.line))
            if node.tag in {"input", "select", "textarea"}:
                control_type = (node.attrs.get("type") or "text").lower()
                if control_type in {"hidden", "button", "submit", "reset", "image"}:
                    continue
                labelled = bool(
                    node.attrs.get("aria-label")
                    or node.attrs.get("aria-labelledby")
                    or node.attrs.get("title")
                    or (node.attrs.get("id") and node.attrs.get("id") in labels_for)
                    or (node.parent and node.parent.tag == "label")
                )
                if not labelled:
                    findings.append(Finding("error", "missing-label", f"<{node.tag}> has no associated label or accessible name.", relative, node.line))

            if re.search(r"font-family\s*:\s*\\[\"']", node.style, re.I):
                findings.append(Finding("error", "escaped-font-family", "Malformed escaped quote in font-family declaration.", relative, node.line))
            if re.search(r"\d", element_text(node)) and inherited_font_family(node) and "cinzel" in (inherited_font_family(node) or "").lower():
                direct_text = " ".join(node.text).strip()
                if re.search(r"\d", direct_text):
                    findings.append(Finding("error", "cinzel-arabic-digit", f"Arabic numeral inherits Cinzel: {direct_text[:80]!r}.", relative, node.line))

        for node in parser.nodes:
            for attribute in ("href", "src"):
                raw = node.attrs.get(attribute)
                if not raw:
                    continue
                reference = local_reference(raw)
                if reference is None:
                    continue
                path_part, fragment = reference
                target = (path.parent / path_part).resolve() if path_part else path
                if path_part and not target.exists():
                    findings.append(Finding("error", "broken-local-reference", f"{attribute}={raw!r} does not resolve.", relative, node.line))
                    continue

                if attribute == "href" and path_part.lower().endswith(".html") and target.exists() and entry:
                    target_relative = target.relative_to(root).as_posix()
                    target_entry = manifest_by_file.get(target_relative)
                    if target_entry and target_entry["breakpoint"] != entry["breakpoint"]:
                        findings.append(Finding("error", "breakpoint-link", f"{entry['breakpoint']} design links to {target_entry['breakpoint']} file {path_part!r}.", relative, node.line))

                if attribute == "href" and fragment:
                    target_relative = target.relative_to(root).as_posix() if target.is_relative_to(root) else relative
                    target_parser = parsed.get(target_relative)
                    if target_parser is None and target.exists() and target.suffix.lower() == ".html":
                        target_text = target.read_text(encoding="utf-8")
                        target_parser = DesignHTMLParser()
                        target_parser.feed(target_text)
                    target_ids = {candidate.attrs.get("id") for candidate in target_parser.nodes} if target_parser else set()
                    if fragment not in target_ids:
                        finding = Finding("warning" if fragment.lower() in PENDING_FRAGMENTS else "error", "pending-fragment" if fragment.lower() in PENDING_FRAGMENTS else "unresolved-fragment", f"href={raw!r} has no matching target id.", relative, node.line)
                        (pending_fragments if finding.severity == "warning" else findings).append(finding)
                elif attribute == "href" and raw == "#":
                    pending_fragments.append(Finding("warning", "pending-fragment", "href='#' is an explicit placeholder.", relative, node.line))

        for node in parser.nodes:
            if node.tag != "img":
                continue
            source_name = Path(node.attrs.get("src") or "").name
            if source_name not in PROTECTED_IMAGES:
                continue
            style = node.style.lower().replace(" ", "")
            if "object-fit:contain" not in style:
                findings.append(Finding("error", "protected-image-crop", f"{source_name} must use object-fit: contain.", relative, node.line))
            if any(property_name in style for property_name in ("filter:", "mix-blend-mode:", "opacity:")):
                findings.append(Finding("error", "protected-image-recolor", f"{source_name} may not be filtered, blended or made translucent.", relative, node.line))
            parent = node.parent
            if parent and any("position:absolute" in sibling.style.lower().replace(" ", "") for sibling in parent.children if sibling is not node):
                findings.append(Finding("error", "protected-image-overlay", f"{source_name} has an absolutely positioned sibling overlay.", relative, node.line))

    token_colors = {value.upper() for value in iter_strings(tokens) if COLOR_RE.fullmatch(value)}
    used_colors: dict[str, set[str]] = defaultdict(set)
    for relative, text in raw_html.items():
        for match in COLOR_RE.finditer(text):
            used_colors[match.group(0).upper()].add(relative)
    for color in sorted(set(used_colors) - token_colors):
        files = sorted(used_colors[color])
        findings.append(Finding("error", "token-drift", f"{color} is used in {len(files)} HTML file(s) but is absent from design-tokens.json; first: {files[0]}.", "design-tokens.json"))

    errors = [finding for finding in findings if finding.severity == "error"]
    warnings = [finding for finding in findings if finding.severity == "warning"]
    print("Humanismo Evolutivo design validation")
    print(f"Root: {root}")
    print(f"Inventory: {len(screens)} screens · {len(entries)} manifest entries · {len(actual_files)} HTML files")
    print(f"Result: {len(errors)} error(s) · {len(warnings)} warning(s) · {len(pending_fragments)} pending fragment placeholder(s)")

    if findings:
        print("\nFindings")
        for finding in findings:
            print(finding.render())

    if pending_fragments:
        print("\nPending internal fragments")
        if args.show_pending:
            for finding in pending_fragments:
                print(finding.render())
        else:
            counts = Counter(re.search(r"href=([^ ]+)", finding.message).group(1) if "href=" in finding.message else "#" for finding in pending_fragments)
            for raw, count in counts.most_common():
                print(f"[WARNING] pending-fragment: {raw} — {count} occurrence(s)")
            print("Use --show-pending for file and line details.")

    if not errors:
        print("\nPASS: no blocking design-source integrity errors.")
        return 0
    print("\nFAIL: resolve blocking errors above; pending placeholders remain warnings by design.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
