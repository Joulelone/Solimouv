"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";

type AuthMode = "login" | "register";

type AuthPageClientProps = {
  defaultMode: AuthMode;
};

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function AuthPageClient({ defaultMode }: AuthPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [nextPath, setNextPath] = useState("/");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const next = searchParams.get("next");
    if (next?.startsWith("/")) {
      setNextPath(next);
    } else {
      setNextPath("/");
    }
  }, [searchParams]);

  useEffect(() => {
    const queryMode = searchParams.get("mode");
    if (queryMode === "login" || queryMode === "register") {
      setMode(queryMode);
      return;
    }
    setMode(defaultMode);
  }, [defaultMode, searchParams]);

  const toggleHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("next", nextPath);
    return mode === "login"
      ? `/inscription?${params.toString()}`
      : `/login?${params.toString()}`;
  }, [mode, nextPath]);

  async function handleEmailAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!auth) {
      setErrorMessage("Firebase non configure. Ajoute les variables NEXT_PUBLIC_FIREBASE.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push(nextPath);
    } catch {
      setErrorMessage(
        mode === "login"
          ? "Impossible de se connecter. Verifie tes infos."
          : "Impossible de creer le compte. Verifie tes infos.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleAuth() {
    if (!auth) {
      setErrorMessage("Firebase non configure. Ajoute les variables NEXT_PUBLIC_FIREBASE.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      router.push(nextPath);
    } catch {
      setErrorMessage("Connexion Google indisponible pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FCF9F8] text-[#111111]">
      <header className="border-b border-[#E0E0E0] bg-white">
        <div className="mx-auto flex h-[88px] w-full max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/landing" className="inline-flex items-center">
            <Image src="/figma-logo.svg" alt="Logo Solimouv" width={150} height={52} priority />
          </Link>
          <Link
            href="/landing"
            className="inline-flex items-center gap-2 rounded-full border border-[#D1D5DB] px-4 py-2 text-sm font-semibold hover:bg-[#F2F2F2]"
          >
            Retour landing
            <ArrowIcon />
          </Link>
        </div>
      </header>

      <main className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section className="rounded-[28px] border border-[#E7E5E4] bg-white p-6 shadow-[0_14px_32px_-24px_rgba(17,17,17,0.4)] sm:p-8">
            <div className="inline-flex rounded-full bg-[#F2F2F2] p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-[#0558F6] text-white"
                    : "text-[#6B7280] hover:text-[#111111]"
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "register"
                    ? "bg-[#FF5C29] text-white"
                    : "text-[#6B7280] hover:text-[#111111]"
                }`}
              >
                Inscription
              </button>
            </div>

            <h1 className="mt-5 text-[30px] font-bold leading-[34px] sm:text-[36px] sm:leading-[40px]">
              {mode === "login" ? "Bon retour sur Solimouv" : "Rejoins le festival Solimouv"}
            </h1>
            <p className="mt-3 max-w-[56ch] text-[15px] leading-6 text-[#4B5563]">
              {mode === "login"
                ? "Connecte-toi pour retrouver ton parcours, ton pass et les ateliers."
                : "Cree ton compte pour acceder a ton pass, preparer ton programme et suivre le festival."}
            </p>

            {!isFirebaseConfigured ? (
              <p className="mt-5 rounded-[14px] border border-[#FED7AA] bg-[#FFF7ED] px-4 py-3 text-sm text-[#9A3412]">
                Firebase non configure. Cree `.env.local` depuis `.env.example`.
              </p>
            ) : null}

            <button
              className="mt-6 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full border border-[#D1D5DB] bg-white px-5 text-[15px] font-semibold text-[#111111] transition hover:bg-[#F9FAFB] disabled:opacity-60"
              onClick={handleGoogleAuth}
              type="button"
              disabled={loading || !isFirebaseConfigured}
            >
              Continuer avec Google
            </button>

            <div className="my-6 flex items-center gap-3 text-[#9CA3AF]">
              <span className="h-px flex-1 bg-[#E5E7EB]" />
              <span className="text-xs font-semibold uppercase tracking-[0.08em]">ou</span>
              <span className="h-px flex-1 bg-[#E5E7EB]" />
            </div>

            <form className="space-y-3" onSubmit={handleEmailAuth}>
              <input
                className="h-[52px] w-full rounded-[16px] border border-[#E5E7EB] bg-[#FCFCFC] px-4 text-[15px] outline-none ring-[#0558F6]/40 transition focus:ring-4"
                placeholder="Email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <input
                className="h-[52px] w-full rounded-[16px] border border-[#E5E7EB] bg-[#FCFCFC] px-4 text-[15px] outline-none ring-[#0558F6]/40 transition focus:ring-4"
                placeholder="Mot de passe"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                className={`mt-2 inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-full px-5 text-[15px] font-bold text-white transition disabled:opacity-60 ${
                  mode === "login"
                    ? "bg-[#0558F6] hover:brightness-95"
                    : "bg-[#FF5C29] hover:brightness-95"
                }`}
                type="submit"
                disabled={loading || !isFirebaseConfigured}
              >
                {loading
                  ? "Patiente..."
                  : mode === "login"
                    ? "Se connecter"
                    : "Creer mon compte"}
                <ArrowIcon />
              </button>
            </form>

            {errorMessage ? (
              <p className="mt-4 rounded-[12px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                {errorMessage}
              </p>
            ) : null}

            <p className="mt-5 text-sm text-[#4B5563]">
              {mode === "login" ? "Pas encore de compte ?" : "Tu as deja un compte ?"}{" "}
              <Link href={toggleHref} className="font-semibold text-[#0558F6] underline underline-offset-4">
                {mode === "login" ? "Inscription" : "Connexion"}
              </Link>
            </p>
          </section>

          <aside className="rounded-[28px] bg-[#F3F7FF] p-6 sm:p-8">
            <span className="inline-flex rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-semibold text-[#1D4ED8]">
              Festival du sport pour tous
            </span>
            <h2 className="mt-4 text-[28px] font-bold leading-[32px] sm:text-[34px] sm:leading-[38px]">
              Avance dans ton aventure Solimouv
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-[#4B5563]">
              Choisis tes activites, valide ton pass et retrouve toutes les infos pratiques en un seul endroit.
            </p>

            <div className="mt-6 grid gap-3">
              <article className="rounded-[18px] border border-[#E5E7EB] bg-white p-4">
                <p className="text-sm font-bold text-[#111111]">Mon pass</p>
                <p className="mt-1 text-sm text-[#6B7280]">Acces rapide a ton QR code participant.</p>
              </article>
              <article className="rounded-[18px] border border-[#E5E7EB] bg-white p-4">
                <p className="text-sm font-bold text-[#111111]">Mon programme</p>
                <p className="mt-1 text-sm text-[#6B7280]">Selectionne tes ateliers favoris et personnalise ta journee.</p>
              </article>
              <article className="rounded-[18px] border border-[#E5E7EB] bg-white p-4">
                <p className="text-sm font-bold text-[#111111]">Carte interactive</p>
                <p className="mt-1 text-sm text-[#6B7280]">Repere les stands et ateliers autour de toi.</p>
              </article>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
