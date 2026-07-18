# Posts API

Base path: `/api/v1/posts`

🔒 Every endpoint in this group requires `Authorization: Bearer <token>` (see [Auth API](./auth.md)).

---

## Create post

```
POST /api/v1/posts
```

### Request body

| Field  | Type   | Required | Rules                     |
|--------|--------|----------|----------------------------|
| `text` | string | yes      | 1–500 characters, trimmed  |

```json
{
  "text": "Just shipped the mini social feed API 🚀"
}
```

### Success response

`201 Created`

```json
{
  "id": "3f9a6a0e-7b7e-4c62-9f0a-1e2d3c4b5a6f",
  "text": "Just shipped the mini social feed API 🚀",
  "authorId": "b3f1c2b0-4b1a-4e9e-9c1a-2e6b2a9f6a11",
  "author": {
    "id": "b3f1c2b0-4b1a-4e9e-9c1a-2e6b2a9f6a11",
    "username": "hridoy05"
  },
  "likes": [],
  "comments": [],
  "_count": { "likes": 0, "comments": 0 },
  "createdAt": "2026-07-18T10:15:00.000Z",
  "updatedAt": "2026-07-18T10:15:00.000Z"
}
```

### Error responses

| Status | `error`             | Cause                                            |
|--------|---------------------|----------------------------------------------------|
| 422    | `ValidationError`    | `text` missing, empty, or over 500 characters       |
| 401    | `UnauthorizedError`  | Missing/invalid/expired bearer token                |

```json
{
  "error": "ValidationError",
  "message": "Text must be 1–500 characters"
}
```

---

## Get feed

Paginated list of posts, newest first, each with its likes, comments, and counts.

```
GET /api/v1/posts
```

### Query parameters

| Param      | Type   | Required | Rules                            | Default |
|------------|--------|----------|-----------------------------------|---------|
| `page`     | int    | no       | `>= 1`                             | `1`     |
| `limit`    | int    | no       | `1`–`50`                           | `10`    |
| `username` | string | no       | Filter feed to one author's posts  | —       |

```
GET /api/v1/posts?page=1&limit=10&username=hridoy05
```

### Success response

`200 OK`

```json
{
  "posts": [
    {
      "id": "3f9a6a0e-7b7e-4c62-9f0a-1e2d3c4b5a6f",
      "text": "Just shipped the mini social feed API 🚀",
      "authorId": "b3f1c2b0-4b1a-4e9e-9c1a-2e6b2a9f6a11",
      "author": { "id": "b3f1c2b0-4b1a-4e9e-9c1a-2e6b2a9f6a11", "username": "hridoy05" },
      "likes": [{ "userId": "a1a1a1a1-1111-1111-1111-111111111111" }],
      "comments": [
        {
          "id": "c1c1c1c1-2222-2222-2222-222222222222",
          "text": "Nice work!",
          "userId": "a1a1a1a1-1111-1111-1111-111111111111",
          "postId": "3f9a6a0e-7b7e-4c62-9f0a-1e2d3c4b5a6f",
          "user": { "id": "a1a1a1a1-1111-1111-1111-111111111111", "username": "another_user" },
          "createdAt": "2026-07-18T10:20:00.000Z",
          "updatedAt": "2026-07-18T10:20:00.000Z"
        }
      ],
      "_count": { "likes": 1, "comments": 1 },
      "createdAt": "2026-07-18T10:15:00.000Z",
      "updatedAt": "2026-07-18T10:15:00.000Z"
    }
  ],
  "page": 1,
  "totalPages": 3,
  "hasMore": true
}
```

### Error responses

| Status | `error`             | Cause                                                  |
|--------|---------------------|-----------------------------------------------------------|
| 422    | `ValidationError`    | `page`/`limit` out of range or not an integer              |
| 401    | `UnauthorizedError`  | Missing/invalid/expired bearer token                       |

```json
{
  "error": "ValidationError",
  "message": "Invalid value"
}
```
