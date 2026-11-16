import { Agency } from "../../../types/spaceLaunches/Agency";

export const getAgencyById = async (agencyId: string | number): Promise<Agency | null> => {
  try {
    console.log(`[getAgencyById] Fetching agency ${agencyId}`);

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/agencies/${agencyId}`);
    if (!response.ok) {
      console.log(`[getAgencyById] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    return json.data as Agency;
  } catch (error) {
    console.log(`[getAgencyById] Error: ${error}`);
    return null;
  }
}
