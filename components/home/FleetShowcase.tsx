import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";

const fleet = [
  {
    truck: "Volvo FH Aero",
    role: "Long Haul Specialist",
    emoji: "🚛",
  },
  {
    truck: "Scania S",
    role: "Premium Fleet",
    emoji: "🚚",
  },
  {
    truck: "Mercedes Actros",
    role: "Heavy Cargo",
    emoji: "🚛",
  },
];

export default function FleetShowcase() {
  return (
    <Section>
      <Container>
        <div className="mb-14 text-center">
          <h2 className="text-5xl font-black">
            Featured Fleet
          </h2>

          <p className="mt-4 text-slate-400">
            Modern trucks built for every journey across Europe.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {fleet.map((truck) => (
            <Card key={truck.truck}>
              <div className="text-6xl text-center">
                {truck.emoji}
              </div>

              <h3 className="mt-8 text-center text-2xl font-bold">
                {truck.truck}
              </h3>

              <p className="mt-3 text-center text-slate-400">
                {truck.role}
              </p>

              <button className="mt-8 w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-500">
                View Details
              </button>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}