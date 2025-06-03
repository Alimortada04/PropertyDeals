-- HARD RESET SUPABASE AUTH - SURGICAL CLEANUP
-- Run this step-by-step in your Supabase SQL Editor

-- STEP 1: DISABLE RLS ON auth.users (critical for signup)
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- STEP 2: IDENTIFY ALL TRIGGERS ON auth.users
SELECT 
    'TRIGGER FOUND:' as type,
    trigger_name,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users' AND event_object_schema = 'auth';

-- STEP 3: DROP ALL TRIGGERS ON auth.users (comprehensive)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP TRIGGER IF EXISTS create_user_profile ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;
DROP TRIGGER IF EXISTS create_buyer_profile ON auth.users;
DROP TRIGGER IF EXISTS auto_create_profile ON auth.users;

-- STEP 4: DROP ALL RELATED FUNCTIONS (comprehensive)
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
DROP FUNCTION IF EXISTS create_profile CASCADE;
DROP FUNCTION IF EXISTS create_user_profile CASCADE;
DROP FUNCTION IF EXISTS handle_new_user_profile CASCADE;
DROP FUNCTION IF EXISTS create_buyer_profile CASCADE;
DROP FUNCTION IF EXISTS auto_create_profile CASCADE;

-- STEP 5: VERIFY CLEANUP
SELECT 
    'REMAINING TRIGGERS:' as status,
    trigger_name
FROM information_schema.triggers
WHERE event_object_table = 'users' AND event_object_schema = 'auth';

-- STEP 6: CHECK FOR BROKEN POLICIES ON auth.users
SELECT 
    'POLICY FOUND:' as type,
    policyname as policy_name,
    tablename
FROM pg_policies
WHERE schemaname = 'auth' AND tablename = 'users';

-- STEP 7: CLEAN SIGNUP TEST MESSAGE
SELECT 'HARD RESET COMPLETE - Test clean signup now (no triggers)' as status;
SELECT 'After successful test, check Auth Hooks in Supabase Dashboard' as next_step;