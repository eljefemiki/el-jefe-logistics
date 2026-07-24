export default function JoinPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <h1 className="text-5xl font-black mb-6">
          Join El Jefe Logistics
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl">
          Welcome to the recruitment centre.
          This page will soon allow drivers to submit applications,
          upload their VTC information, and begin their journey with
          El Jefe Logistics.
        </p>

        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold mb-4">
            🚛 Recruitment Portal
          </h2>

          <ul className="space-y-3 text-slate-300">
            <li>✅ Driver Application Form</li>
            <li>✅ Discord Verification</li>
            <li>✅ TruckersMP Details</li>
            <li>✅ Experience & Driving History</li>
            <li>✅ Recruitment Status Tracking</li>
          </ul>

          <button className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 transition">
            Applications Opening Soon
          </button>
        </div>
      </div>
    </main>
  );
}