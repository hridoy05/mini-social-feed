import { getMessaging } from 'firebase-admin/messaging';
import { initFirebase } from '../config/firebase';
import { userRepository } from '../repositories/userRepository';

// Fire-and-forget: never rejects, never breaks the calling request.
export async function notifyUser(
  userId: string,
  title: string,
  body: string,
  data: Record<string, string> = {},
): Promise<void> {
  try {
    initFirebase();
    const user = await userRepository.findById(userId);
    if (!user?.fcmToken) return;

    await getMessaging().send({
      token: user.fcmToken,
      notification: { title, body },
      data,
    });
  } catch (err) {
    console.error('FCM error:', (err as Error).message);
    // swallow — notifications must never break the main request
  }
}
