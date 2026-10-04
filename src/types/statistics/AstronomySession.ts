import { Setup } from "../gear/Setup";
import { Telescope } from "../gear/Telescope";
import { GpsLocation } from "../gpsLocation";
import { Observatory } from "../observatory";

export type AstronomySession = {
  id: string; // generate custom id
  startTime: number; // timestamp in milliseconds
  endTime: number; // timestamp in milliseconds
  location: Observatory | GpsLocation; // either an observatory or a custom location (GPS)
  observatoryId: string | null; // uuid of the observatory if the session was done in an observatory, null if it was done in a custom location (GPS)
  notes: string | null;
  grades: {
    seeing: number | null; // 1 to 5
    transparency: number | null; // 1 to 5
    darkness: number | null; // 1 to 5
  },
  setups: Setup[] | null; // array of setups used during the session, or null
  astrophotos: boolean; // true if astrophotos were taken during the session, false otherwise
  drawings: boolean; // true if drawings were made during the session, false otherwise
  observations: {
    // dsos: DSO // TODO: add DSO type and other observation types
    // planets: Planet // TODO: add Planet type and other observation types
    // stars: Star // TODO: add Star type and other observation types
    // satellites: Satellite // TODO: add Satellite type and other observation types
    meteors: boolean; // true if meteors were observed during the session, false otherwise
    comets: boolean; // true if comets were observed during the session, false otherwise
    eclipses: boolean; // true if eclipses were observed during the session, false otherwise
    transits: boolean; // true if transits were observed during the session, false otherwise
    occultations: boolean; // true if occultations were observed during the session, false otherwise
  }
}