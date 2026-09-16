export type GpsLocation = {
  latitude: number;
  longitude: number;
  elevation: number;
  name?: string;
  local_names?: Record<string, string>;
  country?: string;
  state?: string;
};