import { Suspense } from "react";
import { AuthPageClient } from "@/components/auth/auth-page-client";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCF9F8]" />}>
      <AuthPageClient defaultMode="register" />
    </Suspense>
  );
}
