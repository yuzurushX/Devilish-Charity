create table if not exists campaign_settings (
  id boolean primary key default true check (id),
  donation_status text not null default 'open' check (donation_status in ('open', 'closed')),
  campaign_title text not null default 'Devilish Charity',
  target_amount integer not null default 0,
  event_name text,
  event_date text,
  event_location text,
  event_description text,
  progress_stage text not null default 'open' check (progress_stage in ('open', 'closed', 'preparing', 'distributed', 'completed')),
  progress_note text,
  updated_at timestamp default now(),
  updated_by text
);

insert into campaign_settings (id, donation_status, campaign_title, progress_stage)
values (true, 'open', 'Devilish Charity', 'open')
on conflict (id) do nothing;

alter table campaign_settings enable row level security;
