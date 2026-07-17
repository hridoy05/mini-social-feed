/**
 * Maps an axios error from an auth request into a { field: message } map.
 * `conflictFields` lists which field names to check a ConflictError's message
 * against (e.g. ['username', 'email']); unmatched errors fall back to `form`.
 */
export function parseAuthError(
  err: any,
  conflictFields: string[] = []
): Record<string, string> {
  if (err?.code === 'ERR_NETWORK') {
    return { form: "Can't reach server. Check your connection." };
  }
  if (err?.code === 'ECONNABORTED') {
    return { form: 'Request timed out. Try again.' };
  }

  const data = err?.response?.data;
  const message: string = data?.message ?? 'Something went wrong. Try again.';

  if (data?.error === 'ConflictError') {
    const field = conflictFields.find((name) =>
      message.toLowerCase().includes(name)
    );
    if (field) return { [field]: message };
  }

  return { form: message };
}
