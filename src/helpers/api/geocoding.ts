const BASE_URL = process.env.EXPO_PUBLIC_ASTROSHARE_API_URL;

export const getLocationName = async (latitude: number, longitude: number): Promise<{
  name: string;
  local_names: Record<string, string>;
  country: string;
  state: string;
} | null> => {
  try {
    const response = await fetch(`${BASE_URL}/location/name?lat=${latitude}&lon=${longitude}`);
    if (!response.ok) {
      throw new Error(`[getLocationName] HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    return {
      name: data.data.name,
      local_names: data.data.local_names,
      country: data.data.country,
      state: data.data.state
    }
  } catch (error) {
    console.error("[getLocationName] Error fetching location name:", error);
    return null;
  }
};