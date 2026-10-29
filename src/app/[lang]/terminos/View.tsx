"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { FileText, Mail, Globe } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

type Block =
  | { kind: 'p'; text: string }
  | { kind: 'strong'; text: string }
  | { kind: 'ul'; items: string[] };

const spanish = {
  title: 'Términos y Condiciones de Uso',
  updated: 'Última actualización: noviembre de 2025',
  intro: [
    'El presente documento establece los Términos y Condiciones de Uso del sitio web humanismoevolutivo.com (en adelante, "el Sitio"), propiedad de Fundación Humanismo Evolutivo (en adelante, "la Fundación").',
    'Al acceder o utilizar este Sitio, el usuario (en adelante, "el Usuario") acepta plenamente estos términos. Si no está de acuerdo con alguno de ellos, deberá abstenerse de usar el Sitio.',
  ],
  sections: [
    { title: 'Objeto del Sitio', contact: false, blocks: [
      { kind: 'p', text: 'El Sitio tiene como finalidad difundir la misión, visión, actividades, proyectos y contenidos educativos, culturales, sociales y de desarrollo humano promovidos por Fundación Humanismo Evolutivo.' },
      { kind: 'p', text: 'Asimismo, puede servir como medio de comunicación, contacto, registro o colaboración con la Fundación y sus programas.' },
    ] as Block[] },
    { title: 'Aceptación de los Términos', contact: false, blocks: [
      { kind: 'p', text: 'El acceso, navegación y uso del Sitio implica la aceptación expresa e incondicional de los presentes Términos y Condiciones, así como de la Política de Privacidad publicada en el mismo.' },
      { kind: 'p', text: 'El Usuario reconoce haber leído y comprendido estos documentos antes de utilizar el Sitio.' },
    ] as Block[] },
    { title: 'Uso permitido', contact: false, blocks: [
      { kind: 'p', text: 'El Usuario se compromete a utilizar el Sitio y sus contenidos de manera responsable, ética y conforme a la ley, evitando cualquier acción que pueda:' },
      { kind: 'ul', items: [
        'Dañar, sobrecargar, inutilizar o afectar el funcionamiento del Sitio.',
        'Suplantar la identidad de otras personas o instituciones.',
        'Introducir virus, programas maliciosos o cualquier código informático destinado a alterar los sistemas del Sitio o de terceros.',
        'Utilizar los contenidos del Sitio con fines comerciales, políticos o contrarios a la misión de la Fundación.',
      ] },
      { kind: 'strong', text: 'La Fundación se reserva el derecho de restringir o cancelar el acceso al Sitio a cualquier Usuario que infrinja estas condiciones.' },
    ] as Block[] },
    { title: 'Propiedad intelectual', contact: false, blocks: [
      { kind: 'p', text: 'Todo el contenido del Sitio  - incluyendo textos, imágenes, fotografías, gráficos, logotipos, videos, audios, documentos, materiales descargables y diseños -  es propiedad de Fundación Humanismo Evolutivo o se utiliza con la autorización correspondiente de sus titulares.' },
      { kind: 'p', text: 'Queda estrictamente prohibida su reproducción, distribución, modificación o uso sin autorización previa y por escrito de la Fundación.' },
      { kind: 'p', text: 'El uso legítimo de los materiales está limitado a fines informativos, educativos y no comerciales, siempre citando la fuente "Fundación Humanismo Evolutivo".' },
    ] as Block[] },
    { title: 'Enlaces externos', contact: false, blocks: [
      { kind: 'p', text: 'El Sitio puede contener enlaces a sitios de terceros con el fin de facilitar el acceso a información adicional.' },
      { kind: 'p', text: 'La Fundación no controla ni se hace responsable del contenido, políticas o prácticas de privacidad de dichos sitios.' },
      { kind: 'p', text: 'La inclusión de estos enlaces no implica patrocinio, respaldo o asociación alguna con los responsables de dichos portales.' },
    ] as Block[] },
    { title: 'Donaciones y colaboraciones', contact: false, blocks: [
      { kind: 'p', text: 'En caso de que el Sitio ofrezca opciones para realizar donaciones en línea, éstas se efectuarán mediante plataformas seguras y certificadas.' },
      { kind: 'p', text: 'La Fundación no almacena información financiera ni bancaria de los donantes.' },
      { kind: 'p', text: 'El Usuario deberá revisar las políticas de privacidad y condiciones de las plataformas de pago antes de realizar cualquier transacción.' },
      { kind: 'p', text: 'Todas las donaciones son voluntarias y destinadas a los fines sociales, culturales y educativos establecidos en los estatutos de la Fundación.' },
    ] as Block[] },
    { title: 'Responsabilidad', contact: false, blocks: [
      { kind: 'p', text: 'La Fundación no garantiza que el Sitio funcione sin interrupciones o errores técnicos, aunque realiza esfuerzos razonables para mantenerlo en buen estado y actualizado.' },
      { kind: 'p', text: 'El uso del Sitio se realiza bajo la responsabilidad del Usuario.' },
      { kind: 'p', text: 'La Fundación no será responsable de daños o perjuicios derivados del uso o imposibilidad de uso del Sitio, ni de los contenidos proporcionados por terceros.' },
    ] as Block[] },
    { title: 'Protección de datos personales', contact: false, blocks: [
      { kind: 'p', text: 'El tratamiento de los datos personales recabados a través del Sitio se rige por la Política de Privacidad disponible en humanismoevolutivo.com.' },
      { kind: 'p', text: 'Al utilizar el Sitio, el Usuario acepta expresamente el tratamiento de sus datos conforme a lo establecido en dicha política.' },
    ] as Block[] },
    { title: 'Modificaciones', contact: false, blocks: [
      { kind: 'p', text: 'La Fundación podrá modificar en cualquier momento los presentes Términos y Condiciones.' },
      { kind: 'p', text: 'Cualquier cambio será publicado en esta misma sección, indicando la fecha de actualización.' },
      { kind: 'p', text: 'El uso continuado del Sitio después de los cambios constituye la aceptación de los nuevos términos.' },
    ] as Block[] },
    { title: 'Legislación aplicable y jurisdicción', contact: false, blocks: [
      { kind: 'p', text: 'Estos Términos y Condiciones se rigen por las leyes de los Estados Unidos Mexicanos.' },
      { kind: 'p', text: 'Cualquier controversia que derive de la interpretación o aplicación de los mismos será resuelta ante los tribunales competentes de Quintana Roo, México, renunciando las partes a cualquier otro fuero que pudiera corresponderles por razón de su domicilio presente o futuro.' },
    ] as Block[] },
    { title: 'Contacto', contact: true, blocks: [
      { kind: 'p', text: 'Para cualquier duda, comentario o solicitud relacionada con estos Términos y Condiciones, el Usuario puede escribir a:' },
    ] as Block[] },
  ],
  closing: 'Inspirando conciencia, evolución y conexión entre las personas y el mundo.',
};

