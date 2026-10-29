"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { Shield, Mail, Globe } from "lucide-react";

const Privacidad = () => {
  return (
    <PageWrapper>
      <article lang="es" className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 mx-auto mb-6 text-gold" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Política de Privacidad
            </h1>
            <p className="text-xl text-muted-foreground">
              Fundación Humanismo Evolutivo
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.32em] text-gold">
              Transpersonal
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Última actualización: noviembre de 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg leading-relaxed mb-8">
              En Fundación Humanismo Evolutivo, estamos comprometidos con la protección de los datos personales de nuestros beneficiarios, colaboradores, aliados y visitantes del sitio web humanismoevolutivo.com.
            </p>
            <p className="text-lg leading-relaxed mb-12">
              La presente Política de Privacidad describe cómo recabamos, utilizamos, protegemos y, en su caso, compartimos la información personal que obtenemos a través de este sitio y de otros medios electrónicos relacionados con nuestras actividades.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-gold">1.</span>
                Datos personales que recabamos
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>Podemos solicitar y conservar los siguientes datos personales:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Nombre completo y datos de contacto (correo electrónico, número telefónico).</li>
                  <li>Información profesional o académica (en caso de colaboraciones o proyectos).</li>
                  <li>Datos de identificación digital (cookies, dirección IP, tipo de navegador, ubicación aproximada).</li>
                  <li>En caso de donaciones: información necesaria para procesar pagos de manera segura, gestionada por proveedores certificados.</li>
                </ul>
                <p className="font-semibold">
                  No recabamos datos personales sensibles sin el consentimiento expreso del titular.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-gold">2.</span>
                Finalidades del tratamiento de los datos
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>Los datos personales serán utilizados exclusivamente para:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Gestionar la comunicación y participación en programas, eventos y actividades de la Fundación.</li>
                  <li>Brindar información sobre proyectos, publicaciones y campañas sociales, educativas o culturales.</li>
                  <li>Cumplir obligaciones legales y administrativas derivadas de nuestras operaciones.</li>
                  <li>Mejorar la experiencia de navegación y el funcionamiento del sitio web.</li>
                </ul>
                <p>
                  Si el titular no desea recibir comunicaciones o boletines informativos, podrá solicitarlo en cualquier momento conforme al punto 7 de esta política.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-gold">3.</span>
                Uso de cookies y tecnologías similares
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  El sitio web humanismoevolutivo.com utiliza cookies y tecnologías de seguimiento para analizar el tráfico, personalizar contenidos y mejorar la experiencia del usuario.
                </p>
                <p>
                  El visitante puede configurar su navegador para rechazar o eliminar cookies; sin embargo, algunas funcionalidades del sitio podrían verse afectadas.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-gold">4.</span>
                Transferencia y resguardo de la información
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  Fundación Humanismo Evolutivo no comparte, vende ni alquila datos personales a terceros.
                </p>
                <p>Solo se podrán transferir datos cuando:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Exista obligación legal o requerimiento de una autoridad competente.</li>
                  <li>Sea necesario para cumplir con servicios relacionados con los fines de la Fundación (por ejemplo, proveedores de alojamiento web, envío de correos o procesamiento de pagos), quienes están obligados por contrato a mantener la confidencialidad de la información.</li>
                </ul>
                <p>
                  Los datos se almacenan en servidores seguros con medidas técnicas, administrativas y físicas para prevenir el acceso no autorizado, la pérdida o el uso indebido.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-gold">5.</span>
                Conservación de los datos
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  Los datos personales se conservarán únicamente durante el tiempo necesario para cumplir las finalidades descritas en esta política o conforme a las disposiciones legales aplicables.
                </p>
                <p>
                  Una vez cumplida la finalidad, los datos serán eliminados o anonimizados de forma segura.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-gold">6.</span>
                Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  El titular de los datos podrá ejercer sus derechos ARCO enviando una solicitud al correo electrónico:
                </p>
                <div className="flex items-center gap-2 bg-accent/20 p-4 rounded-lg">
                  <Mail className="w-5 h-5 text-gold" />
                  <a
                    href="mailto:hello@yosoynosotros.com"
                    className="text-gold hover:underline font-semibold"
                  >
                    hello@yosoynosotros.com
                  </a>
                </div>
                <p>La solicitud deberá incluir:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Nombre completo y medio de contacto para recibir respuesta.</li>
                  <li>Descripción clara de los datos respecto de los cuales desea ejercer sus derechos.</li>
                  <li>Documentos que acrediten su identidad o representación legal.</li>
                </ul>
                <p>
                  Las solicitudes serán atendidas en un plazo máximo de 20 días hábiles, conforme a la legislación mexicana en materia de protección de datos personales.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-gold">7.</span>
                Revocación del consentimiento y limitación del uso
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  El titular podrá revocar su consentimiento para el tratamiento de sus datos personales o limitar su uso con fines específicos, enviando una solicitud al correo hello@yosoynosotros.com.
                </p>
                <p>
                  La revocación no tendrá efectos retroactivos sobre el tratamiento previamente realizado con base en el consentimiento otorgado.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-gold">8.</span>
                Enlaces a sitios externos
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  El sitio web puede contener enlaces a otros portales o plataformas de terceros. Fundación Humanismo Evolutivo no se responsabiliza por las prácticas de privacidad ni por el contenido de dichos sitios.
                </p>
                <p>
                  Se recomienda revisar sus políticas antes de proporcionar información personal.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-gold">9.</span>
                Modificaciones a la Política de Privacidad
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  La Fundación podrá modificar en cualquier momento esta Política de Privacidad para adaptarla a nuevas disposiciones legales o a cambios en sus prácticas internas.
                </p>
                <p>
                  Las actualizaciones se publicarán en humanismoevolutivo.com con la fecha de última modificación visible en la parte superior del documento.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-gold">10.</span>
                Aceptación de los términos
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  El uso de este sitio web implica la aceptación plena de esta Política de Privacidad.
                </p>
                <p>
                  Si el usuario no está de acuerdo con los términos aquí establecidos, deberá abstenerse de utilizar el sitio o de proporcionar información personal.
                </p>
              </div>
            </section>
          </div>

          {/* Footer Section */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-2xl font-bold">Fundación Humanismo Evolutivo</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.32em] text-gold">
                  Transpersonal
                </p>
              </div>
              <p className="text-lg italic text-muted-foreground">
                Comprometida con la conciencia, el conocimiento y la integridad en cada acción.
              </p>
              <div className="flex flex-col items-center gap-3 pt-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gold" />
                  <a
                    href="mailto:hello@yosoynosotros.com"
                    className="text-gold hover:underline"
                  >
                    hello@yosoynosotros.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gold" />
                  <a
                    href="https://humanismoevolutivo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline"
                  >
                    humanismoevolutivo.com
                  </a>
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
