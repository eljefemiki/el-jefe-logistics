import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";

export default function DriversPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Container>

        <PageHeader
          title="Drivers"
          subtitle="Meet the people behind El Jefe Logistics."
        />

      </Container>
    </main>
  );
}