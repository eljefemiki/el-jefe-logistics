import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

const trucks = [
  {
    name: "Volvo FH Aero",
    division: "Long Haul",
    status: "Active",
    colour: "bg-blue-500",
  },
  {
    name: "Scania S",
    division: "Heavy Haul",
    status: "Available",
    colour: "bg-green-500",
  },
  {
    name: "DAF XG+",
    division: "European",
    status: "Recruiting Driver",
    colour: "bg-orange-500",
  },
];

export default function FleetPreview() {
  return (
    <Section className="bg-slate-900">

      <div className="mb-16 text-center">

        <h2 className="text-5xl font-black text-white">
          Our Fleet
        </h2>

        <p className="mt-4 text-slate-400">
          Built for every journey across Europe.
        </p>

      </div>

      <div className="grid gap-8 md:grid-cols-3">

        {trucks.map((truck) => (

          <Card key={truck.name}>

            <div className="flex h-48 items-center justify-center rounded-xl bg-slate-800">

              <span className="text-7xl">
                🚛
              </span>

            </div>

            <div className="mt-6">

              <h3 className="text-2xl font-bold text-white">
                {truck.name}
              </h3>

              <p className="mt-2 text-slate-400">
                {truck.division}
              </p>

              <div className="mt-6 flex items-center gap-3">

                <div
                  className={`h-3 w-3 rounded-full ${truck.colour}`}
                />

                <span className="text-slate-300">
                  {truck.status}
                </span>

              </div>

            </div>

          </Card>

        ))}

      </div>

    </Section>
  );
}