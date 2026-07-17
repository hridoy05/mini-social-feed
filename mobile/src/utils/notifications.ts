import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';

export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return null;
  }

  return messaging().getToken();
}

export function setupTapHandler(onTap: (postId: string) => void) {
  const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
    const postId = remoteMessage?.data?.postId;
    if (postId) onTap(String(postId));
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      const postId = remoteMessage?.data?.postId;
      if (postId) onTap(String(postId));
    });

  return unsubscribe;
}
