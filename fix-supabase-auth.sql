-- Fix Supabase Auth Registration Issues
-- Run this script in your Supabase SQL Editor

-- Step 1: List all triggers on auth.users (for debugging)
SELECT 
    trigger_name, 
    action_statement,
    event_manipulation,
    action_timing
FROM information_schema.triggers
WHERE event_object_table = 'users' AND event_object_schema = 'auth';

-- Step 2: Drop common broken triggers that reference 'profiles' table
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP TRIGGER IF EXISTS create_user_profile ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;

-- Step 3: Drop broken functions that try to insert into 'profiles'
DROP FUNCTION IF EXISTS public.create_profile;
DROP FUNCTION IF EXISTS public.handle_new_user;
DROP FUNCTION IF EXISTS public.create_user_profile;

-- Step 4: Create new working function for buyer_profiles (note: plural table name)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.buyer_profiles (
    id,
    user_id, 
    email,
    full_name,
    username,
    user_type,
    status,
    is_public,
    profile_completion_score
  )
  VALUES (
    NEW.id,
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'buyer',
    'active',
    true,
    25
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create new working trigger for buyer_profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Test the fix by checking if triggers are properly set
SELECT 
    trigger_name, 
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE event_object_table = 'users' AND event_object_schema = 'auth';