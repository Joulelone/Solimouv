"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/app");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next?.startsWith("/")) {
      setNextPath(next);
    }
  }, []);

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
      setErrorMessage("Impossible de se connecter. Verifie les infos.");
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
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-2xl font-semibold">
            {mode === "login" ? "Connexion" : "Creation de compte"}
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Utilise ton compte Firebase pour acceder a la zone app.
          </p>

          {!isFirebaseConfigured ? (
            <p className="mt-4 rounded-xl border border-amber-200/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
              Firebase non configure. Cree `.env.local` depuis `.env.example`.
            </p>
          ) : null}

          <button
            className="mt-6 w-full rounded-xl border border-white/20 px-4 py-3 text-sm font-medium transition hover:bg-white/10 disabled:opacity-60"
            onClick={handleGoogleAuth}
            type="button"
            disabled={loading || !isFirebaseConfigured}
          >
            Continuer avec Google
          </button>

          <div className="my-5 h-px w-full bg-white/10" />

          <form className="space-y-3" onSubmit={handleEmailAuth}>
            <input
              className="w-full rounded-xl border border-white/15 bg-slate-950/50 px-4 py-3 text-sm outline-none ring-cyan-300 transition focus:ring-2"
              placeholder="Email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              className="w-full rounded-xl border border-white/15 bg-slate-950/50 px-4 py-3 text-sm outline-none ring-cyan-300 transition focus:ring-2"
              placeholder="Mot de passe"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
              type="submit"
              disabled={loading || !isFirebaseConfigured}
            >
              {loading
                ? "Patiente..."
                : mode === "login"
                  ? "Se connecter"
                  : "Creer le compte"}
            </button>
          </form>

          {errorMessage ? (
            <p className="mt-3 text-sm text-rose-300">{errorMessage}</p>
          ) : null}

          <button
            className="mt-4 text-sm text-cyan-300 hover:text-cyan-200"
            type="button"
            onClick={() =>
              setMode((current) => (current === "login" ? "register" : "login"))
            }
          >
            {mode === "login"
              ? "Pas de compte ? Creer un compte"
              : "Deja un compte ? Se connecter"}
          </button>

          <p className="mt-5 text-sm text-slate-400">
            <Link className="underline underline-offset-4" href="/">
              Retour a la landing
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
