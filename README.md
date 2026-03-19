# Height Automation: Mission Control

This is the unified web platform for **Height Automation LLC**, integrating the public marketing site, project gallery, and internal business tools (Timekeeper & Quote System).

## 🚀 Technology Stack
- **Framework**: Next.js 15 (App Router / Turbopack)
- **Styling**: Tailwind CSS 4 (Custom Glassmorphism Design System)
- **Database**: Hybrid PostgreSQL (Supabase) + LocalStorage Fallback
- **Icons**: Lucide-React

## 🛡 Hybrid Data Architecture
This platform uses a custom data bridge ([database.ts](src/lib/database.ts)) to provide resilience:
- **LocalStorage Mode**: Default for local development and testing.
- **Supabase Mode**: Activated automatically when `NEXT_PUBLIC_SUPABASE_URL` is detected in the environment.

## 📦 Deployment
The platform is optimized for deployment on **Vercel**.

### Environment Variables
To enable cloud synchronization, add the following to your deployment:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase projeto URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous API key.

## 🛠 Internal Portal
Access the administration suite at `/internal`.
- **Admin Login**: `admin@heightauto.com`
- **Default Password**: (Stored in your secure vault)

---
© 2026 Height Automation LLC. Precision Engineered.
