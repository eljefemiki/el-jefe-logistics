import RegisterForm from "@/components/auth/RegisterForm";
import Logo from "@/components/auth/Logo";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}