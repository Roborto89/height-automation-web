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
    
    // Temporal Anchors
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);
    const endOfNextWeek = new Date(today);
    endOfNextWeek.setDate(today.getDate() + 14);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ error: 'Resend API Key Missing' }, { status: 500 });
    }

    const results = [];

    for (const user of users) {
      if (!user.active || !user.email) continue;

      // Filter tasks assigned to this user that are NOT YET VERIFIED
      const userTasks = events.filter(event => 
        event.assignedTo === user.id && event.status !== 'VERIFIED'
      );

      if (userTasks.length === 0) continue;

      // Categorization Engine
      const categorized = {
        overdue: userTasks.filter(t => new Date(t.startDate) < today),
        thisWeek: userTasks.filter(t => {
          const d = new Date(t.startDate);
          return d >= today && d < endOfWeek;
        }),
        nextWeek: userTasks.filter(t => {
          const d = new Date(t.startDate);
          return d >= endOfWeek && d < endOfNextWeek;
        }),
        thisMonth: userTasks.filter(t => {
          const d = new Date(t.startDate);
          return d >= endOfNextWeek && d <= endOfMonth;
        }),
        nextMonth: userTasks.filter(t => {
          const d = new Date(t.startDate);
          return d > endOfMonth && d <= endOfNextMonth;
        })
      };

      const renderSection = (title: string, tasks: any[], color: string) => {
        if (tasks.length === 0) return '';
        return `
          <div style="margin-top: 30px;">
            <h4 style="color: ${color}; font-size: 10px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; border-bottom: 1px solid #1e293b; padding-bottom: 5px; margin-bottom: 15px;">${title}</h4>
            ${tasks.map(task => `
              <div style="margin-bottom: 15px; padding: 12px; border: 1px solid #1e293b; border-left: 3px solid ${color}; border-radius: 8px; background: rgba(255,255,255,0.02);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div style="flex: 1;">
                    <h3 style="margin: 0; font-size: 15px; color: #f1f5f9;">${task.title}</h3>
                    <p style="margin: 5px 0 0 0; font-size: 11px; color: #64748b;">${new Date(task.startDate).toLocaleDateString()} // ${task.type}</p>
                  </div>
                  ${task.status === 'COMPLETED' ? '<span style="font-size: 8px; font-weight: 900; padding: 2px 6px; background: #0ea5e9; color: #020617; border-radius: 4px; text-transform: uppercase;">Awaiting Review</span>' : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `;
      };

      // Compile Briefing HTML
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #020617; color: #f8fafc; padding: 40px; border-radius: 24px; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 40px;">
            <p style="color: #64748b; font-size: 10px; font-weight: 900; letter-spacing: 0.4em; text-transform: uppercase; margin-bottom: 10px;">Height Automation Terminal</p>
            <h2 style="color: #f8fafc; font-size: 32px; font-weight: 900; letter-spacing: -0.04em; text-transform: uppercase; margin: 0;">Morning Briefing</h2>
            <p style="color: #0ea5e9; font-size: 12px; font-weight: 600; margin-top: 5px;">${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          
          <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">Hello <b>${user.name}</b>, your strategic operational radar for today:</p>

          ${renderSection('⚠️ Critical Overdue', categorized.overdue, '#f43f5e')}
          ${renderSection('📡 Active Targets (This Week)', categorized.thisWeek, '#0ea5e9')}
          ${renderSection('📅 Upcoming Protocol (Next Week)', categorized.nextWeek, '#6366f1')}
          ${renderSection('📊 Horizon (This Month)', categorized.thisMonth, '#94a3b8')}
          ${renderSection('🔭 Strategic View (Next Month)', categorized.nextMonth, '#475569')}

          <div style="margin-top: 50px; text-align: center; border-top: 1px solid #1e293b; padding-top: 30px;">
            <a href="https://heightautomation.com/internal" style="display: inline-block; background: #f8fafc; color: #020617; padding: 14px 32px; border-radius: 12px; font-weight: 900; text-decoration: none; text-transform: uppercase; font-size: 11px; letter-spacing: 0.15em; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);">Access Operations Terminal</a>
          </div>

          <p style="margin-top: 50px; font-size: 9px; color: #334155; text-align: center; letter-spacing: 0.05em;">
            ENCRYPTED TRANSMISSION // FOR INTERNAL PERSONNEL ONLY // © 2026 HEIGHT AUTOMATION LLC
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
          from: 'onboarding@resend.dev',
          to: user.email,
          subject: categorized.overdue.length > 0 
            ? `⚠️ CRITICAL: ${categorized.overdue.length} Overdue Tasks - Morning Briefing`
            : `Morning Briefing: ${userTasks.length} Active Targets`,
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
