export const getMoonIllustration = async (date: string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/moon/illustration?date=${date}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch moon illustration: ${response.statusText}`);
  }
  const data = await response.json();
  return data.url as string;
}

export type MonthlyMoonIllustration = { date: string; url: string; width: number; height: number };

// Une seule requête pour les illustrations de tout un mois (jusqu'à 31), plutôt que N
// requêtes individuelles — utilisé par la vue "Mois" du calendrier lunaire.
export const getMoonIllustrationsForMonth = async (month: number, year: number): Promise<MonthlyMoonIllustration[]> => {
  const monthParam = String(month).padStart(2, "0");
  const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/moon/illustration/month?month=${monthParam}&year=${year}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch monthly moon illustrations: ${response.statusText}`);
  }
  const data = await response.json();
  return data.images as MonthlyMoonIllustration[];
}