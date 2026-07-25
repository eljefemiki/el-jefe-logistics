"use client";
import { useFormStatus } from "react-dom";
export default function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-50">{pending ? "Saving…" : children}</button>;
}
