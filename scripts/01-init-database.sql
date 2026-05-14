create table donations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  discord_username text,
  amount integer not null,
  payment_method text not null,
  proof_url text not null,
  message text,
  status text default 'pending',
  created_at timestamp default now(),
  action_by text,
  action_at timestamp
);

create table admin_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  created_at timestamp default now()
);

create index idx_donations_status on donations(status);
create index idx_donations_created_at on donations(created_at desc);
create index idx_admin_users_username on admin_users(username);

alter table donations enable row level security;
alter table admin_users enable row level security;

create policy donations_read_approved on donations for select using (status = 'approved');
create policy admin_users_all on admin_users for all using (true);
