"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthCard from "./AuthCard";
import AuthHeader from "./AuthHeader";
import AuthFooter from "./AuthFooter";
import PasswordField from "./PasswordField";
import LoadingButton from "./LoadingButton";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          password: form.get("password"),
          confirmPassword: form.get("confirmPassword"),
          steamId: form.get("steamId"),
          truckyUserId: form.get("truckyUserId"),
          truckyUsername: form.get("truckyUsername"),
          discordId: form.get("discordId"),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.message ?? "Unable to create your account.");
        return;
      }
      router.push("/login?registered=1");
      router.refresh();
    } catch {
      setError("Unable to reach JefeCore. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard>

      <AuthHeader
        title="Join El Jefe Logistics"
        subtitle="Create your driver account."
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <div>

          <label htmlFor="register-name" className="mb-2 block font-semibold text-white">
            Full Name
          </label>

          <input
            id="register-name"
            name="name"
            type="text"
            placeholder="Mike Collis"
            autoComplete="name"
            required
            minLength={2}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
          />

        </div>

        <div>

          <label htmlFor="register-email" className="mb-2 block font-semibold text-white">
            Email Address
          </label>

          <input
            id="register-email"
            name="email"
            type="email"
            placeholder="you@email.com"
            autoComplete="email"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
          />

        </div>

        <div className="border-t border-slate-800 pt-5">
          <h2 className="text-lg font-semibold text-white">Driver identities</h2>
          <p className="mt-1 text-sm text-slate-400">
            Private account details. These are only shown in your signed-in profile.
          </p>
        </div>

        {[
          { id: "register-steam-id", name: "steamId", label: "Steam ID", placeholder: "17-digit SteamID64", inputMode: "numeric" as const },
          { id: "register-trucky-user-id", name: "truckyUserId", label: "Trucky User ID", placeholder: "Your Trucky user ID", inputMode: "text" as const },
          { id: "register-trucky-username", name: "truckyUsername", label: "Trucky Username", placeholder: "Your Trucky username", inputMode: "text" as const },
          { id: "register-discord-id", name: "discordId", label: "Discord ID", placeholder: "Your numeric Discord user ID", inputMode: "numeric" as const },
        ].map((field) => (
          <div key={field.name}>
            <label htmlFor={field.id} className="mb-2 block font-semibold text-white">
              {field.label}
            </label>
            <input
              id={field.id}
              name={field.name}
              type="text"
              inputMode={field.inputMode}
              placeholder={field.placeholder}
              autoComplete="off"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
            />
          </div>
        ))}

        <PasswordField
          label="Password"
          name="password"
          placeholder="Choose a secure password"
          autoComplete="new-password"
        />

        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Repeat your password"
          autoComplete="new-password"
        />

        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

        <LoadingButton
          loading={loading}
          text="Create Account"
        />

      </form>

      <AuthFooter
        text="Already have an account?"
        linkText="Sign In"
        href="/login"
      />

    </AuthCard>
  );
}
