import { GpsLocation } from "./gpsLocation";

export type Observatory = GpsLocation & {
  id: string; //uuid
  name: string;
  tag?: string;
}