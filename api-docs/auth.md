# Auth API

Base path: `/api/v1/auth`

All endpoints in this group are subject to a rate limit of 20 requests / 15 minutes / IP. Exceeding it returns `429 TooManyRequestsError`.

---

## Signup

Create a new user account and receive an auth token.

```
POST /api/v1/auth/signup
```

### Request body

| Field      | Type   | Required | Rules                                                    |
|------------|--------|----------|-----------------------------------------------------------|
| `username` | string | yes      | 3–30 characters, letters/numbers/underscore only           |
| `email`    | string | yes      | Valid email address                                        |
| `password` | string | yes      | Minimum 6 characters                                       |

```json
{
  "username": "hridoy05",
  "email": "hridoy.banik71@gmail.com",
  "password": "supersecret"
}
```

### Success response

`201 Created`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "b3f1c2b0-4b1a-4e9e-9c1a-2e6b2a9f6a11",
    "username": "hridoy05",
    "email": "hridoy.banik71@gmail.com"
  }
}
```

### Error responses

| Status | `error`          | Cause                                          |
|--------|------------------|--------------------------------------------------|
| 422    | `ValidationError` | Username/email/password fails validation rules   |
| 409    | `ConflictError`   | Email already in use — `"Email already in use"`  |
| 409    | `ConflictError`   | Username already taken — `"Username already taken"` |
| 429    | `TooManyRequestsError` | Rate limit exceeded                         |

```json
{
  "error": "ConflictError",
  "message": "Email already in use"
}
```

---

## Login

Authenticate an existing user and receive an auth token.

```
POST /api/v1/auth/login
```

### Request body

| Field      | Type   | Required | Rules                |
|------------|--------|----------|------------------------|
| `email`    | string | yes      | Valid email address    |
| `password` | string | yes      | Non-empty              |

```json
{
  "email": "hridoy.banik71@gmail.com",
  "password": "supersecret"
}
```

### Success response

`200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "b3f1c2b0-4b1a-4e9e-9c1a-2e6b2a9f6a11",
    "username": "hridoy05",
    "email": "hridoy.banik71@gmail.com"
  }
}
```

### Error responses

| Status | `error`            | Cause                                     |
|--------|--------------------|--------------------------------------------|
| 422    | `ValidationError`   | Email/password fails validation rules      |
| 401    | `UnauthorizedError` | Email not found, or password incorrect — both return `"Invalid credentials"` so callers can't enumerate accounts |
| 429    | `TooManyRequestsError` | Rate limit exceeded                    |

```json
{
  "error": "UnauthorizedError",
  "message": "Invalid credentials"
}
```

---

## Update FCM token

Register/update the current user's Firebase Cloud Messaging push token, used for like/comment notifications.

```
POST /api/v1/auth/fcm-token
```

🔒 Requires `Authorization: Bearer <token>`.

### Request body

| Field      | Type   | Required | Rules       |
|------------|--------|----------|-------------|
| `fcmToken` | string | yes      | Non-empty   |

```json
{
  "fcmToken": "dGhpcyBpcyBhIGZha2UgdG9rZW4..."
}
```

### Success response

`204 No Content` — empty body.

### Error responses

| Status | `error`             | Cause                                      |
|--------|---------------------|----------------------------------------------|
| 422    | `ValidationError`    | `fcmToken` missing/empty                     |
| 401    | `UnauthorizedError`  | Missing bearer token — `"Missing bearer token"` |
| 401    | `UnauthorizedError`  | Invalid/expired token — `"Invalid or expired token"` |
| 429    | `TooManyRequestsError` | Rate limit exceeded                        |

```json
{
  "error": "UnauthorizedError",
  "message": "Missing bearer token"
}
```
