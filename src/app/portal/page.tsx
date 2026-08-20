import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  FileText,
  LibraryBig,
  LogOut,
  Mic2,
  Sparkles,
  Video,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isEmailAccountClaims } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portal educativo",
  description: "Biblioteca privada de Humanismo Evolutivo.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

const portalSections = [
  {
    title: "Libros",
    description: "Lecturas y obras para profundizar en cada tema.",
    icon: BookOpen,
  },
  {
    title: "Artículos",
    description: "Textos, reflexiones y materiales de estudio.",
    icon: FileText,
  },
  {
    title: "Videos",
    description: "Charlas, clases y conversaciones seleccionadas.",
    icon: Video,
  },
  {
    title: "Podcasts",
    description: "Episodios para escuchar y continuar el recorrido.",
    icon: Mic2,
  },
] as const;

function getFriendlyFirstName(claims: {
  email?: string;
  user_metadata?: Record<string, unknown>;
}) {
  const storedFirstName = claims.user_metadata?.first_name;

  if (typeof storedFirstName === "string" && storedFirstName.trim()) {
    return storedFirstName.trim().slice(0, 60);
  }

  const emailName = claims.email?.split("@")[0]?.trim();
  return emailName || "estudiante";
}

export default async function PortalPage() {
  if (!isSupabaseConfigured) {
    redirect("/auth?next=/portal");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !isEmailAccountClaims(data?.claims)) {
    redirect("/auth?next=/portal");
  }

  const claims = data.claims;
  const firstName = getFriendlyFirstName(claims);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f5ef] text-navy-dark">
      <a
        href="#contenido-principal"
        className="sr-only z-[100] rounded-md bg-navy-dark px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Ir al contenido principal
      </a>

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(197,160,40,0.16),transparent_38%),radial-gradient(circle_at_top_right,rgba(26,40,51,0.12),transparent_42%)]"
        aria-hidden="true"
      />

      <header className="relative border-b border-navy-dark/10 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="group flex min-w-0 flex-col leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4"
            aria-label="Humanismo Evolutivo Transpersonal, página de inicio"
          >
            <span className="truncate font-heading text-xl font-semibold tracking-tight sm:text-2xl">
              <span className="text-navy-dark">Humanismo</span>{" "}
              <span className="text-gold-dark transition-colors group-hover:text-gold">
                Evolutivo
              </span>
            </span>
            <span className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.32em] text-navy-light/70 sm:text-[10px]">
              Transpersonal
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {claims.email ? (
              <span className="hidden max-w-56 truncate text-sm text-navy-light/70 md:block">
                {claims.email}
              </span>
            ) : null}
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-navy-dark/15 bg-white px-4 py-2 text-sm font-semibold text-navy-dark shadow-sm transition hover:border-navy-dark/30 hover:bg-navy-dark hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Cerrar sesión</span>
                <span className="sm:hidden">Salir</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main
        id="contenido-principal"
        className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:px-10 lg:pt-16"
      >
        <section aria-labelledby="portal-welcome" className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-white/75 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Tu espacio de aprendizaje
          </div>
          <h1
            id="portal-welcome"
            className="text-balance font-heading text-5xl font-medium leading-[0.95] tracking-tight text-navy-dark sm:text-6xl lg:text-7xl"
          >
            Bienvenido, {firstName}.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-navy-light/80 sm:text-lg sm:leading-8">
            Este será tu lugar para explorar, aprender y volver a los materiales
            de Humanismo Evolutivo a tu propio ritmo.
          </p>
        </section>

        <section aria-labelledby="biblioteca-heading" className="mt-14 sm:mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-dark">
                Biblioteca privada
              </p>
              <h2
                id="biblioteca-heading"
                className="mt-2 font-heading text-3xl font-medium text-navy-dark sm:text-4xl"
              >
                Contenido del portal
              </h2>
            </div>
            <span className="w-fit rounded-full bg-navy-dark/5 px-3 py-1.5 text-xs font-semibold text-navy-light/70">
              Próximamente
            </span>
          </div>

          <ul className="mt-7 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4">
            {portalSections.map((section) => {
              const Icon = section.icon;

              return (
                <li key={section.title}>
                  <article className="flex h-full min-h-52 flex-col rounded-2xl border border-navy-dark/10 bg-white/80 p-6 shadow-[0_20px_55px_-38px_rgba(15,25,33,0.45)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_25px_65px_-38px_rgba(15,25,33,0.55)]">
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-dark text-cream-light shadow-sm">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="rounded-full border border-gold/20 bg-cream-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gold-dark">
                        En preparación
                      </span>
                    </div>
                    <h3 className="mt-7 font-heading text-2xl font-semibold text-navy-dark">
                      {section.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-navy-light/70">
                      {section.description}
                    </p>
                    <p className="mt-auto pt-5 text-xs font-medium text-navy-light/50">
                      0 contenidos disponibles
                    </p>
                  </article>
                </li>
              );
            })}
          </ul>

          <div
            className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-navy-dark/20 bg-white/55 px-6 py-10 text-center sm:py-12"
            role="status"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-gold/10 text-gold-dark">
              <LibraryBig className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-5 font-heading text-2xl font-semibold text-navy-dark">
              Tu biblioteca está lista para crecer
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-navy-light/70 sm:text-base">
              Aún no hay materiales publicados en el portal. Cuando lleguen los
              primeros libros, artículos, videos y podcasts, aparecerán aquí.
            </p>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-navy-dark/10 bg-white/50">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-navy-light/60 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>Humanismo Evolutivo · Portal educativo</p>
          <p>Un espacio privado para continuar aprendiendo.</p>
        </div>
      </footer>
    </div>
  );
}
