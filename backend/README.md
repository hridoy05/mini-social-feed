# Mini Social Feed — Backend

Node + Express + TypeScript + Prisma + PostgreSQL.

## Prerequisites
- Node.js 20+
- Docker Desktop (for Postgres)

## Setup

```bash
# 1. Install deps
npm install

# 2. Start Postgres (docker)
npm run db:up

# 3. Copy env
cp .env.example .env

# 4. Run the server
npm run dev
```

Server: http://localhost:5000/health

## Useful Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server |
| `npm run db:up` | Start Postgres in Docker |
| `npm run db:down` | Stop Postgres container |
| `npm run db:logs` | Tail Postgres logs |
| `npx prisma studio` | Open DB GUI in browser |
| `npx prisma migrate dev --name <name>` | Create + apply a new migration |
| `npx prisma generate` | Regenerate Prisma client after schema change |
| `npx prisma migrate deploy` | Apply migrations in production |
| `npx prisma migrate reset` | Drop DB, re-run all migrations (dev only) |
