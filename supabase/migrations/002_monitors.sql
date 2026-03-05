-- Monitor connections table
create table monitors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  monitor_user_id uuid not null references auth.users(id) on delete cascade,
  permissions jsonb not null default '{"can_edit_habits": false, "can_edit_rewards": false}'::jsonb,
  invite_token text unique,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, monitor_user_id)
);

create index idx_monitors_user on monitors(user_id);
create index idx_monitors_monitor on monitors(monitor_user_id);
create index idx_monitors_token on monitors(invite_token) where invite_token is not null;

alter table monitors enable row level security;

-- Users can see monitors linked to them (as user or as monitor)
create policy "Users see own monitor connections"
  on monitors for select
  using (auth.uid() = user_id or auth.uid() = monitor_user_id);

-- Users can create invites (they are the user being monitored)
create policy "Users create monitor invites"
  on monitors for insert
  with check (auth.uid() = user_id);

-- Users can update their own monitor connections (accept invite, revoke)
create policy "Users update own monitor connections"
  on monitors for update
  using (auth.uid() = user_id or auth.uid() = monitor_user_id);

-- Users can delete their own monitor connections
create policy "Users delete own monitor connections"
  on monitors for delete
  using (auth.uid() = user_id);

-- Monitors need read access to monitored user's data
-- Action logs: monitors can read for users they monitor
create policy "Monitors read monitored user action logs"
  on action_logs for select
  using (
    exists (
      select 1 from monitors
      where monitors.user_id = action_logs.user_id
        and monitors.monitor_user_id = auth.uid()
        and monitors.accepted_at is not null
    )
  );

-- Habits: monitors can read for users they monitor
create policy "Monitors read monitored user habits"
  on habits for select
  using (
    exists (
      select 1 from monitors
      where monitors.user_id = habits.user_id
        and monitors.monitor_user_id = auth.uid()
        and monitors.accepted_at is not null
    )
  );

-- Point ledger: monitors can read for users they monitor
create policy "Monitors read monitored user ledger"
  on point_ledger for select
  using (
    exists (
      select 1 from monitors
      where monitors.user_id = point_ledger.user_id
        and monitors.monitor_user_id = auth.uid()
        and monitors.accepted_at is not null
    )
  );

-- Rewards: monitors can read for users they monitor
create policy "Monitors read monitored user rewards"
  on rewards for select
  using (
    exists (
      select 1 from monitors
      where monitors.user_id = rewards.user_id
        and monitors.monitor_user_id = auth.uid()
        and monitors.accepted_at is not null
    )
  );

-- Notifications: monitors can read for users they monitor
create policy "Monitors read monitored user notifications"
  on notifications for select
  using (
    exists (
      select 1 from monitors
      where monitors.user_id = notifications.user_id
        and monitors.monitor_user_id = auth.uid()
        and monitors.accepted_at is not null
    )
  );
