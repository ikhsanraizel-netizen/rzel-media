import { createClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
const n = (v: number | null | undefined) => (v ?? 0).toLocaleString("id-ID");
export default async function Dashboard() {
  const sb = createClient();
  const count = async (q: any) => (await q).count ?? 0;
  const head = { count: "exact" as const, head: true };
  const [emps, ideas, scripts, inProd, ready, published, notifs, acts, team, snaps] = await Promise.all([
    count(sb.from("ai_employees").select("*", head)),
    count(sb.from("projects").select("*", head).eq("stage", "ide")),
    count(sb.from("ai_outputs").select("*", head).eq("kind", "script").eq("approved", true)),
    count(sb.from("projects").select("*", head).in("stage", ["visual_generation", "voice_over", "video_editing", "quality_control"])),
    count(sb.from("projects").select("*", head).eq("stage", "director_approval")),
    count(sb.from("projects").select("*", head).in("stage", ["publishing", "analytics"])),
    sb.from("notifications").select("id,message,created_at").eq("resolved", false).order("created_at", { ascending: false }).limit(5),
    sb.from("activity_log").select("id,message,created_at").order("created_at", { ascending: false }).limit(8),
    sb.from("ai_employees").select("code,name,title,status,current_task").order("code"),
    sb.from("analytics_snapshots").select("views,likes,comments,shares"),
  ]);
  const s = snaps.data ?? [];
  const views = s.reduce((a: number, r: any) => a + (r.views ?? 0), 0);
  const eng = s.reduce((a: number, r: any) => a + (r.likes ?? 0) + (r.comments ?? 0) + (r.shares ?? 0), 0);
  const cards: [string, string][] = [
    ["Karyawan AI", n(emps)], ["Ide cerita", n(ideas)], ["Naskah selesai", n(scripts)],
    ["Video dalam produksi", n(inProd)], ["Siap publikasi", n(ready)], ["Sudah dipublikasikan", n(published)],
    ["Total views", s.length ? n(views) : "—"], ["Total engagement", s.length ? n(eng) : "—"],
    ["Pendapatan aktual", "—"],
  ];
  const nt = notifs.data ?? [], ac = acts.data ?? [], tm = team.data ?? [];
  return (<div className="space-y-8">
    <h1 className="font-display text-3xl font-bold">Dashboard Direktur</h1>
    {nt.length > 0 && <section aria-label="Perlu keputusan" className="border border-blood bg-blood/10 rounded-lg p-4">
      <h2 className="font-medium mb-2">Menunggu keputusan Anda</h2>
      <ul className="space-y-1 text-sm">{nt.map((x: any) => <li key={x.id}>{x.message}</li>)}</ul></section>}
    <section className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {cards.map(([l, v]) => <div key={l} className="bg-coal border border-line rounded-lg p-4">
        <div className="text-sm text-mute">{l}</div><div className="font-display text-3xl font-bold mt-1">{v}</div></div>)}
    </section>
    <p className="text-xs text-mute">Tanda “—” berarti belum ada data. Views dan engagement terisi setelah Tahap 6 (Analytics). Pendapatan aktual terisi dari input manual di Tahap 7 (Finance).</p>
    <div className="grid lg:grid-cols-2 gap-6">
      <section><h2 className="font-display text-xl font-bold mb-3">Status karyawan AI</h2>
        <ul className="divide-y divide-line bg-coal border border-line rounded-lg">
          {tm.map((e: any) => <li key={e.code} className="p-3 flex justify-between gap-3 text-sm">
            <span><b>{e.name}</b> <span className="text-mute">{e.title}</span></span>
            <span className={e.status === "aktif" ? "text-bloodhi" : "text-mute"}>{e.current_task ?? (e.status === "aktif" ? "Siaga" : "Tidak aktif")}</span></li>)}
          {tm.length === 0 && <li className="p-3 text-sm text-mute">Belum ada data. Jalankan supabase/schema.sql.</li>}
        </ul></section>
      <section><h2 className="font-display text-xl font-bold mb-3">Aktivitas terbaru</h2>
        <ul className="divide-y divide-line bg-coal border border-line rounded-lg">
          {ac.map((x: any) => <li key={x.id} className="p-3 text-sm">{x.message}
            <div className="text-xs text-mute">{new Date(x.created_at).toLocaleString("id-ID")}</div></li>)}
          {ac.length === 0 && <li className="p-3 text-sm text-mute">Belum ada aktivitas. Perintah pertama ke Aria akan muncul di sini setelah Tahap 3.</li>}
        </ul></section>
    </div></div>);
}
