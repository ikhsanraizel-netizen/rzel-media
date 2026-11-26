-- rZel Media: skema Tahap 1. Jalankan di Supabase > SQL Editor.
create table profiles (id uuid primary key references auth.users on delete cascade, full_name text, role text not null default 'viewer' check (role in ('director','editor','viewer')), created_at timestamptz default now());
create table ai_employees (code text primary key, name text not null, title text not null, description text, system_prompt text not null, model text default 'claude-sonnet-4-6', status text not null default 'aktif' check (status in ('aktif','tidak_aktif')), current_task text);
create table projects (id uuid primary key default gen_random_uuid(), title text not null, brief text, stage text not null default 'ide' check (stage in ('ide','research','script','storyboard','visual_generation','voice_over','video_editing','quality_control','director_approval','publishing','analytics')), created_by uuid references auth.users, created_at timestamptz default now());
create table project_stages (id uuid primary key default gen_random_uuid(), project_id uuid references projects on delete cascade, stage text not null, owner_code text references ai_employees(code), status text not null default 'menunggu' check (status in ('menunggu','berjalan','review','disetujui','revisi')), started_at timestamptz, finished_at timestamptz);
create table ai_outputs (id uuid primary key default gen_random_uuid(), project_id uuid references projects on delete cascade, employee_code text references ai_employees(code), kind text not null, content jsonb not null, version int default 1, approved boolean default false, created_at timestamptz default now());
create table activity_log (id uuid primary key default gen_random_uuid(), project_id uuid references projects on delete set null, actor text, message text not null, created_at timestamptz default now());
create table notifications (id uuid primary key default gen_random_uuid(), message text not null, project_id uuid references projects on delete cascade, resolved boolean default false, created_at timestamptz default now());
create table analytics_snapshots (id uuid primary key default gen_random_uuid(), project_id uuid references projects on delete cascade, platform text not null, views int, likes int, comments int, shares int, captured_at timestamptz default now());
create or replace function is_director() returns boolean language sql security definer stable as $$ select exists(select 1 from profiles where id = auth.uid() and role = 'director') $$;
do $$ declare t text; begin foreach t in array array['profiles','ai_employees','projects','project_stages','ai_outputs','activity_log','notifications','analytics_snapshots'] loop
  execute format('alter table %I enable row level security', t);
  execute format('create policy "director_all" on %I for all using (is_director()) with check (is_director())', t);
end loop; end $$;
create policy "own_profile" on profiles for select using (id = auth.uid());
insert into ai_employees (code,name,title,system_prompt) values
('01','Aria','Chief Content Officer','Kamu Aria, koordinator rZel Media. Terima perintah direktur, bagi tugas, periksa kualitas, laporkan. Jangan menulis naskah atau membuat visual sendiri.'),
('02','Raven','Content Researcher','Kamu Raven. Riset ide horor, urban legend, dan tren; periksa sumber. Target minimal 10 ide per minggu. Jangan menulis naskah.'),
('03','Edgar','Chief Scriptwriter','Kamu Edgar. Tulis naskah: hook 3 detik, alur, plot twist, ending, voice-over. Gaya natural dan tidak bertele-tele.'),
('04','Vesper','Creative Director','Kamu Vesper. Susun konsep kreatif, storyboard, suasana visual, karakter, komposisi adegan.'),
('05','Nyx','AI Visual Designer','Kamu Nyx. Buat prompt gambar dan video, desain karakter, thumbnail. Gaya cinematic horror, rasio 9:16, karakter konsisten.'),
('06','Dante','Video Editor','Kamu Dante. Susun video: gambar, voice-over, efek suara, musik, subtitle, transisi, ekspor.'),
('07','Selene','Social Media Manager','Kamu Selene. Judul, caption, hashtag, jadwal. Dilarang mempublikasikan tanpa persetujuan direktur.'),
('08','Orion','Content Analyst','Kamu Orion. Analisis views, engagement, retention; beri rekomendasi hanya dari data yang ada.');
-- Setelah mendaftar di Supabase Auth, jadikan akunmu direktur:
-- insert into profiles (id, full_name, role) select id, 'Direktur', 'director' from auth.users where email = 'EMAILMU@contoh.com';
