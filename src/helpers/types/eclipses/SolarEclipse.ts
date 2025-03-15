type CelestialBody = {
  DEC: number;
  RA: number;
  azimuth: number;
  elevation: number;
  parallax: number;
  radius: number;
};

type EclipseEvent = {
  Moon: CelestialBody;
  Sun: CelestialBody;
  "UT1-TT": number;
  date: string;
  location: {
    geometry: {
      coordinates: [number, number, number];
      type: string;
    };
    properties: {
      coordinatesDMS: [string, string, string];
    };
    type: string;
  };
  p: number | null;
  zenith: number | null;
};

type Duration = {
  penumbral: string;
  umbral: string | null;
};

export type PhysicalData = {
  Earth: {
    inverseFlattening: number;
    radius: number;
  };
  Moon: {
    radius: number;
  };
  Sun: {
    radius: number;
  };
};

export type VisibilityLine = {
  geometry: {
    coordinates: [number, number, number][][];
    type: string;
  };
  properties: {
    name: string;
  };
  type: string;
};

export type VisibilityPaths = {
  geometry: {
    coordinates: [number, number, number][];
    type: string;
  };
}


export type SolarEclipse = {
  calendarDate: string;
  duration: Duration;
  events: {
    P1?: EclipseEvent;
    P4?: EclipseEvent;
    greatest?: EclipseEvent;
  };
  link: {
    image: string;
    self: string;
    video: string;
  };
  magnitude: number;
  obscuration: number | null;
  physicalData: PhysicalData;
  type: string;
  visibilityLines?: {
    features: VisibilityLine[];
    type: string;
  };
  visibilityPaths?: {
    features: VisibilityPaths[];
    type: string;
  }
};
