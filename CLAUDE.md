@AGENTS.md

## Project Structure
- `frontend/` — Next.js 16 (Vercel)
- `backend/` — NestJS + Prisma + PostgreSQL

## Backend
- NestJS on port 3001
- DB: PostgreSQL `segurosimples` (local: `postgresql://edu@localhost:5432/segurosimples`)
- Prisma migrations in `backend/prisma/migrations/`
- Seed: `cd backend && npx ts-node prisma/seed.ts`
- Build: `cd backend && npm run build`
- Dev: `cd backend && npm run start:dev`

## Frontend
- Vercel root directory: `frontend/`
- Env: `NEXT_PUBLIC_API_URL` points to backend (empty = use local /api/chat fallback)

## Admin
- Login: admin@segurosimples.com.br / admin123
- Admin panel: /admin/leads

## Deploy (planned)
- Backend: EasyPanel Docker on Hostinger
- Frontend: Vercel (auto-deploy)
