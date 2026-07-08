import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";

const stats = [
  {
    title: "Drivers",
    value: "24",
    icon: "👥",
  },
  {
    title: "Fleet",
    value: "112",
    icon: "🚚",
  },
  {
    title: "Countries",
    value: "18",
    icon: "🌍",
  },
  {
    title: "Deliveries",
    value: "1.2M",
    icon: "📦",
  },
];

export default function Stats() {
  return (
    <Section className="bg-slate-900">
      <Container>
        <div className="grid gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="text-center"
            >
              <div className="text-5xl">
                {stat.icon}
              </div>

              <h2 className="mt-6 text-5xl font-black text-blue-500">
                {stat.value}
              </h2>

              <p className="mt-3 text-slate-400">
                {stat.title}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}