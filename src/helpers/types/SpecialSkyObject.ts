import { ImageSourcePropType } from 'react-native';

/**
 * Lightweight stub for the Sun or Moon that flows through the search pipeline.
 * `computeObject` detects this type via `isSpecialSkyObject` and uses
 * getSunData / getLunarEquatorialCoordinate to compute accurate coordinates
 * for the requested date — the `ra` / `dec` fields on the stub are intentionally
 * zeroed out and are never used by computeObject.
 */
export type SpecialSkyObject = {
  family: 'Sun' | 'Moon';
  name: string;
  ra: number;
  dec: number;
  icon: ImageSourcePropType;
  phase?: string;
  v_mag?: number;
};
