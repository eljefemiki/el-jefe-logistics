import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

export default function RecruitmentCTA() {
  return (
    <Section>
      <Container>
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-14 text-center shadow-2xl">

          <h2 className="text-5xl font-black text-white">
            Ready to Join El Jefe Logistics?
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl text-blue-100">
            Become part of a growing community of professional virtual truck
            drivers. Every journey matters. Every mile tells a story.
          </p>

          <button className="mt-10 rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-700 transition hover:scale-105 hover:bg-slate-100">
            🚛 Apply Today
          </button>

        </div>
      </Container>
    </Section>
  );
}