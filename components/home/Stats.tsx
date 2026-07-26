import { Compass, Handshake, Route, Users } from "lucide-react";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";

const capabilities = [
  {
    title: "UK & European routes",
    description: "A community focused on realistic road freight journeys across the UK and Europe.",
    icon: Compass,
  },
  {
    title: "Driver community",
    description: "A welcoming place for virtual drivers to learn, take part, and progress together.",
    icon: Users,
  },
  {
    title: "Organised operations",
    description: "Fleet, dispatch, maintenance, and finance workflows managed through JefeCore.",
    icon: Route,
  },
  {
    title: "Professional values",
    description: "Clear expectations, respectful teamwork, and dependable communication on every journey.",
    icon: Handshake,
  },
];

export default function Stats() {
  return (
    <Section className="bg-slate-900">
      <Container>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <Card key={capability.title}>
                <Icon aria-hidden="true" className="h-10 w-10 text-blue-400" />
                <h2 className="mt-5 text-xl font-bold text-white">{capability.title}</h2>
                <p className="mt-3 leading-7 text-slate-400">{capability.description}</p>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
