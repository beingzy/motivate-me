-- Motivate Me: initial database schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Habits
create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  points_per_completion integer not null check (points_per_completion > 0),
  requires_photo boolean not null default false,
  requires_approval boolean not null default false,
  frequency_target text not null default 'none' check (frequency_target in ('none', 'daily', 'custom')),
  frequency_count integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. Action Logs
create table action_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  logged_at timestamptz not null default now(),
  photo_url text,
  note text,
  status text not null default 'self_approved' check (status in ('pending_approval', 'approved', 'self_approved')),
  points_awarded integer not null default 0,
  approved_by uuid references auth.users(id),
  approved_at timestamptz
);

-- 3. Point Ledger (append-only — never update or delete rows)
create table point_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  delta integer not null,
  reason text not null,
  reference_id uuid not null,
  reference_type text not null check (reference_type in ('action_log', 'redemption', 'streak_bonus')),
  created_at timestamptz not null default now()
);

-- 4. Rewards
create table rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text not null default 'offline' check (type in ('offline', 'online')),
  point_cost integer not null check (point_cost > 0),
  photo_url text,
  url text,
  description text,
  requires_approval boolean not null default false,
  status text not null default 'available' check (status in ('available', 'wishlist', 'redeemed')),
  created_at timestamptz not null default now()
);

-- 5. Notifications
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('streak', 'approval', 'redemption', 'wishlist')),
  message text not null,
  timestamp timestamptz not null default now(),
  read boolean not null default false
);

-- Indexes for common queries
create index idx_habits_user on habits(user_id) where is_active = true;
create index idx_action_logs_user on action_logs(user_id, logged_at desc);
create index idx_action_logs_habit on action_logs(habit_id, logged_at desc);
create index idx_point_ledger_user on point_ledger(user_id, created_at desc);
create index idx_rewards_user on rewards(user_id);
create index idx_notifications_user on notifications(user_id) where read = false;

-- ============================================
-- Row Level Security (RLS)
-- Users can only access their own data
-- ============================================

alter table habits enable row level security;
alter table action_logs enable row level security;
alter table point_ledger enable row level security;
alter table rewards enable row level security;
alter table notifications enable row level security;

-- Habits: users see and manage only their own
create policy "Users manage own habits"
  on habits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Action Logs: users see and create only their own
create policy "Users manage own action logs"
  on action_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Point Ledger: users can read their own; inserts only via their own user_id
-- No update or delete allowed (append-only enforced at app level + no update policy)
create policy "Users read own ledger"
  on point_ledger for select
  using (auth.uid() = user_id);

create policy "Users insert own ledger"
  on point_ledger for insert
  with check (auth.uid() = user_id);

-- Rewards: users manage only their own
create policy "Users manage own rewards"
  on rewards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Notifications: users manage only their own
create policy "Users manage own notifications"
  on notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
