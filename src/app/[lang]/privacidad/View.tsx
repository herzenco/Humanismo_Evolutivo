"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { Shield, Mail, Globe } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

type Block =
  | { kind: 'p'; text: string }
  | { kind: 'strong'; text: string }
  | { kind: 'ul'; items: string[] };

const spanish = {
  title: 'Política de Privacidad',
  updated: 'Última actualización: noviembre de 2025',
  intro: [
    'En Fundación Humanismo Evolutivo, estamos comprometidos con la protección de los datos personales de nuestros beneficiarios, colaboradores, aliados y visitantes del sitio web humanismoevolutivo.com.',
    'La presente Política de Privacidad describe cómo recabamos, utilizamos, protegemos y, en su caso, compartimos la información personal que obtenemos a través de este sitio y de otros medios electrónicos relacionados con nuestras actividades.',
  ],
  sections: [
    { title: 'Datos personales que recabamos', blocks: [
      { kind: 'p', text: 'Podemos solicitar y conservar los siguientes datos personales:' },
      { kind: 'ul', items: [
        'Nombre completo y datos de contacto (correo electrónico, número telefónico).',
        'Información profesional o académica (en caso de colaboraciones o proyectos).',
        'Datos de identificación digital (cookies, dirección IP, tipo de navegador, ubicación aproximada).',
        'En caso de donaciones: información necesaria para procesar pagos de manera segura, gestionada por proveedores certificados.',
      ] },
      { kind: 'strong', text: 'No recabamos datos personales sensibles sin el consentimiento expreso del titular.' },
    ] as Block[] },
    { title: 'Finalidades del tratamiento de los datos', blocks: [
      { kind: 'p', text: 'Los datos personales serán utilizados exclusivamente para:' },
      { kind: 'ul', items: [
        'Gestionar la comunicación y participación en programas, eventos y actividades de la Fundación.',
        'Brindar información sobre proyectos, publicaciones y campañas sociales, educativas o culturales.',
        'Cumplir obligaciones legales y administrativas derivadas de nuestras operaciones.',
        'Mejorar la experiencia de navegación y el funcionamiento del sitio web.',
      ] },
      { kind: 'p', text: 'Si el titular no desea recibir comunicaciones o boletines informativos, podrá solicitarlo en cualquier momento conforme al punto 7 de esta política.' },
    ] as Block[] },
    { title: 'Uso de cookies y tecnologías similares', blocks: [
      { kind: 'p', text: 'El sitio web humanismoevolutivo.com utiliza cookies y tecnologías de seguimiento para analizar el tráfico, personalizar contenidos y mejorar la experiencia del usuario.' },
      { kind: 'p', text: 'El visitante puede configurar su navegador para rechazar o eliminar cookies; sin embargo, algunas funcionalidades del sitio podrían verse afectadas.' },
    ] as Block[] },
    { title: 'Transferencia y resguardo de la información', blocks: [
      { kind: 'p', text: 'Fundación Humanismo Evolutivo no comparte, vende ni alquila datos personales a terceros.' },
      { kind: 'p', text: 'Solo se podrán transferir datos cuando:' },
      { kind: 'ul', items: [
        'Exista obligación legal o requerimiento de una autoridad competente.',
        'Sea necesario para cumplir con servicios relacionados con los fines de la Fundación (por ejemplo, proveedores de alojamiento web, envío de correos o procesamiento de pagos), quienes están obligados por contrato a mantener la confidencialidad de la información.',
      ] },
      { kind: 'p', text: 'Los datos se almacenan en servidores seguros con medidas técnicas, administrativas y físicas para prevenir el acceso no autorizado, la pérdida o el uso indebido.' },
    ] as Block[] },
    { title: 'Conservación de los datos', blocks: [
      { kind: 'p', text: 'Los datos personales se conservarán únicamente durante el tiempo necesario para cumplir las finalidades descritas en esta política o conforme a las disposiciones legales aplicables.' },
      { kind: 'p', text: 'Una vez cumplida la finalidad, los datos serán eliminados o anonimizados de forma segura.' },
    ] as Block[] },
    { title: 'Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)', blocks: [
      { kind: 'p', text: 'El titular de los datos podrá ejercer sus derechos ARCO enviando una solicitud al correo electrónico:' },
      { kind: 'p', text: 'La solicitud deberá incluir:' },
      { kind: 'ul', items: [
        'Nombre completo y medio de contacto para recibir respuesta.',
        'Descripción clara de los datos respecto de los cuales desea ejercer sus derechos.',
        'Documentos que acrediten su identidad o representación legal.',
      ] },
      { kind: 'p', text: 'Las solicitudes serán atendidas en un plazo máximo de 20 días hábiles, conforme a la legislación mexicana en materia de protección de datos personales.' },
    ] as Block[] },
    { title: 'Revocación del consentimiento y limitación del uso', blocks: [
      { kind: 'p', text: 'El titular podrá revocar su consentimiento para el tratamiento de sus datos personales o limitar su uso con fines específicos, enviando una solicitud al correo humanismoevolutivo@gmail.com.' },
      { kind: 'p', text: 'La revocación no tendrá efectos retroactivos sobre el tratamiento previamente realizado con base en el consentimiento otorgado.' },
    ] as Block[] },
    { title: 'Enlaces a sitios externos', blocks: [
      { kind: 'p', text: 'El sitio web puede contener enlaces a otros portales o plataformas de terceros. Fundación Humanismo Evolutivo no se responsabiliza por las prácticas de privacidad ni por el contenido de dichos sitios.' },
      { kind: 'p', text: 'Se recomienda revisar sus políticas antes de proporcionar información personal.' },
    ] as Block[] },
    { title: 'Modificaciones a la Política de Privacidad', blocks: [
      { kind: 'p', text: 'La Fundación podrá modificar en cualquier momento esta Política de Privacidad para adaptarla a nuevas disposiciones legales o a cambios en sus prácticas internas.' },
      { kind: 'p', text: 'Las actualizaciones se publicarán en humanismoevolutivo.com con la fecha de última modificación visible en la parte superior del documento.' },
    ] as Block[] },
    { title: 'Aceptación de los términos', blocks: [
      { kind: 'p', text: 'El uso de este sitio web implica la aceptación plena de esta Política de Privacidad.' },
      { kind: 'p', text: 'Si el usuario no está de acuerdo con los términos aquí establecidos, deberá abstenerse de utilizar el sitio o de proporcionar información personal.' },
    ] as Block[] },
  ],
  closing: 'Comprometida con la conciencia, el conocimiento y la integridad en cada acción.',
};

