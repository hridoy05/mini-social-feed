import { getErrorMessage } from './apiError';

/**
 * Maps an axios error from an API request into a { field: message } map.
 * `conflictFields` lists which field names to check a ConflictError's message
 * against (e.g. ['username', 'email']); unmatched errors fall back to `form`.
 */
export function parseApiError(
  err: any,
  conflictFields: string[] = []
): Record<string, string> {
  const message = getErrorMessage(err);

  const data = err?.response?.data;
  if (data?.error === 'ConflictError') {
    const field = conflictFields.find((name) =>
      message.toLowerCase().includes(name)
    );
    if (field) return { [field]: message };
  }

  return { form: message };
}
