import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://yosoynosotros.com"),
  title: {
    default: "Humanismo Evolutivo Transpersonal - Marcos Constandse Madrazo",
    template: "%s | Humanismo Evolutivo Transpersonal",
  },
  description:
    "Explora la obra filosófica de Marcos Constandse Madrazo. Un viaje de consciencia que conecta ciencia, espiritualidad y humanidad hacia una visión transpersonal del mundo.",
  keywords: [
    "Marcos Constandse",
    "Humanismo Evolutivo Transpersonal",
    "filosofía transpersonal",
    "consciencia",
    "espiritualidad",
    "ecología",
    "México",
    "Yo soy nosotros",
  ],
  authors: [{ name: "Marcos Constandse Madrazo" }],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Humanismo Evolutivo Transpersonal",
    title: "Humanismo Evolutivo Transpersonal - Marcos Constandse Madrazo",
    description:
      "Un viaje de consciencia para entender quiénes somos, de dónde venimos y hacia dónde vamos",
    url: "https://yosoynosotros.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Humanismo Evolutivo Transpersonal - Marcos Constandse Madrazo",
    description:
      "Un viaje de consciencia para entender quiénes somos, de dónde venimos y hacia dónde vamos",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