const english = {
  title: 'Privacy Policy',
  updated: 'Last updated: November 2025',
  intro: [
    'At Fundación Humanismo Evolutivo, we are committed to protecting the personal data of our beneficiaries, collaborators, allies, and visitors to the website humanismoevolutivo.com.',
    'This Privacy Policy describes how we collect, use, protect, and, where applicable, share the personal information we obtain through this site and through other electronic means related to our activities.',
  ],
  sections: [
    { title: 'Personal data we collect', blocks: [
      { kind: 'p', text: 'We may request and keep the following personal data:' },
      { kind: 'ul', items: [
        'Full name and contact details (email address, telephone number).',
        'Professional or academic information (in the case of collaborations or projects).',
        'Digital identification data (cookies, IP address, browser type, approximate location).',
        'In the case of donations: the information needed to process payments securely, handled by certified providers.',
      ] },
      { kind: 'strong', text: 'We do not collect sensitive personal data without the data subject\'s express consent.' },
    ] as Block[] },
    { title: 'Purposes of data processing', blocks: [
      { kind: 'p', text: 'Personal data will be used exclusively to:' },
      { kind: 'ul', items: [
        'Manage communication and participation in the Foundation\'s programs, events, and activities.',
        'Provide information about projects, publications, and social, educational, or cultural campaigns.',
        'Meet legal and administrative obligations arising from our operations.',
        'Improve browsing and the operation of the website.',
      ] },
      { kind: 'p', text: 'If the data subject does not wish to receive communications or newsletters, they may request this at any time under section 7 of this policy.' },
    ] as Block[] },
    { title: 'Use of cookies and similar technologies', blocks: [
      { kind: 'p', text: 'The website humanismoevolutivo.com uses cookies and tracking technologies to analyze traffic, personalize content, and improve the user experience.' },
      { kind: 'p', text: 'Visitors may configure their browser to refuse or delete cookies; however, some features of the site may be affected.' },
    ] as Block[] },
    { title: 'Transfer and safeguarding of information', blocks: [
      { kind: 'p', text: 'Fundación Humanismo Evolutivo does not share, sell, or rent personal data to third parties.' },
      { kind: 'p', text: 'Data may be transferred only when:' },
      { kind: 'ul', items: [
        'There is a legal obligation or a request from a competent authority.',
        'It is necessary to provide services related to the Foundation\'s purposes (for example, web hosting providers, email delivery, or payment processing), and those providers are contractually required to keep the information confidential.',
      ] },
      { kind: 'p', text: 'Data is stored on secure servers with technical, administrative, and physical measures to prevent unauthorized access, loss, or misuse.' },
    ] as Block[] },
    { title: 'Retention of data', blocks: [
      { kind: 'p', text: 'Personal data will be kept only for as long as needed to fulfill the purposes described in this policy or as required by applicable law.' },
      { kind: 'p', text: 'Once the purpose has been fulfilled, the data will be securely deleted or anonymized.' },
    ] as Block[] },
    { title: 'ARCO rights (Access, Rectification, Cancellation, and Opposition)', blocks: [
      { kind: 'p', text: 'The data subject may exercise their ARCO rights by sending a request to the email address:' },
      { kind: 'p', text: 'The request must include:' },
      { kind: 'ul', items: [
        'Full name and a contact method for receiving a response.',
        'A clear description of the data in relation to which they wish to exercise their rights.',
        'Documents that prove their identity or legal representation.',
      ] },
      { kind: 'p', text: 'Requests will be answered within a maximum of 20 business days, in accordance with Mexican personal data protection law.' },
    ] as Block[] },
    { title: 'Withdrawal of consent and limitation of use', blocks: [
      { kind: 'p', text: 'The data subject may withdraw consent for the processing of their personal data, or limit its use for specific purposes, by sending a request to humanismoevolutivo@gmail.com.' },
      { kind: 'p', text: 'Withdrawal does not have retroactive effect on processing already carried out on the basis of the consent that was given.' },
    ] as Block[] },
    { title: 'Links to external sites', blocks: [
      { kind: 'p', text: 'The website may contain links to other third-party portals or platforms. Fundación Humanismo Evolutivo is not responsible for the privacy practices or the content of those sites.' },
      { kind: 'p', text: 'We recommend reviewing their policies before providing personal information.' },
    ] as Block[] },
    { title: 'Changes to the Privacy Policy', blocks: [
      { kind: 'p', text: 'The Foundation may change this Privacy Policy at any time in order to adapt it to new legal requirements or to changes in its internal practices.' },
      { kind: 'p', text: 'Updates will be published on humanismoevolutivo.com, with the date of the latest change visible at the top of the document.' },
    ] as Block[] },
    { title: 'Acceptance of these terms', blocks: [
      { kind: 'p', text: 'Use of this website implies full acceptance of this Privacy Policy.' },
      { kind: 'p', text: 'If the user does not agree with the terms set out here, they should refrain from using the site or from providing personal information.' },
    ] as Block[] },
  ],
  closing: 'Committed to consciousness, knowledge, and integrity in every action.',
};

