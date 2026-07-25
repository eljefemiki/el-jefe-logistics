import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/stats";
import FleetPreview from "@/components/home/fleetpreview";
import DriverSpotlight from "@/components/home/DriverSpotlight";
import Chronicle from "@/components/home/Chronicle";
import Values from "@/components/home/Values";
import Recruitment from "@/components/home/Recruitment";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-slate-950 text-white">

        <Hero />

        <Stats />

        <FleetPreview />

        <DriverSpotlight />

        <Chronicle />

        <Values />

        <Recruitment />

        <CTA />

      </main>

      <Footer />
    </>
  );
}
