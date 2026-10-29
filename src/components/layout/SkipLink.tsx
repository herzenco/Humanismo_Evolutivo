'use client';

import { usePathname } from 'next/navigation';

export function skipLinkLabel(pathname: string | null) {
  return pathname === '/en' || pathname?.startsWith('/en/') ? 'Skip to content' : 'Saltar al contenido';
}

export default function SkipLink() {
  return <a href="#contenido-principal" className="skip-to-content">{skipLinkLabel(usePathname())}</a>;
}
