"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import NewsletterSignup from "@/components/layout/NewsletterSignup";

const Footer = () => {
  const { t } = useLanguage();
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
          <h3 className="text-2xl font-heading font-medium mb-2 text-center">{t('footer.newsletter.title')}</h3>
          <p className="text-white/90 mb-6 text-center">{t('footer.newsletter.description')}</p>
          <NewsletterSignup />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* About */}
          <div>
            <h2 className="font-heading text-xl font-medium">Humanismo Evolutivo</h2>
            <p className="mt-1 mb-4 text-[10px] font-medium uppercase tracking-[0.32em] text-gold/80">
              Transpersonal
            </p>
            <p className="text-white/85 mb-4">{t('footer.about')}</p>
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
            <h3 className="font-heading text-lg font-medium mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() => trackFooterLink("quick_links", "Inicio", "/")}
                >
                  {t('footer.home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/autor"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() => trackFooterLink("quick_links", "Sobre el Autor", "/autor")}
                >
                  {t('footer.author')}
                </Link>
              </li>
              <li>
                <Link
                  href="/libros"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() => trackFooterLink("quick_links", "Libros", "/libros")}
                >
                  {t('footer.books')}
                </Link>
              </li>
              <li>
                <Link
                  href="/medios"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() => trackFooterLink("quick_links", "Podcast", "/medios")}
                >
                  {t('footer.podcast')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="font-heading text-lg font-medium mb-4">{t('footer.works')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/libros/yo-soy-nosotros"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() => trackFooterLink("books", t('book.yosoynosotros.title'), "/libros/yo-soy-nosotros")}
                >
                  {t('book.yosoynosotros.title')}
                </Link>
              </li>
              <li>
                <Link
                  href="/libros/lo-mejor-esta-por-venir"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() =>
                    trackFooterLink("books", t('book.lomejor.title'), "/libros/lo-mejor-esta-por-venir")
                  }
                >
                  {t('book.lomejor.title')}
                </Link>
              </li>
              <li>
                <Link
                  href="/libros/el-arte-de-ser-empresario"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() =>
                    trackFooterLink("books", t('book.elarte.title'), "/libros/el-arte-de-ser-empresario")
                  }
                >
                  {t('book.elarte.title')}
                </Link>
              </li>
              <li>
                <Link
                  href="/libros/ecologia-y-espiritualidad"
                  className="text-white/70 hover:text-gold transition-colors"
                  onClick={() =>
                    trackFooterLink("books", t('book.ecologia.title'), "/libros/ecologia-y-espiritualidad")
                  }
                >
                  {t('book.ecologia.title')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/20 pt-8 mt-8 text-center text-white/80 text-sm">
          <p>&copy; {new Date().getFullYear()} Fundación Humanismo Evolutivo Transpersonal. {t('footer.rights')}</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacidad" className="hover:text-gold transition-colors">
              {t('footer.privacy')}
            </Link>
            <span>|</span>
            <Link href="/terminos" className="hover:text-gold transition-colors">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
