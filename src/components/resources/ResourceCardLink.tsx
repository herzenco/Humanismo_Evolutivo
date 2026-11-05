"use client";

import type { ReactNode } from "react";
import Link from "next/link";

type ResourceCardLinkProps = {
  children: ReactNode;
  slug: string;
};

export function ResourceCardLink({ children, slug }: ResourceCardLinkProps) {
  const trackOpen = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "resource_opened",
      content_slug: slug,
    });
  };

  return (
    <Link
      href={`/resources/${slug}/`}
      onClick={trackOpen}
      className="group relative block h-full overflow-hidden rounded-3xl border border-gold/15 bg-white p-8 shadow-lg transition duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 md:p-10"
    >
      {children}
    </Link>
  );
}
