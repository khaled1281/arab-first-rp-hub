CREATE TABLE public.verify_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discord_id TEXT NOT NULL,
  discord_username TEXT NOT NULL,
  code TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  used BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX verify_codes_discord_id_idx ON public.verify_codes (discord_id);
GRANT ALL ON public.verify_codes TO service_role;
ALTER TABLE public.verify_codes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.verify_sessions (
  token TEXT NOT NULL PRIMARY KEY,
  discord_id TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT ALL ON public.verify_sessions TO service_role;
ALTER TABLE public.verify_sessions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.activation_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discord_id TEXT NOT NULL,
  discord_username TEXT NOT NULL,
  discord_display_name TEXT,
  discord_avatar_url TEXT,
  discord_created_at TIMESTAMP WITH TIME ZONE,
  real_name TEXT NOT NULL,
  real_age INTEGER NOT NULL,
  roblox_username TEXT NOT NULL,
  roblox_id TEXT,
  roblox_created_at TIMESTAMP WITH TIME ZONE,
  roblox_avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  decided_by TEXT,
  decided_by_username TEXT,
  decided_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX activation_applications_status_idx ON public.activation_applications (status);
CREATE UNIQUE INDEX activation_applications_one_pending_idx ON public.activation_applications (discord_id) WHERE status = 'pending';
GRANT ALL ON public.activation_applications TO service_role;
ALTER TABLE public.activation_applications ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER update_activation_applications_updated_at BEFORE UPDATE ON public.activation_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();