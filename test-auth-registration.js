// Test Supabase Auth registration with Service Role Key
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Test with both keys
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
const supabaseAnon = createClient(supabaseUrl, anonKey);

async function testRegistration() {
  console.log('Testing Supabase registration with different clients...');
  
  const testEmail = 'test-auth-' + Date.now() + '@example.com';
  console.log('Using email:', testEmail);

  // Test 1: Admin client with createUser
  console.log('\n1. Testing admin.createUser...');
  try {
    const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Test User'
      }
    });

    if (adminError) {
      console.log('❌ Admin createUser failed:', adminError.message);
    } else {
      console.log('✅ Admin createUser succeeded:', adminData.user?.id);
      
      // Clean up
      if (adminData.user) {
        await supabaseAdmin.auth.admin.deleteUser(adminData.user.id);
        console.log('🧹 Cleaned up admin test user');
      }
    }
  } catch (err) {
    console.log('💥 Admin createUser exception:', err.message);
  }

  // Test 2: Anonymous client signUp (this should reproduce the 500 error)
  console.log('\n2. Testing anonymous signUp...');
  const testEmail2 = 'test-anon-' + Date.now() + '@example.com';
  
  try {
    const { data: anonData, error: anonError } = await supabaseAnon.auth.signUp({
      email: testEmail2,
      password: 'TestPassword123!',
      options: {
        data: {
          full_name: 'Anonymous Test User'
        }
      }
    });

    if (anonError) {
      console.log('❌ Anonymous signUp failed:', anonError.message);
      console.log('Error details:', JSON.stringify(anonError, null, 2));
    } else {
      console.log('✅ Anonymous signUp succeeded:', anonData.user?.id);
    }
  } catch (err) {
    console.log('💥 Anonymous signUp exception:', err.message);
  }

  // Test 3: Check if auth.users table exists and is accessible
  console.log('\n3. Checking auth schema access...');
  try {
    const { data: authCheck, error: authError } = await supabaseAdmin
      .rpc('get_auth_users_count');
    
    if (authError) {
      console.log('❌ Cannot access auth schema:', authError.message);
    } else {
      console.log('✅ Auth schema accessible:', authCheck);
    }
  } catch (err) {
    console.log('💥 Auth schema check failed:', err.message);
  }
}

testRegistration();