# Supabase Migrations

This folder contains database migrations for the Supabase project. These SQL files help set up and maintain the database schema, triggers, and policies.

## Migration Files

- `20250506_create_profiles_triggers.sql`: Sets up the profiles table with triggers for automatic profile creation when users register.

## How to Apply Migrations

### Using Supabase CLI

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Link your project (if not already linked):
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. Apply migrations:
   ```bash
   supabase db push
   ```

### Using Supabase SQL Editor

1. Navigate to the Supabase dashboard for your project.
2. Go to the SQL Editor.
3. Copy and paste the SQL from the migration file.
4. Execute the SQL.

## What This Sets Up

- A `profiles` table that mirrors users in the `auth.users` table
- Automatic creation of profile records when users register
- Automatic updates to profiles when user information changes
- Row Level Security (RLS) policies to ensure users can only see and edit their own profiles

## Testing

After applying the migrations, test the setup by:

1. Registering a new user through your application
2. Verifying that a corresponding profile was created in the `profiles` table
3. Testing that users can only see and edit their own profiles