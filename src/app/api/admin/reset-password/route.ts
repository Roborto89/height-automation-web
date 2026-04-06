import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // 1. Create Admin client for sensitive Auth operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // 2. Identify and Authenticate the requester
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: requester }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !requester) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 });
    }

    // 3. Verify Admin Role in the profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', requester.id)
      .single();

    if (profileError || profile?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // 4. Parse the target update details
    const { targetUserId, newPassword } = await req.json();

    if (!targetUserId || !newPassword) {
      return NextResponse.json({ error: 'Missing target ID or password' }, { status: 400 });
    }

    // 5. Update Target User's password in Supabase Auth
    const { error: resetError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUserId,
      { password: newPassword }
    );

    if (resetError) {
      console.error('Password reset failure:', resetError);
      return NextResponse.json({ error: 'Reset failed: ' + resetError.message }, { status: 500 });
    }

    // 6. Force "Must Change Password" for the next login
    const { error: dbError } = await supabaseAdmin
      .from('profiles')
      .update({ must_change_password: true })
      .eq('id', targetUserId);

    if (dbError) {
      console.error('DB Update Failure:', dbError);
    }

    return NextResponse.json({ success: true, message: 'Password updated and reset flag enforced' });
  } catch (err) {
    console.error('Admin API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
