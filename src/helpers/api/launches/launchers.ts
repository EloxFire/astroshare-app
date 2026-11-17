import { Launcher } from "../../../types/spaceLaunches/Launcher";

export const getLauncherById = async (launcherId: string | number): Promise<Launcher | null> => {
  try {
    console.log(`[getLauncherById] Fetching launcher ${launcherId}`);

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/launchers/${launcherId}`);
    if (!response.ok) {
      console.log(`[getLauncherById] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    return json.data as Launcher;
  } catch (error) {
    console.log(`[getLauncherById] Error: ${error}`);
    return null;
  }
}
