import { Pad } from "../../../types/spaceLaunches/Pad";

export const getPadById = async (padId: string | number): Promise<Pad | null> => {
  try {
    console.log(`[getPadById] Fetching pad ${padId}`);

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/pads/${padId}`);
    if (!response.ok) {
      console.log(`[getPadById] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    return json.data as Pad;
  } catch (error) {
    console.log(`[getPadById] Error: ${error}`);
    return null;
  }
}
