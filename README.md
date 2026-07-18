# Mini Social Feed

## Live API

```
https://mini-social-feed.onrender.com/api/v1
```

Already deployed — no local backend/database setup needed. Just point mobile at it:

```bash
# mobile/.env
EXPO_PUBLIC_API_URL=https://mini-social-feed.onrender.com/api/v1
```

## API Docs

- [Auth](./api-docs/auth.md)
- [Posts](./api-docs/posts.md)
- [Interactions](./api-docs/interactions.md)

## Architecture

```
┌────────────┐        HTTPS/JSON        ┌────────────┐        SQL        ┌────────────┐
│   Mobile   │  ───────────────────▶   │   Backend   │  ───────────────▶  │  Postgres  │
│ (Expo RN)  │  ◀───────────────────   │ (Express)   │  ◀───────────────  │  (Prisma)  │
└────────────┘        JWT auth          └────────────┘                    └────────────┘
                                              │
                                              ▼
                                        Firebase (FCM)
                                       push notifications
```

## Features

- Signup / login with JWT auth
- Create posts, paginated feed (filter by username)
- Like / unlike posts
- Comment on posts
- Push notifications on like/comment (Firebase Cloud Messaging)
- Offline banner shown when device loses internet connection

## Tech Stack

**Backend:** Node, Express, TypeScript, Prisma, PostgreSQL, JWT, express-validator, express-rate-limit, Firebase Admin, Helmet

**Mobile:** Expo, React Native, TypeScript, Axios, Firebase Messaging

## Local Setup

### Backend

```bash
cd backend
npm install
npm run db:up          # start Postgres via Docker
cp .env.example .env    # then set JWT_SECRET (see below)
npm run dev
```

Server: http://localhost:5000/health

### Mobile

```bash
cd mobile
npm install
cp .env.example .env
npm start
```

## Env Vars (backend/.env)

| Var            | Description                          |
|-----------------|---------------------------------------|
| `PORT`          | Server port (default `5000`)          |
| `DATABASE_URL`  | Postgres connection string            |
| `JWT_SECRET`    | Signing secret, min 32 characters     |
| `JWT_EXPIRES`   | Token lifetime (default `7d`)         |
| `NODE_ENV`      | `development` / `production` / `test` |

Generate a valid `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Rate Limiting

`/api/v1/auth/*` routes: 20 requests / 15 min / IP → `429 TooManyRequestsError`.
