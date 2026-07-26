import { Truck } from "lucide-react";

import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

const truckExamples = [
  { name: "Volvo FH Aero", division: "Long-haul configuration" },
  { name: "Scania S", division: "Heavy-haul configuration" },
  { name: "DAF XG+", division: "European configuration" },
];

export default function FleetPreview() {
  return (
    <Section id="fleet" className="scroll-mt-20 bg-slate-900">
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-black text-white sm:text-5xl">Fleet examples</h2>
        <p className="mt-4 text-slate-400">
          Examples of the vehicle classes and configurations our virtual drivers can operate.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {truckExamples.map((truck) => (
          <Card key={truck.name}>
            <div className="flex h-48 items-center justify-center rounded-xl bg-slate-800">
              <Truck aria-hidden="true" className="h-16 w-16 text-blue-400" />
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-white">{truck.name}</h3>
              <p className="mt-2 text-slate-400">{truck.division}</p>
              <p className="mt-6 text-sm text-slate-500">Illustrative vehicle — not a live availability claim</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
