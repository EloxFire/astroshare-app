import { EclipticCoordinate, EquatorialCoordinate, HorizontalCoordinate, Planet } from "@observerly/astrometry";

export type GlobalPlanet = (Planet & EclipticCoordinate & EquatorialCoordinate & HorizontalCoordinate)