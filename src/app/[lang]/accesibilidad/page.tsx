import { notFound } from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({
    title: lang === 'es' ? 'Declaración de accesibilidad' : 'Accessibility statement',
    description: lang === 'es'
      ? 'Compromiso, medidas y canales de apoyo de accesibilidad de Humanismo Evolutivo.'
      : 'Humanismo Evolutivo accessibility commitment, measures, and support channels.',
    path: '/accesibilidad',
    language: lang,
    index: true,
  });
}

export default async function AccessibilityPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const es = lang === 'es';
  return <PageWrapper><article className="container mx-auto max-w-4xl px-6 py-16" lang={lang}>
    <p className="design-eyebrow">Humanismo Evolutivo</p>
    <h1 className="mb-6 mt-3 text-4xl font-bold md:text-5xl">{es ? 'Declaración de accesibilidad' : 'Accessibility statement'}</h1>
    <p className="mb-10 text-lg leading-8">{es
      ? 'Trabajamos para que este sitio pueda ser utilizado por el mayor número de personas posible, incluidas quienes usan lectores de pantalla, navegación por teclado, ampliación o configuraciones de movimiento reducido.'
      : 'We work to make this site usable by as many people as possible, including people who use screen readers, keyboard navigation, zoom, or reduced-motion settings.'}</p>
    <div className="space-y-10 text-base leading-7">
      <section><h2 className="mb-3 text-2xl font-bold">{es ? 'Objetivo técnico' : 'Technical target'}</h2><p>{es
        ? 'Nuestro objetivo es cumplir con las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2, nivel AA. Combinamos pruebas automatizadas con revisión manual de teclado, enfoque, ampliación, contraste, lectores de pantalla y contenido multimedia.'
        : 'Our target is Web Content Accessibility Guidelines (WCAG) 2.2 Level AA. We combine automated testing with manual review of keyboard use, focus, zoom, contrast, screen readers, and multimedia.'}</p></section>
      <section><h2 className="mb-3 text-2xl font-bold">{es ? 'Medidas disponibles' : 'Available measures'}</h2><ul className="list-disc space-y-2 pl-6">
        <li>{es ? 'Enlace para saltar al contenido principal y navegación operable por teclado.' : 'Skip-to-content link and keyboard-operable navigation.'}</li>
        <li>{es ? 'Indicadores de enfoque visibles, estructura semántica y títulos descriptivos.' : 'Visible focus indicators, semantic structure, and descriptive titles.'}</li>
        <li>{es ? 'Compatibilidad con ampliación y preferencias de movimiento reducido.' : 'Support for zoom and reduced-motion preferences.'}</li>
        <li>{es ? 'Alternativas de texto para imágenes informativas y nombres accesibles para controles.' : 'Text alternatives for informative images and accessible names for controls.'}</li>
      </ul></section>
      <section><h2 className="mb-3 text-2xl font-bold">{es ? 'Limitaciones conocidas' : 'Known limitations'}</h2><p>{es
        ? 'Algunos libros históricos en PDF aún no contienen una estructura de etiquetas completa. También dependemos de plataformas externas para ciertos reproductores y formularios. Estamos trabajando en su remediación; mientras tanto, podemos proporcionar una alternativa accesible o asistencia para obtener el contenido.'
        : 'Some historical PDF books do not yet contain a complete tag structure. We also depend on external platforms for some players and forms. We are working on remediation; meanwhile, we can provide an accessible alternative or help you obtain the content.'}</p></section>
      <section><h2 className="mb-3 text-2xl font-bold">{es ? 'Solicita ayuda o reporta una barrera' : 'Request help or report a barrier'}</h2><p>{es
        ? 'Si encuentras una barrera, dinos la página, el contenido que necesitas y, si deseas, la tecnología de asistencia que utilizas. Procuraremos responder dentro de cinco días hábiles.'
        : 'If you encounter a barrier, tell us the page, the content you need, and, if you wish, the assistive technology you use. We aim to respond within five business days.'}</p><p className="mt-4"><a className="font-semibold text-[#6b5319] underline underline-offset-4" href="mailto:humanismoevolutivo@gmail.com?subject=Accesibilidad%20del%20sitio">humanismoevolutivo@gmail.com</a></p></section>
      <p className="border-t pt-6 text-sm text-muted-foreground">{es ? 'Última revisión: 12 de noviembre de 2026.' : 'Last reviewed: November 12, 2026.'}</p>
    </div>
  </article></PageWrapper>;
}
