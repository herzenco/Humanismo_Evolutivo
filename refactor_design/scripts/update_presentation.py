#!/usr/bin/env python3
"""Append a concise, branded design-readiness addendum to the client PDF."""

from __future__ import annotations

import os
import tempfile
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import HexColor
from reportlab.pdfgen.canvas import Canvas


ROOT = Path(__file__).resolve().parents[1]
PRESENTATION = ROOT / "Humanismo-Evolutivo-Propuesta-Rediseno.pdf"
BASE_PAGE_COUNT = 49
PAGE_W = 1440
PAGE_H = 810

FOREST = HexColor("#173F2C")
GREEN = HexColor("#2F6B45")
SAGE = HexColor("#EAF0E1")
IVORY = HexColor("#FAF7EF")
INK = HexColor("#1D2B22")
BODY = HexColor("#3E4D43")
GOLD = HexColor("#D4AF5A")
WHITE = HexColor("#FFFFFF")


def footer(c: Canvas, page: int, total: int, dark: bool = False) -> None:
    color = HexColor("#D8E3D3") if dark else HexColor("#657468")
    c.setFillColor(color)
    c.setFont("Helvetica", 14)
    c.drawString(84, 42, "HUMANISMO EVOLUTIVO · ACTUALIZACIÓN DE DISEÑO")
    c.drawRightString(PAGE_W - 84, 42, f"{page} / {total}")


def title(c: Canvas, eyebrow: str, heading: str, subtitle: str | None = None) -> None:
    c.setFillColor(GREEN)
    c.setFont("Helvetica-Bold", 17)
    c.drawString(84, 716, eyebrow.upper())
    c.setFillColor(FOREST)
    c.setFont("Times-Bold", 45)
    c.drawString(84, 655, heading)
    if subtitle:
        c.setFillColor(BODY)
        c.setFont("Helvetica", 20)
        c.drawString(84, 615, subtitle)


def wrapped(c: Canvas, text: str, x: float, y: float, width: float, size: int = 18,
            leading: int = 25, color=BODY, font: str = "Helvetica") -> float:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if c.stringWidth(candidate, font, size) <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    c.setFillColor(color)
    c.setFont(font, size)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def card(c: Canvas, x: float, y: float, w: float, h: float, number: str,
         label: str, detail: str) -> None:
    c.setFillColor(WHITE)
    c.roundRect(x, y, w, h, 18, fill=1, stroke=0)
    c.setFillColor(GREEN)
    c.setFont("Times-Bold", 38)
    c.drawString(x + 28, y + h - 55, number)
    c.setFillColor(FOREST)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(x + 28, y + h - 87, label.upper())
    wrapped(c, detail, x + 28, y + h - 120, w - 56, 15, 20)


def bullet(c: Canvas, y: float, heading: str, body: str) -> float:
    c.setFillColor(GREEN)
    c.circle(96, y + 2, 6, fill=1, stroke=0)
    c.setFillColor(FOREST)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(120, y - 5, heading)
    return wrapped(c, body, 120, y - 34, 1190, 16, 22) - 22


