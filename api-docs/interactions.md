# Interactions API

Base path: `/api/v1/posts`

🔒 Every endpoint in this group requires `Authorization: Bearer <token>` (see [Auth API](./auth.md)).

Both endpoints trigger a push notification (via FCM, see [`updateFcmToken`](./auth.md#update-fcm-token)) to the post's author, unless the acting user is the author themselves.

---

## Like / unlike a post

Toggles the current user's like on a post: if not already liked, it likes it; if already liked, it removes the like.

```
POST /api/v1/posts/:id/like
```

### Path parameters

| Param | Type   | Required | Rules        |
|-------|--------|----------|--------------|
| `id`  | string | yes      | Valid UUID   |

### Request body

None.

### Success response

`200 OK`

```json
{
  "liked": true,
  "count": 4
}
```

`liked` reflects the new state after the toggle; `count` is the post's total like count after the change.

### Error responses

| Status | `error`             | Cause                                       |
|--------|---------------------|-----------------------------------------------|
| 422    | `ValidationError`    | `id` is not a valid UUID — `"Invalid post id"` |
| 401    | `UnauthorizedError`  | Missing/invalid/expired bearer token           |
| 404    | `NotFoundError`      | Post does not exist — `"Post not found"`       |

```json
{
  "error": "NotFoundError",
  "message": "Post not found"
}
```

---

## Comment on a post

```
POST /api/v1/posts/:id/comment
```

### Path parameters

| Param | Type   | Required | Rules        |
|-------|--------|----------|--------------|
| `id`  | string | yes      | Valid UUID   |

### Request body

| Field  | Type   | Required | Rules                     |
|--------|--------|----------|----------------------------|
| `text` | string | yes      | 1–500 characters, trimmed  |

```json
{
  "text": "This is awesome!"
}
```

### Success response

`201 Created`

```json
{
  "id": "c1c1c1c1-2222-2222-2222-222222222222",
  "text": "This is awesome!",
  "userId": "a1a1a1a1-1111-1111-1111-111111111111",
  "postId": "3f9a6a0e-7b7e-4c62-9f0a-1e2d3c4b5a6f",
  "user": {
    "id": "a1a1a1a1-1111-1111-1111-111111111111",
    "username": "another_user"
  },
  "createdAt": "2026-07-18T10:20:00.000Z",
  "updatedAt": "2026-07-18T10:20:00.000Z"
}
```

### Error responses

| Status | `error`             | Cause                                              |
|--------|---------------------|-------------------------------------------------------|
| 422    | `ValidationError`    | `id` is not a valid UUID, or `text` fails validation    |
| 401    | `UnauthorizedError`  | Missing/invalid/expired bearer token                    |
| 404    | `NotFoundError`      | Post does not exist — `"Post not found"`                |

```json
{
  "error": "ValidationError",
  "message": "Invalid post id"
}
```
