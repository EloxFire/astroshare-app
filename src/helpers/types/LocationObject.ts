import { DMSCoords } from "./DMSCoords";

export type LocationObject = {
  lat: number;
  lon: number;
  dms?: DMSCoords;
  common_name?: string;
  state?: string;
  country?: string;
}