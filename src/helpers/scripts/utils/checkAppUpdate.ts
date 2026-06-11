import { storageKeys } from "../../constants";
import { storeData } from "../../storage";

const compareVersions = (a: string, b: string): number => {
  const pa = a.trim().split('.').map(Number);
  const pb = b.trim().split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
};

export const checkAppUpdate = async (): Promise<boolean> => {
  try {
    const response = await fetch(process.env.EXPO_PUBLIC_ASTROSHARE_API_URL)
    const data = await response.json()
    const matchingVersion: string = data.app_matching_version
    const currentVersion = process.env.EXPO_PUBLIC_APP_VERSION ?? '0.0.0'

    console.log(`[App Update Check] Current: ${currentVersion}, Available: ${matchingVersion}`);

    if (matchingVersion && compareVersions(matchingVersion, currentVersion) > 0) {
      await storeData(storageKeys.updates.lastAvailableVersion, JSON.stringify(matchingVersion));
      return true
    }
    return false

  } catch (error) {
    console.error('[App Update Check] Error checking app update:', error)
    return false
  }
}