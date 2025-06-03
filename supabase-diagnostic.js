// Diagnostic script to identify and fix Supabase registration issues
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function diagnoseDatabaseIssues() {
  console.log('🔍 Diagnosing Supabase registration issues...');
  
  try {
    // 1. Check if auth schema is accessible
    console.log('\n1. Checking auth schema access...');
    const { data: authUsers, error: authError } = await supabaseAdmin
      .from('auth.users')
      .select('*')
      .limit(1);
    
    if (authError) {
      console.log('❌ Cannot access auth.users:', authError.message);
    } else {
      console.log('✅ Auth schema accessible');
    }

    // 2. Check public tables and RLS policies
    console.log('\n2. Checking public tables...');
    
    // Check users table
    const { data: publicUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.log('❌ Users table issue:', usersError.message);
    } else {
      console.log('✅ Users table accessible');
    }

    // Check seller_profile table
    const { data: sellerProfiles, error: sellerError } = await supabaseAdmin
      .from('seller_profile')
      .select('*')
      .limit(1);
    
    if (sellerError) {
      console.log('❌ Seller profile table issue:', sellerError.message);
    } else {
      console.log('✅ Seller profile table accessible');
    }

    // 3. Test user creation with admin client
    console.log('\n3. Testing user creation with admin client...');
    const testEmail = 'admin-test-' + Date.now() + '@example.com';
    
    const { data: adminSignupData, error: adminSignupError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin Test User'
      }
    });

    if (adminSignupError) {
      console.log('❌ Admin user creation failed:', adminSignupError.message);
    } else {
      console.log('✅ Admin user creation successful:', adminSignupData.user?.id);
      
      // Clean up test user
      if (adminSignupData.user) {
        await supabaseAdmin.auth.admin.deleteUser(adminSignupData.user.id);
        console.log('🧹 Test user cleaned up');
      }
    }

    // 4. Test regular signup (this should fail with the 500 error)
    console.log('\n4. Testing regular signup (should fail)...');
    const regularTestEmail = 'regular-test-' + Date.now() + '@example.com';
    
    const { data: regularSignupData, error: regularSignupError } = await supabaseAdmin.auth.signUp({
      email: regularTestEmail,
      password: 'TestPassword123!',
      options: {
        data: {
          full_name: 'Regular Test User'
        }
      }
    });

    if (regularSignupError) {
      console.log('❌ Regular signup failed (expected):', regularSignupError.message);
      console.log('Error details:', JSON.stringify(regularSignupError, null, 2));
    } else {
      console.log('✅ Regular signup unexpectedly succeeded:', regularSignupData.user?.id);
    }

  } catch (error) {
    console.error('💥 Diagnostic error:', error);
  }
}

// Run diagnostics
diagnoseDatabaseIssues();