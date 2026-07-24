import Link from "next/link";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

export default function AuthFooter({
  text,
  linkText,
  href,
}: AuthFooterProps) {
  return (
    <div className="mt-8 text-center text-sm text-slate-400">

      <span>{text}</span>

      <Link
        href={href}
        className="ml-2 font-semibold text-blue-400 transition hover:text-blue-300"
      >
        {linkText}
      </Link>

    </div>
  );
}