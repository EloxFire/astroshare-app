// Formes des réponses de /v3/satellite/* (suivi en direct, relayé depuis N2YO par l'API Astroshare).

export type SatelliteTrackingInfo = {
  satid: number;
  satname: string;
  transactionscount: number;
};

export type SatelliteTle = {
  info: SatelliteTrackingInfo;
  tle: string; // deux (ou trois) lignes, séparées par \n — voir helpers/satellites/propagation.ts
};

export type SatellitePosition = {
  satlatitude: number;
  satlongitude: number;
  sataltitude: number; // km
  azimuth: number; // degrés, vu depuis l'observateur
  elevation: number; // degrés, vu depuis l'observateur
  ra: number;
  dec: number;
  timestamp: number; // epoch secondes
  eclipsed: boolean; // dans l'ombre de la Terre (non éclairé par le Soleil)
};

export type SatellitePositions = {
  info: SatelliteTrackingInfo;
  positions: SatellitePosition[];
};

// `quality` est un identifiant stable à traduire côté front (comme `label` côté catalogue NORAD),
// pas du texte affichable — voir getSatellitePassQualityLabel.
export type SatellitePassQuality = "excellent" | "good" | "faint";

export type SatellitePass = {
  startAz: number;
  startAzCompass: string;
  startEl: number;
  startUTC: number; // epoch secondes
  maxAz: number;
  maxAzCompass: string;
  maxEl: number;
  maxUTC: number;
  endAz: number;
  endAzCompass: string;
  endEl: number;
  endUTC: number;
  mag: number;
  duration: number; // secondes
  quality: SatellitePassQuality;
};

export type SatellitePasses = {
  info: SatelliteTrackingInfo & { passescount: number };
  passes: SatellitePass[];
};
