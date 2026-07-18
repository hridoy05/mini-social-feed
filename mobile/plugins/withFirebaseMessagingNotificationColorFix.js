const { withAndroidManifest } = require("@expo/config-plugins");

const META_DATA_NAME = "com.google.firebase.messaging.default_notification_color";

/**
 * expo-notifications and @react-native-firebase/messaging both inject
 * this meta-data with different resource values, which fails the
 * Android manifest merger. Mark our copy as authoritative.
 */
const withFirebaseMessagingNotificationColorFix = (config) => {
  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application?.[0];
    const metaData = application?.["meta-data"]?.find(
      (item) => item.$["android:name"] === META_DATA_NAME
    );

    if (metaData) {
      metaData.$["tools:replace"] = "android:resource";
    }

    return config;
  });
};

module.exports = withFirebaseMessagingNotificationColorFix;
