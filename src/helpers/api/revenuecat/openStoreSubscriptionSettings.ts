import { Linking, Platform } from "react-native";

const storeSubscriptionUrls: Record<string, string> = {
  ios: "https://apps.apple.com/account/subscriptions",
  android: "https://play.google.com/store/account/subscriptions",
};

export const openStoreSubscriptionSettings = () => {
  const url = storeSubscriptionUrls[Platform.OS];
  if (!url) return;

  Linking.openURL(url);
};
