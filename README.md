# rZel Media — Tahap 1
Fondasi: login, 14 menu, dashboard, skema database. Halaman menu lain adalah placeholder berlabel tahap.

## Pasang (cukup browser HP)
1. **Supabase**: buat proyek. Buka SQL Editor, tempel isi `supabase/schema.sql`, jalankan.
2. Authentication > Users > Add user (email + kata sandi). Lalu jalankan baris `insert into profiles` di akhir schema.sql (ganti emailmu) agar akunmu jadi direktur.
3. **GitHub**: buat repo, unggah semua file proyek ini.
4. **Vercel**: Import repo. Di Environment Variables isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase > Project Settings > API). Deploy.
5. Buka situsmu, masuk dengan akun tadi.

## Catatan
- `SUPABASE_SERVICE_ROLE_KEY` dan `ANTHROPIC_API_KEY` hanya di server (belum dipakai di Tahap 1). Jangan beri awalan NEXT_PUBLIC_.
- Hitungan dashboard: ide = proyek tahap `ide`; siap publikasi = tahap `director_approval`; dipublikasikan = tahap `publishing`/`analytics`.
- Belum diuji dijalankan: proyek ini belum di-build di lingkungan ini (tanpa jaringan). Jika ada error saat deploy, kirim pesan error-nya ke saya.
