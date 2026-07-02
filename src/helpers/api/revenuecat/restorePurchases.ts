import Purchases from "react-native-purchases";
import { revenueCatConstants } from "../../constants";

export const restorePurchases = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return typeof customerInfo.entitlements.active[revenueCatConstants.entitlementId] !== "undefined";
  } catch (error) {
    console.error("[RevenueCat] Error restoring purchases:", error);
    return false;
  }
};
