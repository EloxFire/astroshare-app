import Purchases, { PurchasesPackage } from "react-native-purchases";
import { revenueCatConstants } from "../../constants";

const fetchOfferingPackages = async (): Promise<PurchasesPackage[]> => {
  const offerings = await Purchases.getOfferings();
  const mainOffering = offerings.all[revenueCatConstants.offeringId] ?? offerings.current;

  if (!mainOffering) {
    console.warn("[RevenueCat] No offering found (neither 'Main' nor a current offering)");
    return [];
  }

  return mainOffering.availablePackages;
};

/**
 * Retries once on an empty/failed result: right after cold start (Purchases.configure()
 * in App.tsx), the SDK can occasionally return no offerings on the very first call before
 * its background sync completes. A single short retry avoids leaving the paywall with no
 * purchasable package (and therefore an effectively dead "Continue" button).
 */
export const getOfferings = async (): Promise<PurchasesPackage[]> => {
  try {
    const packages = await fetchOfferingPackages();
    if (packages.length > 0) return packages;
  } catch (error) {
    console.error("[RevenueCat] Error fetching offerings:", error);
  }

  await new Promise((resolve) => setTimeout(resolve, 800));

  try {
    return await fetchOfferingPackages();
  } catch (error) {
    console.error("[RevenueCat] Error fetching offerings (retry):", error);
    return [];
  }
};
