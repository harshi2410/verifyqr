create table if not exists public.scan_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  verified_by uuid references auth.users(id),
  user_email text,
  source text not null default 'qr_portal',
  qr_value text
);

alter table public.scan_logs enable row level security;

drop policy if exists "Authenticated users can read scan logs" on public.scan_logs;
create policy "Authenticated users can read scan logs"
  on public.scan_logs for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert scan logs" on public.scan_logs;
create policy "Authenticated users can insert scan logs"
  on public.scan_logs for insert
  to authenticated
  with check (true);

create index if not exists scan_logs_created_at_idx
  on public.scan_logs (created_at desc);

create index if not exists scan_logs_qr_value_created_at_idx
  on public.scan_logs (qr_value, created_at desc);

create table if not exists public.fraud_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  reason text not null,
  severity text not null check (severity in ('normal', 'warning', 'critical')),
  qr_value text,
  scan_count integer not null default 0
);

alter table public.fraud_logs enable row level security;

drop policy if exists "Authenticated users can read fraud logs" on public.fraud_logs;
create policy "Authenticated users can read fraud logs"
  on public.fraud_logs for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert fraud logs" on public.fraud_logs;
create policy "Authenticated users can insert fraud logs"
  on public.fraud_logs for insert
  to authenticated
  with check (true);

create index if not exists fraud_logs_created_at_idx
  on public.fraud_logs (created_at desc);
