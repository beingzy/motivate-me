-- RPC to accept a monitor invite, bypassing RLS since the accepting user
-- is not yet user_id or monitor_user_id on the row.
CREATE OR REPLACE FUNCTION public.accept_monitor_invite(invite_token_param text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  row_id uuid;
  row_user_id uuid;
BEGIN
  -- Find pending invite
  SELECT id, user_id INTO row_id, row_user_id
  FROM monitors
  WHERE invite_token = invite_token_param
    AND accepted_at IS NULL
  LIMIT 1;

  IF row_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired invite link');
  END IF;

  IF row_user_id = auth.uid() THEN
    RETURN jsonb_build_object('success', false, 'error', 'You cannot monitor yourself');
  END IF;

  -- Accept: set monitor_user_id to the caller, clear token, stamp accepted_at
  UPDATE monitors
  SET monitor_user_id = auth.uid(),
      accepted_at = now(),
      invite_token = NULL
  WHERE id = row_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION public.accept_monitor_invite(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.accept_monitor_invite(text) TO authenticated;