const Privacidad = () => {
  const { language } = useLanguage();
  const copy = language === 'en' ? english : spanish;
  const emailAfter = language === 'en' ? 0 : 0;
  return (
    <PageWrapper>
      <article lang={language} className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 mx-auto mb-6 text-[#806018]" />
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
                  const showEmail = section.title.startsWith(language === 'en' ? 'ARCO' : 'Derechos ARCO') && blockIndex === emailAfter;
                  return <div key={blockIndex}>
                    <p>{block.text}</p>
                    {showEmail ? <div className="flex items-center gap-2 bg-accent/20 p-4 rounded-lg mt-4">
                      <Mail className="w-5 h-5 text-[#806018]" />
                      <a href="mailto:humanismoevolutivo@gmail.com" className="text-[#806018] hover:underline font-semibold">humanismoevolutivo@gmail.com</a>
                    </div> : null}
                  </div>;
                })}
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
              <div className="flex flex-col items-center gap-3 pt-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#806018]" />
                  <a href="mailto:humanismoevolutivo@gmail.com" className="text-[#806018] hover:underline">humanismoevolutivo@gmail.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#806018]" />
                  <a href="https://humanismoevolutivo.com" target="_blank" rel="noopener noreferrer" className="text-[#806018] hover:underline">humanismoevolutivo.com</a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </article>
    </PageWrapper>
  );
};

export default Privacidad;
