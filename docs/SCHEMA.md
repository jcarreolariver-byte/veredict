# SCHEMA.md — Database Schema
# Verdict · Supabase (PostgreSQL)

> Versión: 1.0 · Estado: ✅ aprobado por César
> Última actualización: generado con Claude · junio 2026

---

## 1. Tablas

### 1.1 `profiles`
Extiende `auth.users` de Supabase. Se crea automáticamente al registrarse.

```sql
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique,                    -- generado automáticamente, nunca el nombre real
  avatar_seed   text not null,                  -- seed para avatar generado (DiceBear, etc.)
  country_code  char(2),                        -- ISO 3166-1 alpha-2, detectado por IP en registro
  tier          text not null default 'free'    -- 'free' | 'premium'
    check (tier in ('free', 'premium')),
  streak_days   integer not null default 0,
  last_active   date,
  created_at    timestamptz not null default now()
);
```

**Notas:**
- `username` nunca es el nombre real — es generado (ej: "anonymous_sparrow_42")
- `country_code` se detecta por IP al registrarse, nunca se le pregunta al usuario
- No se almacena email, nombre ni ningún dato identificable fuera de `auth.users`

---

### 1.2 `dilemmas`
Los dilemas creados y administrados por César.

```sql
create table dilemmas (
  id            uuid primary key default gen_random_uuid(),
  type          text not null
    check (type in ('quick', 'context', 'justification')),
  question      text not null,                  -- max 120 chars (enforced en app)
  context       text,                           -- solo para type='context', max 280 chars
  option_a      text not null,                  -- max 40 chars
  option_b      text not null,                  -- max 40 chars
  category      text not null,                  -- 'ethics','loyalty','money','relationships','society','other'
  country_target char(2),                       -- null = global, 'US' = solo USA, etc.
  status        text not null default 'draft'
    check (status in ('draft', 'scheduled', 'active', 'archived')),
  scheduled_at  timestamptz,
  published_at  timestamptz,
  votes_a       integer not null default 0,     -- counter cache para performance
  votes_b       integer not null default 0,     -- counter cache para performance
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
```

**Notas:**
- `votes_a` y `votes_b` son counters cacheados — se actualizan via trigger
- Solo status='active' aparece en el feed de usuarios
- `country_target` null significa visible para todos los países

---

### 1.3 `votes`
El registro de cada voto. Nunca se puede asociar un voto a un usuario real.

```sql
create table votes (
  id            uuid primary key default gen_random_uuid(),
  dilemma_id    uuid not null references dilemmas(id) on delete cascade,
  user_id       uuid not null references profiles(id) on delete cascade,
  choice        char(1) not null check (choice in ('a', 'b')),
  country_code  char(2),                        -- copiado del profile al momento de votar
  created_at    timestamptz not null default now(),

  unique (dilemma_id, user_id)                  -- un voto por dilema por usuario
);
```

**Notas:**
- `unique (dilemma_id, user_id)` previene votos duplicados a nivel de DB
- `country_code` se copia del perfil para mantener consistencia histórica
- No existe forma de ir de `votes.user_id` a datos identificables en producción

---

### 1.4 `justifications`
Las justificaciones escritas opcionales después de votar.

```sql
create table justifications (
  id            uuid primary key default gen_random_uuid(),
  dilemma_id    uuid not null references dilemmas(id) on delete cascade,
  user_id       uuid not null references profiles(id) on delete cascade,
  choice        char(1) not null check (choice in ('a', 'b')),
  content       text not null,                  -- max 140 chars (enforced en app)
  likes_count   integer not null default 0,     -- counter cache
  is_flagged    boolean not null default false, -- moderación
  created_at    timestamptz not null default now(),

  unique (dilemma_id, user_id)                  -- una justificación por dilema por usuario
);
```

---

### 1.5 `justification_likes`
Los likes a las justificaciones.

```sql
create table justification_likes (
  justification_id uuid not null references justifications(id) on delete cascade,
  user_id          uuid not null references profiles(id) on delete cascade,
  created_at       timestamptz not null default now(),

  primary key (justification_id, user_id)
);
```

---

### 1.6 `daily_limits`
Control del límite de 5 dilemas diarios por usuario (tier free).

```sql
create table daily_limits (
  user_id       uuid not null references profiles(id) on delete cascade,
  date          date not null default current_date,
  votes_count   integer not null default 0,

  primary key (user_id, date)
);
```

**Notas:**
- Se crea o incrementa con cada voto via trigger
- Se consulta antes de mostrar el botón de voto
- Los registros anteriores a 30 días se pueden purgar (no tienen valor)

---

## 2. Vistas útiles

### `dilemma_results`
Resultados agregados por país para un dilema — usada en la pantalla de resultados.

