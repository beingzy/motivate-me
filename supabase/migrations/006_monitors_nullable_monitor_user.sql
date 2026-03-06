-- Allow monitor_user_id to be null for pending invites.
-- The unique constraint on (user_id, monitor_user_id) prevented creating
-- multiple invites because the placeholder value was always the same.
-- With nullable monitor_user_id, NULL values don't violate unique constraints.

ALTER TABLE monitors ALTER COLUMN monitor_user_id DROP NOT NULL;

-- Drop and recreate the unique constraint to exclude nulls
-- (PostgreSQL unique constraints already treat NULLs as distinct, so this works as-is)
