interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <div className="mb-10 text-center">

      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-black text-white">
          EJ
        </div>
      </div>

      <h1 className="text-4xl font-black text-white">
        {title}
      </h1>

      <p className="mt-3 text-slate-400">
        {subtitle}
      </p>

    </div>
  );
}