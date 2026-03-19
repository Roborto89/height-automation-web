import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing environment variables for storage API.");
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // Create backend client dynamically to prevent build-time crashes if keys are absent
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const type = formData.get('type') as string;
    let url = formData.get('url') as string;

    if (!title || !category || !type) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    // 1. Handle File Upload if present
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      const { data, error: uploadError } = await supabaseAdmin.storage
        .from('media')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        return NextResponse.json({ error: 'Failed to upload to storage' }, { status: 500 });
      }

      const { data: { publicUrl } } = supabaseAdmin.storage.from('media').getPublicUrl(fileName);
      url = publicUrl;
    }

    if (!url) {
      return NextResponse.json({ error: 'No URL or file provided' }, { status: 400 });
    }

    // 2. Insert into Database using Service Role (Bypass RLS)
    const { data: mediaData, error: dbError } = await supabaseAdmin
      .from('media_assets')
      .insert([{ title, category, type, url }])
      .select()
      .single();

    if (dbError) {
      console.error("Database insertion error:", dbError);
      return NextResponse.json({ error: 'Failed to save to database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, part: mediaData });
  } catch (err) {
    console.error("Upload API error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
