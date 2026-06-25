-- ============================================================
-- Verdict · Migración inicial · 2026-06-25
-- ============================================================

-- ============================================================
-- TABLAS
-- ============================================================

create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique,
  avatar_seed   text not null,
  country_code  char(2),
  tier          text not null default 'free'
    check (tier in ('free', 'premium')),
  streak_days   integer not null default 0,
  last_active   date,
  created_at    timestamptz not null default now()
);

create table dilemmas (
  id            uuid primary key default gen_random_uuid(),
  type          text not null
    check (type in ('quick', 'context', 'justification')),
  question      text not null,
  context       text,
  option_a      text not null,
  option_b      text not null,
  category      text not null
    check (category in ('ethics','loyalty','money','relationships','society','other')),
  country_target char(2),
  status        text not null default 'draft'
    check (status in ('draft', 'scheduled', 'active', 'archived')),
  scheduled_at  timestamptz,
  published_at  timestamptz,
  votes_a       integer not null default 0,
  votes_b       integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table votes (
  id            uuid primary key default gen_random_uuid(),
  dilemma_id    uuid not null references dilemmas(id) on delete cascade,
  user_id       uuid not null references profiles(id) on delete cascade,
  choice        char(1) not null check (choice in ('a', 'b')),
  country_code  char(2),
  created_at    timestamptz not null default now(),

  unique (dilemma_id, user_id)
);

create table justifications (
  id            uuid primary key default gen_random_uuid(),
  dilemma_id    uuid not null references dilemmas(id) on delete cascade,
  user_id       uuid not null references profiles(id) on delete cascade,
  choice        char(1) not null check (choice in ('a', 'b')),
  content       text not null,
  likes_count   integer not null default 0,
  is_flagged    boolean not null default false,
  created_at    timestamptz not null default now(),

  unique (dilemma_id, user_id)
);

create table justification_likes (
  justification_id uuid not null references justifications(id) on delete cascade,
  user_id          uuid not null references profiles(id) on delete cascade,
  created_at       timestamptz not null default now(),

  primary key (justification_id, user_id)
);

create table daily_limits (
  user_id       uuid not null references profiles(id) on delete cascade,
  date          date not null default current_date,
  votes_count   integer not null default 0,

  primary key (user_id, date)
);

-- ============================================================
-- VISTAS
-- ============================================================

create view dilemma_results as
select
  v.dilemma_id,
  v.country_code,
  count(*) filter (where v.choice = 'a') as votes_a,
  count(*) filter (where v.choice = 'b') as votes_b,
  count(*) as total_votes,
  round(
    count(*) filter (where v.choice = 'a') * 100.0 / nullif(count(*), 0),
    1
  ) as pct_a
from votes v
group by v.dilemma_id, v.country_code;

create view moral_profile as
select
  v.user_id,
  count(*) as total_votes,
  count(*) filter (
    where d.category = 'ethics' and v.choice = 'a'
  ) as honesty_score,
  count(*) filter (
    where d.category = 'loyalty' and v.choice = 'a'
  ) as loyalty_score,
  count(*) filter (
    where d.category = 'money' and v.choice = 'b'
  ) as pragmatism_score,
  count(*) filter (
    where d.category = 'relationships' and v.choice = 'a'
  ) as empathy_score,
  count(*) filter (
    where d.category = 'society' and v.choice = 'b'
  ) as chaos_score
from votes v
join dilemmas d on d.id = v.dilemma_id
group by v.user_id;

-- ============================================================
-- TRIGGERS
-- ============================================================

create or replace function update_dilemma_vote_counts()
returns trigger as $$
begin
  if NEW.choice = 'a' then
    update dilemmas set votes_a = votes_a + 1 where id = NEW.dilemma_id;
  else
    update dilemmas set votes_b = votes_b + 1 where id = NEW.dilemma_id;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_vote_insert
  after insert on votes
  for each row execute procedure update_dilemma_vote_counts();

create or replace function update_daily_limit()
returns trigger as $$
begin
  insert into daily_limits (user_id, date, votes_count)
  values (NEW.user_id, current_date, 1)
  on conflict (user_id, date)
  do update set votes_count = daily_limits.votes_count + 1;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_vote_daily_limit
  after insert on votes
  for each row execute procedure update_daily_limit();

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, avatar_seed)
  values (
    NEW.id,
    substr(md5(random()::text), 1, 10)
  );
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- ÍNDICES
-- ============================================================

create index idx_dilemmas_status_published
  on dilemmas(status, published_at desc)
  where status = 'active';

create index idx_votes_user_dilemma
  on votes(user_id, dilemma_id);

create index idx_votes_dilemma_country
  on votes(dilemma_id, country_code);

create index idx_daily_limits_user_date
  on daily_limits(user_id, date);

create index idx_justifications_dilemma_likes
  on justifications(dilemma_id, likes_count desc)
  where is_flagged = false;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles             enable row level security;
alter table dilemmas             enable row level security;
alter table votes                enable row level security;
alter table justifications       enable row level security;
alter table justification_likes  enable row level security;
alter table daily_limits         enable row level security;

-- PROFILES
create policy "profiles_select" on profiles
  for select using (auth.uid() is not null);

create policy "profiles_update" on profiles
  for update using (auth.uid() = id);

-- DILEMMAS
create policy "dilemmas_select_active" on dilemmas
  for select using (status = 'active');

-- VOTES
create policy "votes_select_own" on votes
  for select using (auth.uid() = user_id);

create policy "votes_insert" on votes
  for insert with check (auth.uid() = user_id);

-- JUSTIFICATIONS
create policy "justifications_select" on justifications
  for select using (
    auth.uid() is not null and is_flagged = false
  );

create policy "justifications_insert" on justifications
  for insert with check (auth.uid() = user_id);

-- JUSTIFICATION_LIKES
create policy "likes_select" on justification_likes
  for select using (auth.uid() = user_id);

create policy "likes_insert" on justification_likes
  for insert with check (auth.uid() = user_id);

create policy "likes_delete" on justification_likes
  for delete using (auth.uid() = user_id);

-- DAILY_LIMITS
create policy "daily_limits_select" on daily_limits
  for select using (auth.uid() = user_id);
