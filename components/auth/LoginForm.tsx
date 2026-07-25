"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AuthCard from "./AuthCard";
import AuthHeader from "./AuthHeader";
import AuthFooter from "./AuthFooter";
import PasswordField from "./PasswordField";
import RememberMe from "./RememberMe";
import LoadingButton from "./LoadingButton";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
      const result = await response.json();
      if (!response.ok) { setError(result.message ?? "Unable to sign in."); return; }
      const next = searchParams.get("next");
      const dashboardTarget = next === "/profile" || next?.startsWith("/dashboard") ? next : "/dashboard";
      router.push(result.user?.role === "APPLICANT" ? "/profile" : dashboardTarget);
      router.refresh();
    } catch { setError("Unable to reach JefeCore. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <AuthCard>

      <AuthHeader
        title="Welcome Back"
        subtitle="Sign in to your El Jefe Logistics account."
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <div>

          <label htmlFor="login-email" className="mb-2 block font-semibold text-white">
            Email Address
          </label>

          <input
            id="login-email"
            name="email"
            type="email"
            placeholder="you@email.com"
            autoComplete="email"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
          />

        </div>

        <PasswordField
          label="Password"
          placeholder="Enter your password"
        />
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

        <RememberMe />

        <LoadingButton
          loading={loading}
          text="Sign In"
        />

      </form>

      <AuthFooter
        text="New to El Jefe Logistics?"
        linkText="Create an account"
        href="/register"
      />

    </AuthCard>
  );
}