def create_appendix(path: Path) -> None:
    c = Canvas(str(path), pagesize=(PAGE_W, PAGE_H))

    c.setFillColor(FOREST)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(84, 716, "ACTUALIZACIÓN DE ENTREGA · 30 SEPTIEMBRE 2026")
    c.setFillColor(WHITE)
    c.setFont("Times-Bold", 52)
    c.drawString(84, 638, "Diseño listo para validación")
    c.setFillColor(HexColor("#D8E3D3"))
    wrapped(
        c,
        "Este anexo documenta el endurecimiento del sistema de diseño. "
        "No representa una implementación ni modifica la aplicación en producción.",
        84, 590, 930, 22, 30, HexColor("#D8E3D3"), "Helvetica",
    )
    card(c, 84, 235, 278, 220, "42", "grupos de pantalla", "Sitio público, estados, portal educativo y administración.")
    card(c, 382, 235, 278, 220, "158", "archivos de diseño", "Fuente visual en HTML con orden y contenido consistentes.")
    card(c, 680, 235, 278, 220, "3", "breakpoints", "Laptop 1440 px, iPad 834 px e iPhone 390 px.")
    card(c, 978, 235, 278, 220, "37", "rutas únicas", "Inventario SEO/AEO y reglas de indexación preparadas.")
    footer(c, 50, 52, dark=True)
    c.showPage()

    c.setFillColor(IVORY)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    title(c, "Preparación del sistema", "Qué quedó fortalecido")
    y = 565
    y = bullet(c, y, "Paridad responsive", "Contenido y orden alineados entre laptop, iPad e iPhone; se completó el estado vacío de Recursos en tablet y móvil.")
    y = bullet(c, y, "Accesibilidad", "Foco visible, controles semánticos, estados deshabilitados inequívocos y alertas ocultas correctamente.")
    y = bullet(c, y, "Formularios y estados", "Acceso, registro, recuperación, contacto y descargas usan estados neutrales y acciones representadas de forma coherente.")
    y = bullet(c, y, "Integridad de contenido", "Datos provisionales, enlaces ausentes, duraciones, fechas, descargas y sinopsis conflictivas están marcados como pendientes sin inventar información.")
    y = bullet(c, y, "SEO y AEO", "Treinta y siete rutas cuentan con título y descripción propuestos, canonical, indexación y oportunidades de datos estructurados.")
    bullet(c, y, "Validación", "Los 158 archivos fueron revisados en navegador a su ancho objetivo, sin desbordamiento horizontal, imágenes rotas ni estados ocultos expuestos.")
    footer(c, 51, 52)
    c.showPage()

    c.setFillColor(SAGE)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    title(c, "Decisiones del propietario", "Pendiente antes de implementar", "Los diseños conservan marcadores explícitos hasta recibir datos aprobados.")
    c.setFillColor(WHITE)
    c.roundRect(84, 220, 1272, 350, 22, fill=1, stroke=0)
    items = [
        ("Identidad y contacto", "Dominio canónico, razón social, domicilio, teléfono, correo y perfiles oficiales."),
        ("Activos visuales", "Originales de jardines, escultura, filósofos, portadas, retrato, logotipo, QR, stills y arte de series."),
        ("Libros y medios", "Título del libro IV, sinopsis de ¡Déjalo ser!, descargas, ediciones, fechas, duraciones, feeds y transcripciones."),
        ("Eventos y Recursos", "Datos definitivos de eventos, sede de clases 2027 y artículos reales con autoría, fecha e imagen."),
    ]
    y = 520
    for label, detail in items:
        c.setFillColor(GREEN)
        c.circle(118, y + 2, 6, fill=1, stroke=0)
        c.setFillColor(FOREST)
        c.setFont("Helvetica-Bold", 18)
        c.drawString(143, y - 5, label)
        wrapped(c, detail, 370, y - 5, 900, 16, 21)
        y -= 72
    c.setFillColor(FOREST)
    c.setFont("Times-Bold", 25)
    c.drawString(84, 154, "Fuente de verdad: refactor_design/html/*.html")
    c.setFillColor(BODY)
    c.setFont("Helvetica", 16)
    c.drawString(84, 120, "Implementación, metadatos de producción y contenido curricular privado quedan fuera de este alcance.")
    footer(c, 52, 52)
    c.save()


def main() -> None:
    if not PRESENTATION.exists():
        raise SystemExit(f"No existe el PDF base: {PRESENTATION}")

    with tempfile.TemporaryDirectory(prefix="humanismo-pdf-") as temp_dir:
        appendix = Path(temp_dir) / "appendix.pdf"
        output = Path(temp_dir) / "presentation.pdf"
        create_appendix(appendix)

        base = PdfReader(str(PRESENTATION))
        if len(base.pages) < BASE_PAGE_COUNT:
            raise SystemExit(f"El PDF base tiene {len(base.pages)} páginas; se esperaban al menos {BASE_PAGE_COUNT}")
        extra = PdfReader(str(appendix))
        writer = PdfWriter()
        for page in base.pages[:BASE_PAGE_COUNT]:
            writer.add_page(page)
        for page in extra.pages:
            writer.add_page(page)
        writer.add_metadata(
            {
                "/Title": "Humanismo Evolutivo — Propuesta de rediseño",
                "/Author": "Humanismo Evolutivo",
                "/Subject": "Sistema de diseño y actualización de preparación",
                "/Keywords": "Humanismo Evolutivo, diseño, responsive, accesibilidad, SEO, AEO",
            }
        )
        with output.open("wb") as handle:
            writer.write(handle)
        os.replace(output, PRESENTATION)

    print(f"Actualizado: {PRESENTATION} (52 páginas)")


if __name__ == "__main__":
    main()
