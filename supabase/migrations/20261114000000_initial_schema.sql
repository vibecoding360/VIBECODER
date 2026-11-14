
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 240),
  description text,
  status text not null default 'todo' check (status in ('todo','in_progress','done')),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  target_per_week smallint not null default 7 check (target_per_week between 1 and 7),
  created_at timestamptz not null default now(),
  unique (user_id, name)
);
create table if not exists public.habit_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  completed_on date not null default current_date,
  created_at timestamptz not null default now(),
  unique (habit_id, completed_on)
);
create index if not exists tasks_user_status_due_idx on public.tasks(user_id, status, due_at);
create index if not exists focus_sessions_user_started_idx on public.focus_sessions(user_id, started_at desc);
create index if not exists focus_sessions_task_id_idx on public.focus_sessions(task_id);
create index if not exists habits_user_idx on public.habits(user_id);
create index if not exists habit_entries_user_date_idx on public.habit_entries(user_id, completed_on desc);
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.habits enable row level security;
alter table public.habit_entries enable row level security;
create policy "Users can view own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Users can insert own profile" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "Users can update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "Users manage own tasks" on public.tasks for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage own focus sessions" on public.focus_sessions for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage own habits" on public.habits for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage own habit entries" on public.habit_entries for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
