import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";

export default function CTA() {
  return (
    <Section className="bg-gradient-to-r from-blue-700 to-slate-900">

      <div className="text-center">

        <h2 className="text-5xl font-black text-white">
          Ready to Begin Your Journey?
        </h2>

        <p className="mt-6 text-xl text-slate-200">
          Join El Jefe Logistics today and become part of one of Europe&apos;s growing virtual trucking communities.
        </p>

        <div className="mt-10">
          <Button>
            Apply Today
          </Button>
        </div>

      </div>

    </Section>
  );
}
