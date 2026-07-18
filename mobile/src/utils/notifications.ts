import { isRunningInExpoGo } from "expo";
import * as Device from "expo-device";
import { Platform } from "react-native";

const pushSupported = Platform.OS !== "web" && !isRunningInExpoGo();

export function setupNotificationHandler() {
  if (!pushSupported) return;

  const Notifications = require("expo-notifications");
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
  if (!Device.isDevice || !pushSupported) {
    return null;
  }

  const Notifications = require("expo-notifications");
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    return null;
  }

  const messaging = require("@react-native-firebase/messaging").default;
  return messaging().getToken();
}

export function setupTapHandler(onTap: (postId: string) => void) {
  if (!pushSupported) {
    return () => {};
  }

  const messaging = require("@react-native-firebase/messaging").default;
  const unsubscribe = messaging().onNotificationOpenedApp(
    (remoteMessage: any) => {
      const postId = remoteMessage?.data?.postId;
      if (postId) onTap(String(postId));
    },
  );

  messaging()
    .getInitialNotification()
    .then((remoteMessage: any) => {
      const postId = remoteMessage?.data?.postId;
      if (postId) onTap(String(postId));
    });

  return unsubscribe;
}
