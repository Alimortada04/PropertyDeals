-- COMPLETE SUPABASE AUTH DIAGNOSTIC & REPAIR SCRIPT
-- Run this step-by-step in your Supabase SQL Editor

-- STEP 1: Identify all triggers on auth.users
SELECT 
    'TRIGGER FOUND:' as type,
    trigger_name, 
    action_statement,
    event_manipulation,
    action_timing
FROM information_schema.triggers
WHERE event_object_table = 'users' AND event_object_schema = 'auth';

-- STEP 2: Find functions that reference 'profiles' (likely broken)
SELECT 
    'FUNCTION FOUND:' as type,
    routine_name, 
    LEFT(routine_definition, 200) as definition_preview
FROM information_schema.routines
WHERE routine_definition ILIKE '%profiles%'
AND routine_schema = 'public';

-- STEP 3: Alternative function search
SELECT 
    'FUNCTION FOUND (ALT):' as type,
    proname as function_name,
    LEFT(prosrc, 200) as source_preview
FROM pg_proc
WHERE prosrc ILIKE '%profile%'
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- STEP 4: Drop all potentially broken triggers
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP TRIGGER IF EXISTS create_user_profile ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;

-- STEP 5: Drop all potentially broken functions
DROP FUNCTION IF EXISTS public.create_profile CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.create_user_profile CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_profile CASCADE;

-- STEP 6: Verify buyer_profile table structure
SELECT 
    'COLUMN:' as type,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'buyer_profile' AND table_schema = 'public'
ORDER BY ordinal_position;

-- STEP 7: Create new working function for buyer_profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into buyer_profile with minimal required fields
  INSERT INTO public.buyer_profile (
    id,
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
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'buyer',
    'active',
    true,
    25
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail user creation
  RAISE WARNING 'Failed to create buyer profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 8: Create new working trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- STEP 9: Verify the new trigger was created
SELECT 
    'NEW TRIGGER:' as type,
    trigger_name, 
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE event_object_table = 'users' 
AND event_object_schema = 'auth'
AND trigger_name = 'on_auth_user_created';

-- STEP 10: Test message
SELECT 'REPAIR COMPLETE - Try registration now' as status;