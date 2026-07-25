"use client";

import { useActionState } from "react";
import { Loader2, LockKeyhole, Save } from "lucide-react";

import {
  updatePrivateProfileAction,
  type PrivateProfileActionState,
} from "@/src/server/account/actions";

interface PrivateProfileFormProps {
  profile: {
    steamId: string | null;
    truckyUserId: string | null;
    truckyUsername: string | null;
    discordId: string | null;
  };
}

const initialState: PrivateProfileActionState = { success: false, message: "" };
const inputClass = "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const fields = [
  { name: "steamId", label: "Steam ID", hint: "Your 17-digit SteamID64", inputMode: "numeric" as const },
  { name: "truckyUserId", label: "Trucky User ID", hint: "Your Trucky account ID", inputMode: "text" as const },
  { name: "truckyUsername", label: "Trucky Username", hint: "Your current Trucky username", inputMode: "text" as const },
  { name: "discordId", label: "Discord ID", hint: "Your numeric Discord user ID", inputMode: "numeric" as const },
] as const;

export default function PrivateProfileForm({ profile }: PrivateProfileFormProps) {
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
