"use client";

import { useState } from "react";

import AuthCard from "./AuthCard";
import AuthHeader from "./AuthHeader";
import AuthFooter from "./AuthFooter";
import PasswordField from "./PasswordField";
import RememberMe from "./RememberMe";
import LoadingButton from "./LoadingButton";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    // Sprint 6
    // Connect to authentication API

    console.log("Logging in...");

    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
          placeholder="Enter your password"
        />

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