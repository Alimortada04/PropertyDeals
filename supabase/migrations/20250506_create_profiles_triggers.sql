-- First, check if profiles table exists, create it if not
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  role TEXT DEFAULT 'user',
  onboarding_status TEXT DEFAULT 'incomplete',
  avatar_url TEXT
);

-- Create update timestamp trigger function if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE OR REPLACE FUNCTION public.update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END $$;

-- Apply updated_at trigger to profiles table
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create handle_new_user() function if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') THEN
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, email, full_name, created_at)
      VALUES (
        NEW.id,
        NEW.email,
        -- Extract name from email or use default 'New User' if not available
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.created_at
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  END IF;
END $$;

-- Create update_user_profile() function if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_user_profile') THEN
    CREATE OR REPLACE FUNCTION public.update_user_profile()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE public.profiles
      SET email = NEW.email,
          -- Only update full_name if it's present in metadata
          full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name)
      WHERE id = NEW.id;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  END IF;
END $$;

-- Drop existing triggers if they exist (to avoid errors when re-running the script)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Create trigger for user updates
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE OF email, raw_user_meta_data ON auth.users
FOR EACH ROW
WHEN (OLD.email IS DISTINCT FROM NEW.email OR OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data)
EXECUTE FUNCTION public.update_user_profile();

-- Enable Row Level Security on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing RLS policies
DROP POLICY IF EXISTS users_can_read_own_profile ON public.profiles;
DROP POLICY IF EXISTS users_can_update_own_profile ON public.profiles;

-- Create RLS policies for profiles table
-- Allow users to read their own profile
CREATE POLICY users_can_read_own_profile ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY users_can_update_own_profile ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Grant necessary permissions to authenticated users
GRANT SELECT, UPDATE ON public.profiles TO authenticated;