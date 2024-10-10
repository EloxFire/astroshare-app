export type StarlinkSatellite = {
  TLE: string[];
  INTLDES: string;
  NORAD_CAT_ID: number;
  OBJECT_TYPE: string;
  SATNAME: string;
  COUNTRY: string;
  LAUNCH: string;
  SITE: string;
  DECAY: null | string;
  PERIOD: number;
  INCLINATION: number;
  APOGEE: number;
  PERIGEE: number;
  COMMENT: null | string;
  COMMENTCODE: null | string;
  RCSVALUE: number;
  RCS_SIZE: string;
  FILE: string;
  LAUNCH_YEAR: number;
  LAUNCH_NUM: number;
  LAUNCH_PIECE: string;
  CURRENT: string;
  OBJECT_NAME: string;
  OBJECT_ID: string;
  OBJECT_NUMBER: number;
}
