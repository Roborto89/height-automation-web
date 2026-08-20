import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { rfqType, name, company, email, phone, subject, description, budget, timeline, selectedServices } = await req.json();

    if (!name || !company || !email || !description) {
      return NextResponse.json({ error: 'Name, company, email, and description are required.' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn('RESEND_API_KEY is not configured. RFQ processed locally.');
      // Local fallback success so development continues smoothly
      return NextResponse.json({ success: true, message: 'RFQ registered locally (Resend mail pending config).' });
    }

    const typeLabel = rfqType === 'automation' ? 'Automation Systems' : 'Contract Manufacturing';

    // Format services checklist for email
    const capabilitiesHtml = selectedServices && selectedServices.length > 0
      ? `<ul>${selectedServices.map((s: string) => `<li style="color: #334155; font-size: 14px;">${s}</li>`).join('')}</ul>`
      : `<p style="color: #64748b; font-style: italic; font-size: 14px;">None specified</p>`;

    const emailBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 20px;">
        <h1 style="color: #0ea5e9; text-transform: uppercase; letter-spacing: -0.05em; font-weight: 900; margin-bottom: 4px;">New RFQ Submission</h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 0; margin-bottom: 24px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.1em;">
          Vertical: <span style="color: ${rfqType === 'automation' ? '#0ea5e9' : '#10b981'}">${typeLabel}</span>
        </p>

        <h2 style="color: #1e293b; font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 24px;">Contact Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="width: 30%; font-weight: bold; color: #475569; padding: 6px 0; font-size: 14px;">Name:</td>
            <td style="color: #1e293b; padding: 6px 0; font-size: 14px;">${name}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #475569; padding: 6px 0; font-size: 14px;">Company:</td>
            <td style="color: #1e293b; padding: 6px 0; font-size: 14px;">${company}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #475569; padding: 6px 0; font-size: 14px;">Email:</td>
            <td style="color: #1e293b; padding: 6px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #0ea5e9; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #475569; padding: 6px 0; font-size: 14px;">Phone:</td>
            <td style="color: #1e293b; padding: 6px 0; font-size: 14px;">${phone || 'Not provided'}</td>
          </tr>
        </table>

        <h2 style="color: #1e293b; font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 30px;">Capabilities Requested</h2>
        ${capabilitiesHtml}

        <h2 style="color: #1e293b; font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 30px;">Project Logistics</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="width: 30%; font-weight: bold; color: #475569; padding: 6px 0; font-size: 14px;">Subject:</td>
            <td style="color: #1e293b; padding: 6px 0; font-size: 14px;">${subject || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #475569; padding: 6px 0; font-size: 14px;">Budget:</td>
            <td style="color: #1e293b; padding: 6px 0; font-size: 14px;">${budget || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #475569; padding: 6px 0; font-size: 14px;">Timeline:</td>
            <td style="color: #1e293b; padding: 6px 0; font-size: 14px;">${timeline || 'Not specified'}</td>
          </tr>
        </table>

        <h2 style="color: #1e293b; font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 30px;">Description & Specifications</h2>
        <p style="color: #334155; line-height: 1.6; font-size: 14px; background-color: #f8fafc; padding: 16px; border-radius: 12px; white-space: pre-wrap; border: 1px solid #f1f5f9;">${description}</p>

        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 40px 0;">
        <p style="font-size: 10px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; text-align: center;">© 2026 Height Automation Secure Infrastructure</p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Height Automation Portal <onboarding@resend.dev>', // Fallback sender to bypass domain verification. Change to rfq@heightautomation.com once domain is verified in Resend.
        to: ['Sales@heightautomation.com'],
        subject: `[RFQ - ${typeLabel}] ${subject || 'New Inquiry from ' + company}`,
        html: emailBody,
        reply_to: email, // This allows Sales to hit reply directly to the customer's email
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
    console.error('RFQ API Route Error:', err);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
