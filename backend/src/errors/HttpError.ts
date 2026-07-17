// Base class — every specific error extends this.
export class HttpError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// 400 — client sent something invalid
export class BadRequestError extends HttpError {
  constructor(message = 'Bad request') { super(400, message); }
}

// 401 — no valid credentials
export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') { super(401, message); }
}

// 403 — authenticated but not allowed
export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden') { super(403, message); }
}

// 404 — resource doesn't exist
export class NotFoundError extends HttpError {
  constructor(resource = 'Resource') { super(404, `${resource} not found`); }
}

// 409 — duplicate/state conflict
export class ConflictError extends HttpError {
  constructor(message = 'Conflict') { super(409, message); }
}

// 422 — validation failed (semantically valid but rejected)
export class ValidationError extends HttpError {
  constructor(message = 'Validation failed') { super(422, message); }
}

// 429 — rate limited
export class TooManyRequestsError extends HttpError {
  constructor(message = 'Too many requests') { super(429, message); }
}
