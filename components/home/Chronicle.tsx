import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

const news = [
  {
    title: "Fleet Expansion",
    date: "July 2026",
    description:
      "Our fleet continues to grow as we prepare for new long-haul operations across Europe.",
  },
  {
    title: "Community Convoy",
    date: "Coming Soon",
    description:
      "Join fellow drivers for our next community convoy and explore Europe's roads together.",
  },
  {
    title: "Driver Achievements",
    date: "Latest",
    description:
      "Celebrate milestones, promotions, and outstanding deliveries from our driver community.",
  },
];

export default function Chronicle() {
  return (
    <Section className="bg-slate-950">
      <div className="mb-16 text-center">
        <h2 className="text-5xl font-black text-white">
          Company Chronicle
        </h2>

        <p className="mt-4 text-slate-400">
          Follow the latest news, achievements, and events from El Jefe Logistics.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {news.map((item) => (
          <Card key={item.title}>
            <p className="text-sm font-semibold uppercase text-blue-400">
              {item.date}
            </p>

            <h3 className="mt-3 text-2xl font-bold text-white">
              {item.title}
            </h3>

            <p className="mt-4 text-slate-400">
              {item.description}
            </p>

            <div className="mt-6">
              <Button variant="secondary">
                Read More
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}