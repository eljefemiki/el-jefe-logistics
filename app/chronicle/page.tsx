import { Newspaper } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";

export default function ChroniclePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 py-20 text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Newspaper className="mx-auto h-14 w-14 text-blue-400" />
            <h1 className="mt-6 text-5xl font-black sm:text-6xl">Company Chronicle</h1>
            <p className="mt-6 text-xl leading-8 text-slate-400">
              This is the future home of verified El Jefe Logistics news, community milestones, and operational updates.
            </p>
            <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold">No published updates yet</h2>
              <p className="mt-3 text-slate-400">We will publish the first entry when there is genuine company news to share.</p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
