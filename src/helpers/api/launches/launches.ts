import { Launch } from "../../../types/spaceLaunches/Launch";

export const getUpcomingLaunches = async (): Promise<Launch[] | null> => {
  try {
    console.log(`[getUpcomingLaunches] Fetching upcoming launches`);

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/launches/upcoming`);
    if (!response.ok) {
      console.log(`[getUpcomingLaunches] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    return json.data as Launch[];
  } catch (error) {
    console.log(`[getUpcomingLaunches] Error: ${error}`);
    return null;
  }
}
