-- ============================================================
-- Prompt Dairy — Migration 002: Challenge Progress Table
-- Run this in Supabase SQL Editor after 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- 1. CHALLENGE PROGRESS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.challenge_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    score INT DEFAULT 0,
    submitted_prompt TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, challenge_id)
);

-- ============================================================
-- 2. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_challenge_progress_user ON public.challenge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_progress_challenge ON public.challenge_progress(challenge_id);

-- ============================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.challenge_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own challenge progress
CREATE POLICY "Users can view own challenge progress"
    ON public.challenge_progress FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own challenge progress
CREATE POLICY "Users can insert own challenge progress"
    ON public.challenge_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own challenge progress
CREATE POLICY "Users can update own challenge progress"
    ON public.challenge_progress FOR UPDATE
    USING (auth.uid() = user_id);
