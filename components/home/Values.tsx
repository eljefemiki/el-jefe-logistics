import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

const values = [
  {
    title: "Professional",
    icon: "🏆",
    description:
      "We aim to provide a professional and enjoyable trucking experience.",
  },
  {
    title: "Community",
    icon: "🤝",
    description:
      "Drivers are part of a supportive and friendly team.",
  },
  {
    title: "Progress",
    icon: "📈",
    description:
      "Every delivery helps build your career within the company.",
  },
];

export default function Values() {
  return (
    <Section className="bg-slate-900">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-white">
          Why Join El Jefe Logistics?
        </h2>

        <p className="mt-4 text-slate-400">
          More than a VTC. A place to build your trucking career.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {values.map((value) => (
          <Card key={value.title}>
            <div className="text-6xl">{value.icon}</div>

            <h3 className="mt-6 text-2xl font-bold text-white">
              {value.title}
            </h3>

            <p className="mt-4 text-slate-400">
              {value.description}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}