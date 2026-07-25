"use client";

import { useState } from "react";

interface PasswordFieldProps {
  label: string;
  placeholder?: string;
}

export default function PasswordField({
  label,
  placeholder,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-white">
        {label}
      </label>

      <div className="relative">

        <input
          name="password"
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 pr-14 outline-none transition focus:border-blue-500"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-white"
        >
          {show ? "Hide" : "Show"}
        </button>

      </div>

    </div>
  );
}
