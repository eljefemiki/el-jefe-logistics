import LoginForm from "@/components/auth/LoginForm";
import Logo from "@/components/auth/Logo";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-slate-900" />}><LoginForm /></Suspense>
      </div>
    </main>
  );
}
