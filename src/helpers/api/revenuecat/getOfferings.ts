import Purchases, { PurchasesPackage } from "react-native-purchases";
import { revenueCatConstants } from "../../constants";

export const getOfferings = async (): Promise<PurchasesPackage[]> => {
  try {
    const offerings = await Purchases.getOfferings();
    const mainOffering = offerings.all[revenueCatConstants.offeringId];

    if (!mainOffering) {
      console.warn("[RevenueCat] Offering 'Main' not found");
      return [];
    }

    return mainOffering.availablePackages;
  } catch (error) {
    console.error("[RevenueCat] Error fetching offerings:", error);
    return [];
  }
};
