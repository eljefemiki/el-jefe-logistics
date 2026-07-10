interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({
  title,
  subtitle,
}: PageHeaderProps) {
  return (
    <div className="mb-16 text-center">
      <h1 className="text-5xl font-black text-white">
        {title}
      </h1>

      <p className="mt-4 text-xl text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}