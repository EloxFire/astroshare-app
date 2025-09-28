export interface LunarEclipse {
  calendarDate: string;
  duration: {
    partial?: string;
    penumbral?: string;
    total?: string;
  };
  events: {
    P1?: EclipseEvent;
    P2?: EclipseEvent;
    U1?: EclipseEvent;
    U2?: EclipseEvent;
    U3?: EclipseEvent;
    U4?: EclipseEvent;
    T1?: EclipseEvent;
    T2?: EclipseEvent;
    O1?: EclipseEvent;
    O2?: EclipseEvent;
    greatest?: EclipseEvent;
  };
  link: {
    image: string;
    self: string;
    video: string;
  };
  magnitude: number;
  radius: {
    penumbra: number;
    umbra: number;
  };
  type: string;
}

export type EclipseEvent = {
  Moon: CelestialBody;
  Sun: CelestialBody;
  "UT1-TT": number;
  date: string;
  zenith: {
    geometry: {
      coordinates: [number, number, number][][];
      type: string;
    };
    properties: {
      coordinatesDMS: [string, string, string];
    };
    type: string;
  };
  p: number | null;
};

interface CelestialBody {
  DEC: number;
  RA: number;
  parallax: number;
  radius: number;
}
