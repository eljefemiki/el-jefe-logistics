import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";

export default function FleetPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white">
        <Container>

          <div className="py-24 text-center">

            <h1 className="text-6xl font-black">
              Our Fleet
            </h1>

            <p className="mt-6 text-xl text-slate-400">
              Explore the trucks that power El Jefe Logistics.
            </p>

          </div>

        </Container>
      </main>

      <Footer />
    </>
  );
}