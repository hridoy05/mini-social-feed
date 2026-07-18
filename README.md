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

**Mobile:** Expo, Expo Router, React Native, TypeScript, Axios, Firebase Messaging

## Local Setup

### Backend

```bash
cd backend
npm install
npm run db:up             # start Postgres (Docker)
cp .env.example .env       # then set JWT_SECRET (see below)
npm run prisma:migrate     # apply DB migrations (required after clone)
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

## Firebase Credentials

Not committed to git (gitignored, contain secrets). Needed only for push notifications — app runs fine without them.

| File                              | Location   | Get it from                                              |
|------------------------------------|------------|-----------------------------------------------------------|
| `serviceAccountKey.json`           | `backend/` | Firebase Console → Project Settings → Service Accounts → Generate new private key |
| `google-services.json`             | `mobile/`  | Firebase Console → Project Settings → your Android app → download config file |

Missing `serviceAccountKey.json` → backend logs a warning and disables push notifications, everything else still works.

## Rate Limiting

`/api/v1/auth/*` routes: 20 requests / 15 min / IP → `429 TooManyRequestsError`.

## Improvements

- Unit + integration tests
- Structured logger (e.g. Pino/Winston) instead of `morgan`
- Sentry for error tracing
- Uptime/metrics monitoring
- 
## Screenshots
<p>
  <img width="200" alt="Screenshot_20260718_191638_host_exp_exponent_ExperienceActivity" src="https://github.com/user-attachments/assets/412720a9-eac1-48ae-b5ec-3766b439ea3d" />
  
  <img width="200" alt="Screenshot_20260718_191631_host_exp_exponent_ExperienceActivity" src="https://github.com/user-attachments/assets/43f5a559-6b14-486a-8e79-013d37560fcb" />

<img width="200" alt="Screenshot_20260718_191553_host_exp_exponent_ExperienceActivity" src="https://github.com/user-attachments/assets/69a552e6-f82e-4149-a473-0242585db1a1" />

<img width="200" alt="Screenshot_20260718_191546_host_exp_exponent_ExperienceActivity" src="https://github.com/user-attachments/assets/ad2a2572-5a1d-42cb-bc85-ee4da927d93a" />

<img width="200" alt="Screenshot_20260718_191616_host_exp_exponent_ExperienceActivity" src="https://github.com/user-attachments/assets/436bbb20-617c-46da-87c2-3a67b22a5566" />

<p/>

