// Test script to debug Supabase registration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRegistration() {
  console.log('Testing Supabase registration...');
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test-' + Date.now() + '@example.com',
      password: 'TestPassword123!',
      options: {
        data: {
          full_name: 'Test User',
          username: 'testuser' + Date.now()
        }
      }
    });

    if (error) {
      console.error('Registration error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('Registration successful:', data);
    }
  } catch (err) {
    console.error('Caught exception:', err);
  }
}

testRegistration();