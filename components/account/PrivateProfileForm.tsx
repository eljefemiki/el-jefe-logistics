"use client";

import { useActionState } from "react";
import { BadgeCheck, Loader2, LockKeyhole, Save } from "lucide-react";

import {
  updatePrivateProfileAction,
  type PrivateProfileActionState,
} from "@/src/server/account/actions";

interface PrivateProfileFormProps {
  profile: {
    steamId: string | null;
    truckyUsername: string | null;
    discordId: string | null;
    discordUsername: string | null;
    discordDisplayName: string | null;
    discordVerifiedAt: Date | null;
    discordGuildJoinedAt: Date | null;
  };
  discordEnabled: boolean;
  discordMessage?: string;
}

const initialState: PrivateProfileActionState = { success: false, message: "" };
const inputClass = "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const fields = [
  { name: "steamId", label: "Steam ID", hint: "Your 17-digit SteamID64", inputMode: "numeric" as const },
  { name: "truckyUsername", label: "Trucky Username", hint: "Your current Trucky username", inputMode: "text" as const },
] as const;

function formatDate(value: Date | null) {
  return value
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(value)
    : null;
}

export default function PrivateProfileForm({
  profile,
  discordEnabled,
  discordMessage,
}: PrivateProfileFormProps) {
  const [state, formAction, pending] = useActionState(updatePrivateProfileAction, initialState);

  return (
    <form action={formAction} className="rounded-2xl border border-slate-800 bg-slate-900">
      <div className="flex items-start gap-4 border-b border-slate-800 p-6">
        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400"><LockKeyhole className="h-6 w-6" /></div>
        <div>
          <h2 className="text-xl font-semibold text-white">Private driver identities</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Only your signed-in account can view or update these details. They are not shown on public pages or driver lists.
          </p>
        </div>
      </div>
      <div className="grid gap-6 p-6 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={`profile-${field.name}`} className="mb-2 block text-sm font-medium text-slate-300">{field.label}</label>
            <input
              id={`profile-${field.name}`}
              name={field.name}
              type="text"
              inputMode={field.inputMode}
              defaultValue={profile[field.name] ?? ""}
              placeholder={field.hint}
              autoComplete="off"
              required
              className={inputClass}
            />
            {state.fieldErrors?.[field.name]?.[0] && <p className="mt-2 text-sm text-red-400">{state.fieldErrors[field.name]?.[0]}</p>}
          </div>
        ))}
      </div>
      <div className="border-t border-slate-800 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">Discord verification</h3>
              {profile.discordVerifiedAt && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-300">
                  <BadgeCheck className="h-4 w-4" />
                  Server member verified
                </span>
              )}
            </div>
            {profile.discordVerifiedAt ? (
              <div className="mt-2 space-y-1 text-sm text-slate-400">
                <p>
                  {profile.discordDisplayName || profile.discordUsername}
                  {profile.discordUsername ? ` (@${profile.discordUsername})` : ""}
                </p>
                <p>
                  Verified {formatDate(profile.discordVerifiedAt)}
                  {profile.discordGuildJoinedAt
                    ? ` · Server member since ${formatDate(profile.discordGuildJoinedAt)}`
                    : ""}
                </p>
              </div>
            ) : (
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Link Discord to confirm that your Discord account has joined
                the El Jefe Logistics server. Your permanent Discord account
                ID is collected securely from Discord.
              </p>
            )}
            {discordMessage && (
              <p className="mt-3 text-sm text-amber-300">{discordMessage}</p>
            )}
          </div>
          {discordEnabled ? (
            <a
              href="/api/discord/connect"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-5 font-semibold text-white transition hover:bg-indigo-500"
            >
              {profile.discordVerifiedAt ? "Reverify Discord" : "Link Discord"}
            </a>
          ) : (
            <span className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-500">
              Discord linking not configured
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t border-slate-800 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className={`text-sm ${state.success ? "text-emerald-400" : "text-red-400"}`}>{state.message}</p>
        <button type="submit" disabled={pending} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-500 disabled:opacity-60">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {pending ? "Saving…" : "Save private details"}
        </button>
      </div>
    </form>
  );
}
