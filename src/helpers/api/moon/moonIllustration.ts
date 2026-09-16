export const getMoonIllustration = async (date: Date): Promise<string | null> => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/moon/illustration?date=${date.toISOString()}`);
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data?.url ?? null;
};