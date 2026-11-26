import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/Logo";
async function login(fd: FormData) {
  "use server";
  const sb = createClient();
  const { error } = await sb.auth.signInWithPassword({ email: String(fd.get("email")), password: String(fd.get("password")) });
  if (error) redirect("/login?error=1");
  redirect("/dashboard");
}
export default function Login({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="min-h-screen grid place-items-center px-4">
      <form action={login} className="w-full max-w-sm space-y-4 bg-coal border border-line rounded-lg p-8">
        <Logo size={40} />
        <p className="text-mute text-sm">Every Shadow Has a Story.</p>
        {searchParams.error && <p role="alert" className="text-sm text-bloodhi">Email atau kata sandi salah. Periksa lalu coba lagi.</p>}
        <label className="block text-sm">Email
          <input name="email" type="email" required autoComplete="email" className="mt-1 w-full bg-ink border border-line rounded px-3 py-2" /></label>
        <label className="block text-sm">Kata sandi
          <input name="password" type="password" required autoComplete="current-password" className="mt-1 w-full bg-ink border border-line rounded px-3 py-2" /></label>
        <button className="w-full bg-blood hover:bg-bloodhi transition-colors rounded py-2 font-medium">Masuk</button>
      </form>
    </main>
  );
}
