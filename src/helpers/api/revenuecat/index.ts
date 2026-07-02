import { Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

export const configureRevenueCat = () => {
  const apiKey = Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
    : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;

  if (!apiKey) {
    console.warn("[RevenueCat] Missing API key for platform", Platform.OS);
    return;
  }

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  Purchases.configure({ apiKey });
};

export const loginRevenueCat = async (uid: string) => {
  try {
    await Purchases.logIn(uid);
  } catch (error) {
    console.error("[RevenueCat] Error logging in user:", error);
  }
};

export const logoutRevenueCat = async () => {
  try {
    await Purchases.logOut();
  } catch (error) {
    console.error("[RevenueCat] Error logging out user:", error);
  }
};