const english = {
  title: 'Terms and Conditions of Use',
  updated: 'Last updated: November 2025',
  intro: [
    'This document sets out the Terms and Conditions of Use of the website humanismoevolutivo.com (the "Site"), owned by Fundación Humanismo Evolutivo (the "Foundation").',
    'By accessing or using this Site, the user (the "User") fully accepts these terms. If you do not agree with any of them, you should refrain from using the Site.',
  ],
  sections: [
    { title: 'Purpose of the Site', contact: false, blocks: [
      { kind: 'p', text: 'The purpose of the Site is to share the mission, vision, activities, projects, and educational, cultural, social, and human-development content promoted by Fundación Humanismo Evolutivo.' },
      { kind: 'p', text: 'It may also serve as a means of communication, contact, registration, or collaboration with the Foundation and its programs.' },
    ] as Block[] },
    { title: 'Acceptance of the Terms', contact: false, blocks: [
      { kind: 'p', text: 'Accessing, browsing, and using the Site implies express and unconditional acceptance of these Terms and Conditions, as well as of the Privacy Policy published on the Site.' },
      { kind: 'p', text: 'The User acknowledges having read and understood these documents before using the Site.' },
    ] as Block[] },
    { title: 'Permitted use', contact: false, blocks: [
      { kind: 'p', text: 'The User agrees to use the Site and its contents in a responsible, ethical, and lawful manner, and to avoid any action that could:' },
      { kind: 'ul', items: [
        'Damage, overload, disable, or impair the operation of the Site.',
        'Impersonate other people or institutions.',
        'Introduce viruses, malicious programs, or any computer code intended to alter the systems of the Site or of third parties.',
        'Use the contents of the Site for commercial or political purposes, or for purposes contrary to the Foundation\'s mission.',
      ] },
      { kind: 'strong', text: 'The Foundation reserves the right to restrict or cancel access to the Site for any User who breaches these conditions.' },
    ] as Block[] },
    { title: 'Intellectual property', contact: false, blocks: [
      { kind: 'p', text: 'All content on the Site, including texts, images, photographs, graphics, logos, videos, audio, documents, downloadable materials, and designs, is the property of Fundación Humanismo Evolutivo or is used with the corresponding authorization of its owners.' },
      { kind: 'p', text: 'Reproduction, distribution, modification, or use without the Foundation\'s prior written authorization is strictly prohibited.' },
      { kind: 'p', text: 'Legitimate use of the materials is limited to informational, educational, and non-commercial purposes, always citing the source "Fundación Humanismo Evolutivo".' },
    ] as Block[] },
    { title: 'External links', contact: false, blocks: [
      { kind: 'p', text: 'The Site may contain links to third-party sites in order to make additional information easier to reach.' },
      { kind: 'p', text: 'The Foundation does not control, and is not responsible for, the content, policies, or privacy practices of those sites.' },
      { kind: 'p', text: 'Including these links does not imply sponsorship, endorsement, or any association with the people responsible for those sites.' },
    ] as Block[] },
    { title: 'Donations and collaborations', contact: false, blocks: [
      { kind: 'p', text: 'If the Site offers options for making donations online, they will be processed through secure, certified platforms.' },
      { kind: 'p', text: 'The Foundation does not store donors\' financial or banking information.' },
      { kind: 'p', text: 'The User should review the privacy policies and conditions of the payment platforms before making any transaction.' },
      { kind: 'p', text: 'All donations are voluntary and are intended for the social, cultural, and educational purposes set out in the Foundation\'s bylaws.' },
    ] as Block[] },
    { title: 'Liability', contact: false, blocks: [
      { kind: 'p', text: 'The Foundation does not guarantee that the Site will operate without interruptions or technical errors, although it makes reasonable efforts to keep it in good condition and up to date.' },
      { kind: 'p', text: 'Use of the Site is at the User\'s own responsibility.' },
      { kind: 'p', text: 'The Foundation will not be liable for damages arising from the use of, or inability to use, the Site, or from content provided by third parties.' },
    ] as Block[] },
    { title: 'Protection of personal data', contact: false, blocks: [
      { kind: 'p', text: 'The processing of personal data collected through the Site is governed by the Privacy Policy available at humanismoevolutivo.com.' },
      { kind: 'p', text: 'By using the Site, the User expressly accepts the processing of their data as set out in that policy.' },
    ] as Block[] },
    { title: 'Changes', contact: false, blocks: [
      { kind: 'p', text: 'The Foundation may change these Terms and Conditions at any time.' },
      { kind: 'p', text: 'Any change will be published in this same section, with the date of the update indicated.' },
      { kind: 'p', text: 'Continued use of the Site after the changes constitutes acceptance of the new terms.' },
    ] as Block[] },
    { title: 'Applicable law and jurisdiction', contact: false, blocks: [
      { kind: 'p', text: 'These Terms and Conditions are governed by the laws of the United Mexican States.' },
      { kind: 'p', text: 'Any dispute arising from their interpretation or application will be resolved before the competent courts of Quintana Roo, Mexico, and the parties waive any other venue that might correspond to them by reason of their present or future domicile.' },
    ] as Block[] },
    { title: 'Contact', contact: true, blocks: [
      { kind: 'p', text: 'For any question, comment, or request related to these Terms and Conditions, the User may write to:' },
    ] as Block[] },
  ],
  closing: 'Inspiring consciousness, evolution, and connection between people and the world.',
};

