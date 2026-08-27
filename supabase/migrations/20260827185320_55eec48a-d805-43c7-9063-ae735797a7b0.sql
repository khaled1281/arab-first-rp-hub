CREATE TABLE public.site_stats (
  id INT PRIMARY KEY DEFAULT 1,
  visits BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT site_stats_single_row CHECK (id = 1)
);

GRANT SELECT ON public.site_stats TO anon, authenticated;
GRANT ALL ON public.site_stats TO service_role;

ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site stats"
  ON public.site_stats FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO public.site_stats (id, visits) VALUES (1, 0);

CREATE OR REPLACE FUNCTION public.increment_site_visit()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  UPDATE public.site_stats
     SET visits = visits + 1, updated_at = now()
   WHERE id = 1
  RETURNING visits INTO new_count;
  RETURN new_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_site_visit() TO anon, authenticated;