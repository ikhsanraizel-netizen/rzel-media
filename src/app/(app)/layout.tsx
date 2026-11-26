import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/lib/supabase/server";
async function logout() { "use server"; await createClient().auth.signOut(); redirect("/login"); }
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="md:flex min-h-screen"><Sidebar logout={logout} /><main className="flex-1 p-5 md:p-8 min-w-0">{children}</main></div>;
}