const Terminos = () => {
  const { language } = useLanguage();
  const copy = language === 'en' ? english : spanish;
  return (
    <PageWrapper>
      <article lang={language} className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-12">
            <FileText className="w-16 h-16 mx-auto mb-6 text-[#806018]" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{copy.title}</h1>
            <p className="text-xl text-muted-foreground">Fundación Humanismo Evolutivo</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.32em] text-[#806018]">Transpersonal</p>
            <p className="text-sm text-muted-foreground mt-2">{copy.updated}</p>
          </div>
          <div className="prose prose-lg max-w-none mb-12">
            {copy.intro.map((paragraph, index) => <p key={paragraph} className={`text-lg leading-relaxed ${index === copy.intro.length - 1 ? 'mb-12' : 'mb-8'}`}>{paragraph}</p>)}
          </div>
          <div className="space-y-12">
            {copy.sections.map((section, index) => <section key={section.title}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[#806018]">{index + 1}.</span>
                {section.title}
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                {section.blocks.map((block, blockIndex) => {
                  if (block.kind === 'ul') return <ul key={blockIndex} className="list-disc pl-6 space-y-2">{block.items.map(item => <li key={item}>{item}</li>)}</ul>;
                  if (block.kind === 'strong') return <p key={blockIndex} className="font-semibold">{block.text}</p>;
                  return <p key={blockIndex}>{block.text}</p>;
                })}
                {section.contact ? <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-accent/20 p-4 rounded-lg">
                    <Mail className="w-5 h-5 text-[#806018]" />
                    <a href="mailto:humanismoevolutivo@gmail.com" className="text-[#806018] hover:underline font-semibold">humanismoevolutivo@gmail.com</a>
                  </div>
                  <div className="flex items-center gap-2 bg-accent/20 p-4 rounded-lg">
                    <Globe className="w-5 h-5 text-[#806018]" />
                    <a href="https://humanismoevolutivo.com" target="_blank" rel="noopener noreferrer" className="text-[#806018] hover:underline font-semibold">humanismoevolutivo.com</a>
                  </div>
                </div> : null}
              </div>
            </section>)}
          </div>
          <div className="mt-16 pt-8 border-t border-border">
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-2xl font-bold">Fundación Humanismo Evolutivo</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.32em] text-[#806018]">Transpersonal</p>
              </div>
              <p className="text-lg italic text-muted-foreground">{copy.closing}</p>
            </div>
          </div>
        </motion.div>
      </article>
    </PageWrapper>
  );
};

export default Terminos;
