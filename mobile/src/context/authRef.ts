/**
 * Module-level bridge so the axios interceptor (outside React) can trigger
 * sign-out on a 401 without importing AuthContext and creating a cycle.
 */
type SignOutFn = () => void;

let signOutHandler: SignOutFn | null = null;

export function setSignOutHandler(fn: SignOutFn) {
  signOutHandler = fn;
}

export function triggerSignOut() {
  signOutHandler?.();
}
