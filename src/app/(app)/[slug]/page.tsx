import { notFound } from "next/navigation";
import { MENU } from "@/lib/menu";
export default function Stub({ params }: { params: { slug: string } }) {
  const m = MENU.find((x) => x.slug === params.slug && x.slug !== "dashboard");
  if (!m) notFound();
  return (<div><h1 className="font-display text-3xl font-bold">{m.label}</h1>
    <p className="mt-3 text-mute max-w-prose">Halaman ini belum dibangun. Dijadwalkan di Tahap {m.tahap}.</p></div>);
}
