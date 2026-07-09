import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function DriverSpotlight() {
  return (
    <Section className="bg-slate-950">

      <div className="text-center mb-16">

        <h2 className="text-5xl font-black text-white">
          Driver of the Month
        </h2>

        <p className="mt-4 text-slate-400">
          Celebrating our outstanding drivers.
        </p>

      </div>

      <Card className="mx-auto max-w-4xl">

        <div className="grid items-center gap-10 md:grid-cols-2">

          <div className="flex justify-center">

            <div className="flex h-56 w-56 items-center justify-center rounded-full border-4 border-blue-500 bg-slate-800 text-8xl">
              👨‍✈️
            </div>

          </div>

          <div>

            <p className="text-blue-400 font-semibold uppercase">
              CEO
            </p>

            <h3 className="mt-2 text-4xl font-black text-white">
              Mike
            </h3>

            <div className="mt-8 space-y-3 text-lg">

              <p className="text-slate-300">
                🚛 Deliveries: <strong>18,452</strong>
              </p>

              <p className="text-slate-300">
                🌍 Distance: <strong>3,482,991 km</strong>
              </p>

              <p className="text-slate-300">
                ⭐ Reputation: <strong>★★★★★</strong>
              </p>

              <p className="text-slate-300">
                🚚 Favourite Truck: <strong>Volvo FH Aero</strong>
              </p>

            </div>

            <div className="mt-8">

              <Button>
                View Profile
              </Button>

            </div>

          </div>

        </div>

      </Card>

    </Section>
  );
}