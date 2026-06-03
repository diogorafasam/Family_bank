-- ── EXTENSÕES ────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── FAMÍLIAS ─────────────────────────────────────────────────────────────────
create table families (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  invite_code text unique default upper(substring(md5(random()::text), 1, 8)),
  created_at timestamptz default now()
);

-- ── MEMBROS ──────────────────────────────────────────────────────────────────
create table family_members (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid references families(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  role text default 'member' check (role in ('admin','member')),
  color text default '#0284C7',
  created_at timestamptz default now(),
  unique(family_id, user_id)
);

-- ── CONTAS ───────────────────────────────────────────────────────────────────
create table accounts (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid references families(id) on delete cascade,
  type text not null default 'checking',
  label text not null,
  balance numeric(12,2) default 0,
  created_at timestamptz default now()
);

-- ── TRANSAÇÕES ───────────────────────────────────────────────────────────────
create table transactions (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid references families(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  type text not null check (type in ('income','expense','transfer')),
  amount numeric(12,2) not null,
  category text not null default 'outros',
  description text not null,
  date date not null default current_date,
  recurring boolean default false,
  created_at timestamptz default now()
);

-- ── OBJETIVOS ────────────────────────────────────────────────────────────────
create table goals (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid references families(id) on delete cascade,
  name text not null,
  icon text default '🎯',
  color text default '#0284C7',
  target numeric(12,2) not null,
  current_amount numeric(12,2) default 0,
  deadline date,
  created_at timestamptz default now()
);

-- ── CATEGORIAS ───────────────────────────────────────────────────────────────
create table categories (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid references families(id) on delete cascade,
  label text not null,
  icon text default '📦',
  color text default '#64748B',
  created_at timestamptz default now()
);

-- ── ORÇAMENTOS ───────────────────────────────────────────────────────────────
create table budgets (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid references families(id) on delete cascade,
  category_id text not null,
  limit_amount numeric(12,2) not null,
  month text not null default to_char(current_date,'YYYY-MM'),
  created_at timestamptz default now(),
  unique(family_id, category_id, month)
);

-- ── SEGURANÇA (RLS) ───────────────────────────────────────────────────────────
alter table families       enable row level security;
alter table family_members enable row level security;
alter table accounts       enable row level security;
alter table transactions   enable row level security;
alter table goals          enable row level security;
alter table categories     enable row level security;
alter table budgets        enable row level security;

create or replace function get_my_family_id()
returns uuid language sql security definer as $$
  select family_id from family_members where user_id = auth.uid() limit 1;
$$;

create policy "fam_sel"  on families       for select using (id = get_my_family_id());
create policy "mem_all"  on family_members for all    using (family_id = get_my_family_id());
create policy "acc_all"  on accounts       for all    using (family_id = get_my_family_id());
create policy "tx_all"   on transactions   for all    using (family_id = get_my_family_id());
create policy "goal_all" on goals          for all    using (family_id = get_my_family_id());
create policy "cat_all"  on categories     for all    using (family_id = get_my_family_id());
create policy "bud_all"  on budgets        for all    using (family_id = get_my_family_id());

-- ── REALTIME ─────────────────────────────────────────────────────────────────
alter publication supabase_realtime add table transactions;
alter publication supabase_realtime add table accounts;
alter publication supabase_realtime add table goals;
alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table family_members;

-- ── CATEGORIAS PADRÃO (criadas automaticamente com cada família) ──────────────
create or replace function create_default_categories()
returns trigger language plpgsql as $$
begin
  insert into categories (family_id, label, icon, color) values
    (new.id,'Casa','🏠','#0284C7'),
    (new.id,'Supermercado','🛒','#059669'),
    (new.id,'Transportes','🚗','#D97706'),
    (new.id,'Saúde','❤️','#DC2626'),
    (new.id,'Educação','📚','#7C3AED'),
    (new.id,'Lazer','🎮','#DB2777'),
    (new.id,'Investimentos','📈','#059669'),
    (new.id,'Poupança','💰','#D97706'),
    (new.id,'Outros','📦','#64748B');
  return new;
end;
$$;

create trigger on_family_created
  after insert on families
  for each row execute function create_default_categories();
