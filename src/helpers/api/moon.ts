export const getMoonIllustration = async (date: string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/moon/illustration?date=${date}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch moon illustration: ${response.statusText}`);
  }
  const data = await response.json();
  return data.url as string;
}