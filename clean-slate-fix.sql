-- CLEAN SLATE SUPABASE AUTH FIX
-- Run this entire script in your Supabase SQL Editor

-- STEP 1: DROP ALL BROKEN TRIGGERS
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP TRIGGER IF EXISTS create_user_profile ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- STEP 2: DROP ALL BROKEN FUNCTIONS
DROP FUNCTION IF EXISTS create_profile;
DROP FUNCTION IF EXISTS create_user_profile;
DROP FUNCTION IF EXISTS handle_new_user;

-- STEP 3: CREATE CLEAN WORKING FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.buyer_profile (id, email, full_name, username)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'username'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 4: CREATE CLEAN WORKING TRIGGER
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- STEP 5: ENABLE RLS AND CREATE INSERT POLICY
ALTER TABLE public.buyer_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert if user is owner"
ON public.buyer_profile
FOR INSERT
WITH CHECK (auth.uid() = id);

-- STEP 6: VERIFICATION
SELECT 'SUCCESS: Clean setup complete' as status;