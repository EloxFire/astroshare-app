import { equatorialToHorizontal } from "./celestialPosition";
import type { LunarEclipse, LunarEclipseEventKey } from "../../types/eclipses/Eclipse";

export type LunarContactVisibility = {
  key: LunarEclipseEventKey;
  date: Date;
  altitudeDeg: number;
  azimuthDeg: number;
  aboveHorizon: boolean;
};

const CONTACT_ORDER: LunarEclipseEventKey[] = ["P1", "U1", "U2", "greatest", "U3", "U4", "P2"];

// Altitude de la Lune à chaque contact (ceux présents pour ce type d'éclipse), pour un lieu donné —
// voir celestialPosition.ts : ces instants sont géocentriques (identiques partout), seule
// l'altitude dépend du lieu.
export const getLunarContactsVisibility = (eclipse: LunarEclipse, latitude: number, longitude: number): LunarContactVisibility[] =>
  CONTACT_ORDER.flatMap((key) => {
    const event = eclipse.events[key];
    const ra = event?.Moon?.RA;
    const dec = event?.Moon?.DEC;
    if (!event || ra == null || dec == null) return [];

    const { altitude, azimuth } = equatorialToHorizontal(event.date, ra, dec, latitude, longitude);
    return [{ key, date: new Date(`${event.date}Z`), altitudeDeg: altitude, azimuthDeg: azimuth, aboveHorizon: altitude >= 0 }];
  });

// Visible depuis ce lieu : au moins un contact avec la Lune au-dessus de l'horizon (pas forcément
// celui du maximum — on peut par exemple manquer le maximum mais voir la fin partielle au lever de
// Lune).
export const isLunarEclipseVisibleFrom = (eclipse: LunarEclipse, latitude: number, longitude: number): boolean =>
  getLunarContactsVisibility(eclipse, latitude, longitude).some((contact) => contact.aboveHorizon);
