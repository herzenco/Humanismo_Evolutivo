"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  const trackFooterLink = (linkType: string, linkName: string, destination: string) => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "footer_link_click",
      link_type: linkType,
      link_name: linkName,
      destination: destination,
    });
  };

  const trackSocialClick = (platform: string, url: string) => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "social_media_click",
      social_platform: platform,
      destination_url: url,
    });
  };

  return (
    <footer className="bg-navy-dark text-white pt-16 pb-8">
      <div className="container mx-auto">
        {/* Newsletter Signup */}
        <div className="mb-12 p-8 bg-navy-light rounded-lg shadow-lg">
          <h3 className="text-2xl font-heading font-medium mb-2 text-center">Recibe nuestras novedades</h3>
          <p className="text-white/80 mb-6 text-center">
            Suscríbete para recibir información sobre nuevos libros, eventos y reflexiones filosóficas.
          </p>
          <iframe
            src="https://api.leadconnectorhq.com/widget/form/L88rd23ASEnrMJtyLFfo"
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '4px' }}
            id="inline-L88rd23ASEnrMJtyLFfo"
            data-layout='{"id":"INLINE"}'
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="Newsletter - Humanismo Evolutivo"
            data-height="400"
            data-layout-iframe-id="inline-L88rd23ASEnrMJtyLFfo"
            data-form-id="L88rd23ASEnrMJtyLFfo"
            title="Newsletter - Humanismo Evolutivo"
          ></iframe>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* About */}
          <div>
            <h2 className="font-heading text-xl font-medium mb-4">Humanismo Evolutivo</h2>
            <p className="text-white/70 mb-4">
              Una visión transpersonal del mundo a través de la filosofía, espiritualidad y ecología.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-white/70 hover:text-gold transition-colors"
                aria-label="Facebook"
                onClick={() => trackSocialClick("facebook", "https://facebook.com")}
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                className="text-white/70 hover:text-gold transition-colors"
                aria-label="Instagram"
                onClick={() => trackSocialClick("instagram", "https://instagram.com")}
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                className="text-white/70 hover:text-gold transition-colors"
                aria-label="Twitter"
                onClick={() => trackSocialClick("twitter", "https://twitter.com")}
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://youtube.com"
                className="text-white/70 hover:text-gold transition-colors"
                aria-label="Youtube"
                onClick={() => trackSocialClick("youtube", "https://youtube.com")}
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="font-heading text-lg font-medium mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() => trackFooterLink("quick_links", "Inicio", "/")}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/autor"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() => trackFooterLink("quick_links", "Sobre el Autor", "/autor")}
                >
                  Sobre el Autor
                </Link>
              </li>
              <li>
                <Link
                  href="/libros"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() => trackFooterLink("quick_links", "Libros", "/libros")}
                >
                  Libros
                </Link>
              </li>
              <li>
                <Link
                  href="/medios"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() => trackFooterLink("quick_links", "Podcast", "/medios")}
                >
                  Podcast
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() => trackFooterLink("quick_links", "Recursos", "/resources")}
                >
                  Recursos
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="font-heading text-lg font-medium mb-4">Obras</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/libros/yo-soy-nosotros"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() => trackFooterLink("books", "Yo soy nosotros", "/libros/yo-soy-nosotros")}
                >
                  Yo soy nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/libros/lo-mejor-esta-por-venir"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() =>
                    trackFooterLink("books", "Y lo mejor aún está por venir", "/libros/lo-mejor-esta-por-venir")
                  }
                >
                  Y lo mejor aún está por venir
                </Link>
              </li>
              <li>
                <Link
                  href="/libros/el-arte-de-ser-empresario"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() =>
                    trackFooterLink("books", "El arte de ser empresario", "/libros/el-arte-de-ser-empresario")
                  }
                >
                  El arte de ser empresario
                </Link>
              </li>
              <li>
                <Link
                  href="/libros/ecologia-y-espiritualidad"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() =>
                    trackFooterLink("books", "Ecología y espiritualidad", "/libros/ecologia-y-espiritualidad")
                  }
                >
                  Ecología y espiritualidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 pt-8 mt-8 text-center text-white/50 text-sm">
          <p>&copy; {new Date().getFullYear()} Fundación Humanismo Evolutivo. Todos los derechos reservados.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacidad" className="hover:text-gold transition-colors">
              Política de Privacidad
            </Link>
            <span>|</span>
            <Link href="/terminos" className="hover:text-gold transition-colors">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
