"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const nextPath = encodeURIComponent(pathname || "/app");
      router.replace(`/login?next=${nextPath}`);
    }
  }, [loading, pathname, router, user]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-400">
        Chargement...
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="mx-auto my-20 w-full max-w-2xl rounded-2xl border border-amber-200/30 bg-amber-300/10 p-6">
        <h2 className="text-lg font-semibold text-amber-200">
          Firebase non configure
        </h2>
        <p className="mt-2 text-sm text-amber-100/90">
          Ajoute les variables `NEXT_PUBLIC_FIREBASE_*` dans `.env.local`.
        </p>
        <Link
          className="mt-4 inline-flex rounded-lg border border-amber-200/40 px-4 py-2 text-sm font-medium hover:bg-amber-100/10"
          href="/"
        >
          Retour a la landing
        </Link>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
