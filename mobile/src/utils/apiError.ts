/** Turns any caught error into a single user-facing message for toasts/banners. */
export function getErrorMessage(err: any): string {
  if (err?.code === 'ERR_NETWORK') {
    return "Can't reach the server. Check your connection.";
  }
  if (err?.code === 'ECONNABORTED') {
    return 'Request timed out. Try again.';
  }

  const message = err?.response?.data?.message;
  if (typeof message === 'string' && message.length > 0) {
    return message;
  }

  return 'Something went wrong. Please try again.';
}

export default getErrorMessage;
