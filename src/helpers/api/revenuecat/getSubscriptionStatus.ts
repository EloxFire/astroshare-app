import Purchases from "react-native-purchases";
import { revenueCatConstants } from "../../constants";

export const getSubscriptionStatus = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return typeof customerInfo.entitlements.active[revenueCatConstants.entitlementId] !== "undefined";
  } catch (error) {
    console.error("[RevenueCat] Error fetching customer info:", error);
    return false;
  }
};
