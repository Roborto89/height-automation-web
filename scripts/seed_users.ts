import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const users = [
  {
    email: 'joshsmith@heightautomation.com',
    password: 'Welcome1!',
    name: 'Josh Smith',
    role: 'ADMIN'
  },
  {
    email: 'Shanehumphries@heightautomation.com',
    password: 'ChangeMe123!',
    name: 'Shane Humphries',
    role: 'EMPLOYEE'
  },
  {
    email: 'justinmicallef@heightautomation.com',
    password: 'ChangeMe123!',
    name: 'Justin Micallef',
    role: 'EMPLOYEE'
  },
  {
    email: 'baylinwehmeir@heightautomation.com',
    password: 'ChangeMe123!',
    name: 'Baylin Wehmeir',
    role: 'EMPLOYEE'
  }
];

async function seedUsers() {
  console.log('🚀 Starting user seeding...');

  for (const user of users) {
    console.log(`\nProcessing user: ${user.email}`);

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { name: user.name }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log(`⚠️ User ${user.email} already exists in Auth.`);
        // Try to update the password anyway if it's the admin
        if (user.email === 'joshsmith@heightautomation.com') {
          console.log(`🔄 Updating admin password to Welcome1!...`);
          const { data: existingUser } = await supabase.auth.admin.listUsers();
          const target = existingUser.users.find(u => u.email === user.email);
          if (target) {
            await supabase.auth.admin.updateUserById(target.id, { password: user.password });
          }
        }
      } else {
        console.error(`❌ Error creating auth user: ${authError.message}`);
        continue;
      }
    } else {
      console.log(`✅ Auth user created: ${authData.user.id}`);
    }

    // 2. Double check profile creation (the trigger might have handled it, but let's be sure)
    // We'll fetch the user again to get their ID if we skipped creation
    const { data: listData } = await supabase.auth.admin.listUsers();
    const currentUser = listData.users.find(u => u.email === user.email);

    if (currentUser) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          email: user.email,
          name: user.name,
          role: user.role,
          must_change_password: true,
          active: true
        })
        .select()
        .single();

      if (profileError) {
        console.error(`❌ Error updating profile: ${profileError.message}`);
      } else {
        console.log(`✨ Profile synchronized for ${user.email}`);
      }
    }
  }

  console.log('\n🏁 Seeding complete!');
}

seedUsers().catch(err => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
