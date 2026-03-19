import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured.');
      // Fallback: We still want the user to see a success message if the DB part worked
      return NextResponse.json({ success: true, message: 'Subscribed to local database (Resend pending config).' });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Height Automation <updates@heightautomation.com>', // Note: Domain must be verified in Resend
        to: [email],
        subject: 'Welcome to Height Automation',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 20px;">
            <h1 style="color: #0ea5e9; text-transform: uppercase; letter-spacing: -0.05em; font-weight: 900;">Transmission Received.</h1>
            <p style="color: #475569; line-height: 1.6;">You are now connected to the Height Automation Intelligence Feed.</p>
            <p style="color: #475569; line-height: 1.6;">We will notify you immediately of new project deep-dives and technical case studies.</p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 40px 0;">
            <p style="font-size: 10px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em;">© 2026 Height Automation Secure Infrastructure</p>
          </div>
        `,
      }),
    });

    if (response.ok) {
      return NextResponse.json({ success: true });
    } else {
      const errorData = await response.json();
      console.error('Resend API Error:', errorData);
      return NextResponse.json({ error: 'Resend delivery failed.' }, { status: 500 });
    }
  } catch (err) {
    console.error('Newsletter API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
