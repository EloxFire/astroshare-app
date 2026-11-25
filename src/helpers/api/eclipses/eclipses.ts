import type { LunarEclipse, SolarEclipse } from "../../../types/eclipses/Eclipse";

// Relais IMCCE/OPALE, public, sans jeton — même schéma try/catch/console.log/null que
// getObjectById/getSatelliteTle. Une année renvoie toutes les éclipses du type demandé qui s'y
// produisent (0 à 2 en général) ; pas de pagination.
export const getSolarEclipses = async (year: number): Promise<SolarEclipse[] | null> => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/eclipses/solar?year=${year}`);
    if (!response.ok) {
      console.log(`[getSolarEclipses] Error: ${response.status} ${response.statusText}`);
      return null;
    }
    return (await response.json()) as SolarEclipse[];
  } catch (error) {
    console.log(`[getSolarEclipses] Error: ${error}`);
    return null;
  }
};

export const getLunarEclipses = async (year: number): Promise<LunarEclipse[] | null> => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/eclipses/lunar?year=${year}`);
    if (!response.ok) {
      console.log(`[getLunarEclipses] Error: ${response.status} ${response.statusText}`);
      return null;
    }
    return (await response.json()) as LunarEclipse[];
  } catch (error) {
    console.log(`[getLunarEclipses] Error: ${error}`);
    return null;
  }
};

// Circonstances réellement recalculées pour un observateur donné (vérifié en direct : magnitude,
// obscuration et angles de position/zénith diffèrent bien d'un lieu à l'autre, type devient
// "ObserverPartialEclipse"/"ObserverTotalEclipse"/"ObserverAnnularEclipse") — `year` prend ici la
// DATE complète de l'éclipse (pas juste l'année), pour cibler celle-ci précisément. `null` si
// l'éclipse n'est pas visible du tout depuis ce point (l'API renvoie alors un tableau vide).
export const getLocalSolarEclipse = async (calendarDate: string, latitude: number, longitude: number): Promise<SolarEclipse | null> => {
  try {
    const params = new URLSearchParams({ year: calendarDate, observer: `${latitude},${longitude}` });
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/eclipses/solar?${params.toString()}`);
    if (!response.ok) {
      console.log(`[getLocalSolarEclipse] Error: ${response.status} ${response.statusText}`);
      return null;
    }
    const data = (await response.json()) as SolarEclipse[];
    return data[0] ?? null;
  } catch (error) {
    console.log(`[getLocalSolarEclipse] Error: ${error}`);
    return null;
  }
};

export const getLocalLunarEclipse = async (calendarDate: string, latitude: number, longitude: number): Promise<LunarEclipse | null> => {
  try {
    const params = new URLSearchParams({ year: calendarDate, observer: `${latitude},${longitude}` });
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/eclipses/lunar?${params.toString()}`);
    if (!response.ok) {
      console.log(`[getLocalLunarEclipse] Error: ${response.status} ${response.statusText}`);
      return null;
    }
    const data = (await response.json()) as LunarEclipse[];
    return data[0] ?? null;
  } catch (error) {
    console.log(`[getLocalLunarEclipse] Error: ${error}`);
    return null;
  }
};
