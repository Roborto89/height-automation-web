import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

// 7:00 AM Daily Briefing Protocol
// This endpoint is triggered by Vercel Cron or a manual POST
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  
  // Security Check: Ensure only authorized triggers or crons can execute
  if (process.env.CRON_SECRET && key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized Protocol' }, { status: 401 });
  }

  try {
    const users = await db.getUsers();
    const events = await db.getCalendarEvents();
    
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ error: 'Resend API Key Missing' }, { status: 500 });
    }

    const results = [];

    for (const user of users) {
      if (!user.active || !user.email) continue;

      // Filter tasks assigned to this user that are upcoming (next 7 days) or due today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const userTasks = events.filter(event => {
        const eventDate = new Date(event.startDate);
        return event.assignedTo === user.id && eventDate >= today;
      });

      if (userTasks.length === 0) continue;

      // Compile Briefing HTML
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #020617; color: #f8fafc; padding: 40px; border-radius: 20px;">
          <h2 style="color: #0ea5e9; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase; margin-bottom: 5px;">Morning Briefing</h2>
          <p style="color: #64748b; font-size: 12px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase;">Height Automation Terminal</p>
          
          <div style="margin-top: 30px;">
            <p style="font-size: 16px; color: #94a3b8;">Good morning, <b>${user.name}</b>. You have <b>${userTasks.length}</b> mission-critical items on your radar for today and this week.</p>
          </div>

          <div style="margin-top: 40px; border-top: 1px solid #1e293b; padding-top: 20px;">
            ${userTasks.map(task => `
              <div style="margin-bottom: 25px; padding: 15px; border: 1px solid #334155; border-radius: 12px; background: rgba(14, 165, 233, 0.05);">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 10px; font-weight: 900; letter-spacing: 0.1em; color: ${task.type === 'MILESTONE' ? '#10b981' : task.type === 'DEADLINE' ? '#f43f5e' : '#0ea5e9'}">${task.type}</span>
                </div>
                <h3 style="margin: 10px 0 5px 0; font-size: 18px; color: #f1f5f9;">${task.title}</h3>
                <p style="margin: 0; font-size: 14px; color: #94a3b8;">Due: ${new Date(task.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                ${task.description ? `<p style="margin-top: 10px; font-size: 13px; color: #64748b; font-style: italic;">${task.description}</p>` : ''}
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 40px; text-align: center;">
            <a href="https://heightautomation.com/internal" style="display: inline-block; background: #0ea5e9; color: #020617; padding: 12px 24px; border-radius: 10px; font-weight: 900; text-decoration: none; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em;">Access Dashboard</a>
          </div>

          <p style="margin-top: 40px; font-size: 10px; color: #475569; text-align: center;">
            CONFIDENTIAL COMMUNICATIONS // HEIGHT AUTOMATION LLC // TERMINAL AUTO-GEN
          </p>
        </div>
      `;

      // Dispatch via Resend REST API
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`
        },
        body: JSON.stringify({
          from: 'Operations Terminal <terminal@heightautomation.com>',
          to: user.email,
          subject: `Morning Briefing: ${userTasks.length} Assigned Tasks`,
          html: html
        })
      });

      results.push({ user: user.email, status: res.status });
    }

    return NextResponse.json({ success: true, dispatches: results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
