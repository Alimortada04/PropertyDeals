-- FINAL SUPABASE AUTH REPAIR SCRIPT
-- Copy and paste this entire script into your Supabase SQL Editor and run it

-- STEP 1: Diagnostic - Find all triggers on auth.users
SELECT 
    trigger_name, 
    action_statement,
    'Found trigger that may be broken' as status
FROM information_schema.triggers
WHERE event_object_table = 'users' AND event_object_schema = 'auth';

-- STEP 2: Diagnostic - Find functions referencing 'profiles' table
SELECT 
    routine_name, 
    'Found function that may reference wrong table' as status
FROM information_schema.routines
WHERE routine_definition ILIKE '%profiles%'
AND routine_schema = 'public';

-- STEP 3: Drop all potentially broken triggers
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP TRIGGER IF EXISTS create_user_profile ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;

-- STEP 4: Drop all potentially broken functions
DROP FUNCTION IF EXISTS public.create_profile CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.create_user_profile CASCADE;

-- STEP 5: Create new working function for buyer_profile table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
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
  -- Don't fail user creation if profile creation fails
  RAISE WARNING 'Failed to create buyer profile: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 6: Create new working trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- STEP 7: Verify repair was successful
SELECT 
    'SUCCESS: New trigger created' as status,
    trigger_name
FROM information_schema.triggers
WHERE event_object_table = 'users' 
AND event_object_schema = 'auth'
AND trigger_name = 'on_auth_user_created';

-- STEP 8: Enable RLS on buyer_profile if needed
ALTER TABLE buyer_profile ENABLE ROW LEVEL SECURITY;

-- STEP 9: Create RLS policy for buyer_profile
DROP POLICY IF EXISTS "Users can insert own profile" ON buyer_profile;
CREATE POLICY "Users can insert own profile" 
ON buyer_profile FOR INSERT 
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own profile" ON buyer_profile;
CREATE POLICY "Users can view own profile" 
ON buyer_profile FOR SELECT 
USING (auth.uid() = id);

-- STEP 10: Final status
SELECT 'REPAIR COMPLETE - Try user registration now' as final_status;