```sql
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
```

### `moral_profile`
Perfil moral agregado por usuario — usado en la pantalla de perfil.

```sql
create view moral_profile as
select
  v.user_id,
  count(*) as total_votes,
  -- Las dimensiones se calculan según categoría del dilema y choice
  -- Lógica: cada categoría de dilema contribuye a 1-2 dimensiones del perfil
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
```

---

## 3. Triggers

### Actualizar counter cache en `dilemmas`
```sql
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
```

### Actualizar `daily_limits` en cada voto
```sql
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
```

### Crear perfil automáticamente al registrarse
```sql
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
```

---

## 4. Índices

```sql
-- Queries más frecuentes: feed de dilemas activos
create index idx_dilemmas_status_published
  on dilemmas(status, published_at desc)
  where status = 'active';

-- Verificar si el usuario ya votó este dilema
create index idx_votes_user_dilemma
  on votes(user_id, dilemma_id);

-- Resultados por país para un dilema
create index idx_votes_dilemma_country
  on votes(dilemma_id, country_code);

-- Límite diario del usuario
create index idx_daily_limits_user_date
  on daily_limits(user_id, date);

-- Justificaciones más likeadas para un dilema
create index idx_justifications_dilemma_likes
  on justifications(dilemma_id, likes_count desc)
  where is_flagged = false;
```

---

## 5. Row Level Security (RLS)

```sql
-- Activar RLS en todas las tablas
alter table profiles          enable row level security;
alter table dilemmas          enable row level security;
alter table votes             enable row level security;
alter table justifications    enable row level security;
alter table justification_likes enable row level security;
alter table daily_limits      enable row level security;

-- PROFILES
-- Cualquier usuario autenticado puede ver perfiles (para perfiles públicos)
create policy "profiles_select" on profiles
  for select using (auth.uid() is not null);

-- Solo el propio usuario puede actualizar su perfil
create policy "profiles_update" on profiles
  for update using (auth.uid() = id);

-- DILEMMAS
-- Cualquiera puede ver dilemas activos (incluso anónimos para la landing)
create policy "dilemmas_select_active" on dilemmas
  for select using (status = 'active');

-- Solo service_role puede insertar/actualizar (admin panel de César usa service key)
-- No se necesita policy de insert/update para usuarios normales

-- VOTES
-- El usuario solo ve sus propios votos
create policy "votes_select_own" on votes
  for select using (auth.uid() = user_id);

-- El usuario solo puede insertar sus propios votos
create policy "votes_insert" on votes
  for insert with check (auth.uid() = user_id);

-- JUSTIFICATIONS
-- Cualquier usuario autenticado puede leer justificaciones no flaggeadas
create policy "justifications_select" on justifications
  for select using (
    auth.uid() is not null and is_flagged = false
  );

-- El usuario puede insertar su propia justificación
create policy "justifications_insert" on justifications
  for insert with check (auth.uid() = user_id);

-- JUSTIFICATION_LIKES
-- El usuario puede ver y gestionar sus propios likes
create policy "likes_select" on justification_likes
  for select using (auth.uid() = user_id);

create policy "likes_insert" on justification_likes
  for insert with check (auth.uid() = user_id);

create policy "likes_delete" on justification_likes
  for delete using (auth.uid() = user_id);

-- DAILY_LIMITS
-- El usuario solo ve su propio límite
create policy "daily_limits_select" on daily_limits
  for select using (auth.uid() = user_id);
```

---

## 6. Edge cases

| Caso | Solución |
|------|----------|
| Usuario intenta votar dos veces | `unique (dilemma_id, user_id)` en `votes` — error a nivel DB |
| Usuario alcanza límite de 5 diarios | Check en `daily_limits` antes de mostrar botón de voto |
| Usuario borra su cuenta | `on delete cascade` en todas las foreign keys a `profiles` |
| Dilema archivado pero con votos | Los votos se conservan para el dataset — el dilema deja de aparecer en feed |
| País no detectado | `country_code` null — se incluye en globales, excluido de desgloses por país |
| Justificación reportada | `is_flagged = true` — no aparece en queries de usuario, sí en admin |
| Empate exacto 50/50 | La app muestra "The world is divided on this one." |

---

## 7. Datos iniciales (seed)

Al lanzar el MVP, precargar:
- Mínimo 100 dilemas en status='active' de alta calidad
- Distribución recomendada: 40% quick, 40% context, 20% justification
- Cobertura de categorías: ethics (25%), relationships (25%), money (20%),
  loyalty (15%), society (15%)
- Todos en inglés (EN-US) para el MVP

El archivo de seed va en `supabase/seed.sql`.

---

*SCHEMA v1.0 · Verdict · 73 Solutions · César · generado junio 2026*
