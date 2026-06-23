create table if not exists charity_expenses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  amount integer not null check (amount > 0),
  description text,
  proof_url text,
  spent_at date not null default current_date,
  created_at timestamp default now(),
  created_by text
);

create index if not exists idx_charity_expenses_spent_at on charity_expenses(spent_at desc);
create index if not exists idx_charity_expenses_created_at on charity_expenses(created_at desc);

alter table charity_expenses enable row level security;
