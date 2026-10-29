"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { FileText, Mail, Globe } from "lucide-react";

const Terminos = () => {
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
            <FileText className="w-16 h-16 mx-auto mb-6 text-[#806018]" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Términos y Condiciones de Uso
            </h1>
            <p className="text-xl text-muted-foreground">
              Fundación Humanismo Evolutivo
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.32em] text-[#806018]">
              Transpersonal
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Última actualización: noviembre de 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg leading-relaxed mb-8">
              El presente documento establece los Términos y Condiciones de Uso del sitio web humanismoevolutivo.com (en adelante, "el Sitio"), propiedad de Fundación Humanismo Evolutivo (en adelante, "la Fundación").
            </p>
            <p className="text-lg leading-relaxed mb-12">
              Al acceder o utilizar este Sitio, el usuario (en adelante, "el Usuario") acepta plenamente estos términos. Si no está de acuerdo con alguno de ellos, deberá abstenerse de usar el Sitio.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[#806018]">1.</span>
                Objeto del Sitio
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  El Sitio tiene como finalidad difundir la misión, visión, actividades, proyectos y contenidos educativos, culturales, sociales y de desarrollo humano promovidos por Fundación Humanismo Evolutivo.
                </p>
                <p>
                  Asimismo, puede servir como medio de comunicación, contacto, registro o colaboración con la Fundación y sus programas.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[#806018]">2.</span>
                Aceptación de los Términos
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  El acceso, navegación y uso del Sitio implica la aceptación expresa e incondicional de los presentes Términos y Condiciones, así como de la Política de Privacidad publicada en el mismo.
                </p>
                <p>
                  El Usuario reconoce haber leído y comprendido estos documentos antes de utilizar el Sitio.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[#806018]">3.</span>
                Uso permitido
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  El Usuario se compromete a utilizar el Sitio y sus contenidos de manera responsable, ética y conforme a la ley, evitando cualquier acción que pueda:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Dañar, sobrecargar, inutilizar o afectar el funcionamiento del Sitio.</li>
                  <li>Suplantar la identidad de otras personas o instituciones.</li>
                  <li>Introducir virus, programas maliciosos o cualquier código informático destinado a alterar los sistemas del Sitio o de terceros.</li>
                  <li>Utilizar los contenidos del Sitio con fines comerciales, políticos o contrarios a la misión de la Fundación.</li>
                </ul>
                <p className="font-semibold">
                  La Fundación se reserva el derecho de restringir o cancelar el acceso al Sitio a cualquier Usuario que infrinja estas condiciones.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[#806018]">4.</span>
                Propiedad intelectual
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  Todo el contenido del Sitio —incluyendo textos, imágenes, fotografías, gráficos, logotipos, videos, audios, documentos, materiales descargables y diseños— es propiedad de Fundación Humanismo Evolutivo o se utiliza con la autorización correspondiente de sus titulares.
                </p>
                <p>
                  Queda estrictamente prohibida su reproducción, distribución, modificación o uso sin autorización previa y por escrito de la Fundación.
                </p>
                <p>
                  El uso legítimo de los materiales está limitado a fines informativos, educativos y no comerciales, siempre citando la fuente "Fundación Humanismo Evolutivo".
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[#806018]">5.</span>
                Enlaces externos
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  El Sitio puede contener enlaces a sitios de terceros con el fin de facilitar el acceso a información adicional.
                </p>
                <p>
                  La Fundación no controla ni se hace responsable del contenido, políticas o prácticas de privacidad de dichos sitios.
                </p>
                <p>
                  La inclusión de estos enlaces no implica patrocinio, respaldo o asociación alguna con los responsables de dichos portales.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[#806018]">6.</span>
                Donaciones y colaboraciones
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  En caso de que el Sitio ofrezca opciones para realizar donaciones en línea, éstas se efectuarán mediante plataformas seguras y certificadas.
                </p>
                <p>
                  La Fundación no almacena información financiera ni bancaria de los donantes.
                </p>
                <p>
                  El Usuario deberá revisar las políticas de privacidad y condiciones de las plataformas de pago antes de realizar cualquier transacción.
                </p>
                <p>
                  Todas las donaciones son voluntarias y destinadas a los fines sociales, culturales y educativos establecidos en los estatutos de la Fundación.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[#806018]">7.</span>
                Responsabilidad
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  La Fundación no garantiza que el Sitio funcione sin interrupciones o errores técnicos, aunque realiza esfuerzos razonables para mantenerlo en buen estado y actualizado.
                </p>
                <p>
                  El uso del Sitio se realiza bajo la responsabilidad del Usuario.
                </p>
                <p>
                  La Fundación no será responsable de daños o perjuicios derivados del uso o imposibilidad de uso del Sitio, ni de los contenidos proporcionados por terceros.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[#806018]">8.</span>
                Protección de datos personales
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  El tratamiento de los datos personales recabados a través del Sitio se rige por la Política de Privacidad disponible en humanismoevolutivo.com.
                </p>
                <p>
                  Al utilizar el Sitio, el Usuario acepta expresamente el tratamiento de sus datos conforme a lo establecido en dicha política.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[#806018]">9.</span>
                Modificaciones
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  La Fundación podrá modificar en cualquier momento los presentes Términos y Condiciones.
                </p>
                <p>
                  Cualquier cambio será publicado en esta misma sección, indicando la fecha de actualización.
                </p>
                <p>
                  El uso continuado del Sitio después de los cambios constituye la aceptación de los nuevos términos.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[#806018]">10.</span>
                Legislación aplicable y jurisdicción
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  Estos Términos y Condiciones se rigen por las leyes de los Estados Unidos Mexicanos.
                </p>
                <p>
                  Cualquier controversia que derive de la interpretación o aplicación de los mismos será resuelta ante los tribunales competentes de Quintana Roo, México, renunciando las partes a cualquier otro fuero que pudiera corresponderles por razón de su domicilio presente o futuro.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[#806018]">11.</span>
                Contacto
              </h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  Para cualquier duda, comentario o solicitud relacionada con estos Términos y Condiciones, el Usuario puede escribir a:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-accent/20 p-4 rounded-lg">
                    <Mail className="w-5 h-5 text-[#806018]" />
                    <a
                      href="mailto:hello@yosoynosotros.com"
                      className="text-[#806018] hover:underline font-semibold"
                    >
                      hello@yosoynosotros.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2 bg-accent/20 p-4 rounded-lg">
                    <Globe className="w-5 h-5 text-[#806018]" />
                    <a
                      href="https://humanismoevolutivo.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#806018] hover:underline font-semibold"
                    >
                      humanismoevolutivo.com
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Section */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-2xl font-bold">Fundación Humanismo Evolutivo</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.32em] text-[#806018]">
                  Transpersonal
                </p>
              </div>
              <p className="text-lg italic text-muted-foreground">
                Inspirando conciencia, evolución y conexión entre las personas y el mundo.
              </p>
            </div>
          </div>
        </motion.div>
      </article>
    </PageWrapper>
  );
};

export default Terminos;
