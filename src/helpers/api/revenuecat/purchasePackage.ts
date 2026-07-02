import Purchases, { PurchasesPackage } from "react-native-purchases";

export type PurchasePackageResult =
  | { success: true }
  | { success: false; userCancelled: true }
  | { success: false; error: string };

export const purchasePackage = async (pack: PurchasesPackage): Promise<PurchasePackageResult> => {
  try {
    await Purchases.purchasePackage(pack);
    return { success: true };
  } catch (error: any) {
    if (error.userCancelled) {
      return { success: false, userCancelled: true };
    }

    console.error("[RevenueCat] Error purchasing package:", error);
    return { success: false, error: error.message || "Une erreur est survenue lors de l'achat" };
  }
};
