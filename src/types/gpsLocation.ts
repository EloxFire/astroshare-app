export type GpsLocation = {
  latitude: number;
  longitude: number;
  elevation: number | null;
  name?: string;
  local_names?: Record<string, string>;
  country?: string;
  state?: string;
  light_pollution?: {
    bortle: number; // 1-9
    mpsas: number; // MPSAS (mag/arcsec²)
    source: string; // Source of the light pollution data
  }
};