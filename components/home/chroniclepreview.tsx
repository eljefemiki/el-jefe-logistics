import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";

const posts = [
  {
    date: "6 July 2026",
    title: "El Jefe Logistics Begins",
    description:
      "Today marks the beginning of El Jefe Logistics. Development of our company website and systems has officially started.",
  },
  {
    date: "Coming Soon",
    title: "Recruitment Opens",
    description:
      "Applications will soon open for drivers looking to join our growing company.",
  },
  {
    date: "Future",
    title: "First Community Convoy",
    description:
      "Our first official convoy will bring drivers together from across Europe.",
  },
];

export default function ChroniclePreview() {
  return (
    <Section className="bg-slate-900">
      <Container>
        <div className="mb-14 text-center">
          <h2 className="text-5xl font-black">
            Company Chronicle
          </h2>

          <p className="mt-4 text-slate-400">
            Every milestone. Every achievement. Every mile.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.title}>
              <p className="text-sm font-semibold text-blue-400">
                {post.date}
              </p>

              <h3 className="mt-4 text-2xl font-bold">
                {post.title}
              </h3>

              <p className="mt-4 text-slate-400">
                {post.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}