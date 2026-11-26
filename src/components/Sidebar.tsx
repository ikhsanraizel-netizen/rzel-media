"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MENU } from "@/lib/menu";
import Logo from "./Logo";
export default function Sidebar({ logout }: { logout: () => Promise<void> }) {
  const path = usePathname(); const [open, setOpen] = useState(false);
  return (<>
    <header className="md:hidden flex items-center justify-between bg-coal border-b border-line px-4 py-3">
      <Logo /><button onClick={() => setOpen(!open)} aria-expanded={open} className="text-sm border border-line rounded px-3 py-1">Menu</button>
    </header>
    <aside className={`${open ? "block" : "hidden"} md:block md:w-60 shrink-0 bg-coal border-r border-line md:min-h-screen p-4`}>
      <div className="hidden md:block mb-6"><Logo size={32} /></div>
      <nav className="space-y-1">
        {MENU.map((m) => { const href = `/${m.slug}`; const on = path === href;
          return <Link key={m.slug} href={href} onClick={() => setOpen(false)}
            className={`block rounded px-3 py-2 text-sm transition-colors ${on ? "bg-blood text-bone" : "text-mute hover:bg-ash hover:text-bone"}`}>{m.label}</Link>; })}
      </nav>
      <form action={logout} className="mt-6"><button className="w-full text-left text-sm text-mute hover:text-bone px-3 py-2">Keluar</button></form>
    </aside></>);
}
