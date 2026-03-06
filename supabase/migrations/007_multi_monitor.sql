-- Add monitor_email to monitors table for display
ALTER TABLE monitors ADD COLUMN IF NOT EXISTS monitor_email text;

-- Add approver_monitor_ids to habits table
ALTER TABLE habits ADD COLUMN IF NOT EXISTS approver_monitor_ids text[];

-- Update accept_monitor_invite RPC to store acceptor's email
CREATE OR REPLACE FUNCTION public.accept_monitor_invite(invite_token_param text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  row_id uuid;
  row_user_id uuid;
  acceptor_email text;
BEGIN
  SELECT id, user_id INTO row_id, row_user_id FROM monitors
  WHERE invite_token = invite_token_param AND accepted_at IS NULL LIMIT 1;

  IF row_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired invite link');
  END IF;

  IF row_user_id = auth.uid() THEN
    RETURN jsonb_build_object('success', false, 'error', 'You cannot monitor yourself');
  END IF;

  -- Get acceptor's email from auth
  SELECT email INTO acceptor_email FROM auth.users WHERE id = auth.uid();

  UPDATE monitors
  SET monitor_user_id = auth.uid(),
      monitor_email = acceptor_email,
      accepted_at = now(),
      invite_token = NULL
  WHERE id = row_id;

  RETURN jsonb_build_object('success', true);
END;
$$;
