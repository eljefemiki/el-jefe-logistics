export default function AuthDivider() {
  return (
    <div className="my-8 flex items-center">

      <div className="h-px flex-1 bg-slate-800" />

      <span className="mx-4 text-xs uppercase tracking-widest text-slate-500">
        or
      </span>

      <div className="h-px flex-1 bg-slate-800" />

    </div>
  );
}