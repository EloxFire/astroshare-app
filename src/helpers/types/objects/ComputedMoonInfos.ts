export type ComputedMoonInfos = {
  base: {
    family: string;
    common_name: string;
    ra: number;
    dec: number;
    alt: number;
    az: number;
  },
  data: {
    phase: string;
    illumination: string;
    distance: number;
    elongation: number;
    isNewMoon: boolean;
    isFullMoon: boolean;
    age: number;
    angularDiameter: number;
    phaseAngle: number;
    nextNewMoon: Date;
    nextFullMoon: Date;
  },
  visibility: {
    isCurrentlyVisible: boolean;
    isVisibleThisNight: boolean;
    visibilityLabel: string;
    visibilityBackgroundColor: string;
    visibilityForegroundColor: string;
    visibilityIcon: string;
    objectNextRise: string;
    objectNextSet: string;
    visibilityGraph: {
      altitudes: number[];
      hours: string[];
    };
  }
}