-- NutriAI Supabase Schema & Row Level Security (RLS)
-- Idempotent script: Poate fi rulat de oricate ori fara erori

-- 1. TABELA PROFILES (Profil utilizator & tinte calorice)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  age INT NOT NULL CHECK (age BETWEEN 10 AND 120),
  height_cm INT NOT NULL CHECK (height_cm BETWEEN 100 AND 250),
  weight_kg NUMERIC NOT NULL CHECK (weight_kg BETWEEN 30 AND 300),
  activity_level TEXT NOT NULL,
  goal TEXT NOT NULL CHECK (goal IN ('cut', 'maintain', 'bulk')),
  calorie_target INT NOT NULL,
  protein_target INT NOT NULL,
  carbs_target INT NOT NULL,
  fat_target INT NOT NULL,
  appliances TEXT[] DEFAULT '{}',
  dietary_restrictions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view and update their own profile" ON public.profiles;
CREATE POLICY "Users can view and update their own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id);

-- 2. TABELA DAILY LOGS (Mese logate zilnic)
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_category TEXT NOT NULL CHECK (meal_category IN ('breakfast', 'lunch', 'dinner', 'snack')),
  title TEXT NOT NULL,
  calories INT NOT NULL,
  protein NUMERIC NOT NULL,
  carbs NUMERIC NOT NULL,
  fat NUMERIC NOT NULL,
  servings INT NOT NULL DEFAULT 1,
  recipe_payload JSONB,
  source TEXT NOT NULL CHECK (source IN ('swipe', 'quick_ai', 'manual')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own daily logs" ON public.daily_logs;
CREATE POLICY "Users can manage their own daily logs"
  ON public.daily_logs FOR ALL
  USING (auth.uid() = user_id);

-- 3. TABELA ADAPTIVE FAVORITES (Finaliste salvate din Showdown)
CREATE TABLE IF NOT EXISTS public.adaptive_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id TEXT NOT NULL,
  recipe_data JSONB NOT NULL,
  times_suggested INT DEFAULT 1,
  times_selected INT DEFAULT 0,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.adaptive_favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their adaptive favorites" ON public.adaptive_favorites;
CREATE POLICY "Users can manage their adaptive favorites"
  ON public.adaptive_favorites FOR ALL
  USING (auth.uid() = user_id);
