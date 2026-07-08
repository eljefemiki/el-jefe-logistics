import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <Container>
        <div className="grid gap-10 py-16 md:grid-cols-3">

          <div>
            <h3 className="text-2xl font-bold text-white">
              🚛 El Jefe Logistics
            </h3>

            <p className="mt-4 text-slate-400">
              Every Mile Earned.
              Every Achievement Remembered.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold">
              Navigation
            </h4>

            <ul className="space-y-2 text-slate-400">
              <li><a href="#">Home</a></li>
              <li><a href="#">Fleet</a></li>
              <li><a href="#">Chronicle</a></li>
              <li><a href="#">Join Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold">
              Community
            </h4>

            <p className="text-slate-400">
              Discord
            </p>

            <p className="mt-2 text-slate-400">
              TruckersMP
            </p>

            <p className="mt-2 text-slate-400">
              Contact
            </p>
          </div>

        </div>

        <div className="border-t border-slate-800 py-6 text-center text-slate-500">
          © 2026 El Jefe Logistics • Built with ❤️ and lots of coffee.
        </div>
      </Container>
    </footer>
  );
}

