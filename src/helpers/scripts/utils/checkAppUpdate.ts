import { storageKeys } from "../../constants";
import { storeData } from "../../storage";

export const checkAppUpdate = async (): Promise<boolean> => {
  try {
    const response = await fetch(process.env.EXPO_PUBLIC_ASTROSHARE_API_URL)
    const data = await response.json()
    const matchingVersion = data.app_matching_version

    console.log(`[App Update Check] Current version: ${process.env.EXPO_PUBLIC_APP_VERSION}, Matching version from API: ${matchingVersion}`);
    

    if (matchingVersion && matchingVersion !== process.env.EXPO_PUBLIC_APP_VERSION) {
      // There's a new version available
      await storeData(storageKeys.updates.lastAvailableVersion, JSON.stringify(matchingVersion));
      return true
    }
    // No new version available
    return false

  } catch (error) {
    console.error('[App Update Check] Error checking app update:', error)
    // In case of error, we assume no update is available
    return false
  }
}