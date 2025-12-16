export type LightPollutionData = {
  lat: number;
  lon: number;
  bortle: number;
  mpsas: string; // Magnitudes per square arcsecond
  source: string;
  location: string;
}