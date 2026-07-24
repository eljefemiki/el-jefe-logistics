"use client";

import { useState } from "react";

import AuthCard from "./AuthCard";
import AuthHeader from "./AuthHeader";
import AuthFooter from "./AuthFooter";
import PasswordField from "./PasswordField";
import LoadingButton from "./LoadingButton";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    // Sprint 6
    // Save new user

    console.log("Registering...");

    setTimeout(() => {
      setLoading(false);
    }, 1000);
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

          <label className="mb-2 block font-semibold">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Mike Collis"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 outline-none focus:border-blue-500"
          />

        </div>

        <div>

          <label className="mb-2 block font-semibold">
            Email Address
          </label>

          <input
            type="email"
            placeholder="you@email.com"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 outline-none focus:border-blue-500"
          />

        </div>

        <PasswordField
          label="Password"
          placeholder="Choose a secure password"
        />

        <PasswordField
          label="Confirm Password"
          placeholder="Repeat your password"
        />

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