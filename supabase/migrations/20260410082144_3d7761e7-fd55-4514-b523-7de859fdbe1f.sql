-- Create enum for application tracks
CREATE TYPE public.application_track AS ENUM ('innovation_entrepreneurship', 'ai_innovation');

-- Add track column to applications
ALTER TABLE public.applications ADD COLUMN track public.application_track DEFAULT NULL;