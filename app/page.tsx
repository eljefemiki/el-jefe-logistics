import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import FleetShowcase from "@/components/home/FleetShowcase";
import ChroniclePreview from "@/components/home/ChroniclePreview";
import RecruitmentCTA from "@/components/home/RecruitmentCTA";
import Footer from "@/components/layout/Footer";
import FleetPreview from "@/components/home/FleetPreview";
import DriverSpotlight from "@/components/home/DriverSpotlight";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white">
  <Hero />
  <Stats />
    <FleetShowcase />
     <ChroniclePreview />
      <RecruitmentCTA />
      <FleetPreview />
      <DriverSpotlight />
      <Footer />
</main>

    </>
  );
}