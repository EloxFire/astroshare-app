import {DSO} from "../../../types/DSO";
import {Star} from "../../../types/Star";
import {GlobalPlanet} from "../../../types/GlobalPlanet";
import {getObjectFamily} from "./getObjectFamily";
import {convertHMSToDegreeFromString} from "../HmsToDegree";
import {convertDMSToDegreeFromString} from "../DmsToDegree";
import {calculateHorizonAngle} from "../calculateHorizonAngle";
import {
  EquatorialCoordinate,
  GeographicCoordinate,
  isBodyAboveHorizon, isBodyVisibleForNight
} from "@observerly/astrometry";
import {ComputedObjectInfos} from "../../../types/objects/ComputedObjectInfos";
import {app_colors} from "../../../constants";
import dayjs from "dayjs";
import {i18n} from "../../i18n";

interface ComputeObjectProps {
  object: DSO | Star | GlobalPlanet;
  observer: GeographicCoordinate;
  altitude?: number;
}

export const computeObject = (props: ComputeObjectProps): ComputedObjectInfos | null => {
  const objectFamily: "DSO" | "Star" | "Planet" | "Other" = getObjectFamily(props.object);
  const alt: number = props.altitude ? props.altitude : 341;
  const horizonAngle: number = calculateHorizonAngle(alt);

  let degRa: number = objectFamily === 'DSO' ? convertHMSToDegreeFromString(props.object.ra as string) : props.object.ra as number
  let degDec: number = objectFamily === 'DSO' ? convertDMSToDegreeFromString(props.object.dec as string) : props.object.dec as number

  if(!degRa || !degDec) {
    console.log('[computeObject] Error: could not convert ra and dec to degrees')
    return null;
  }

  const target: EquatorialCoordinate = {ra: degRa, dec: degDec}
  const isCurrentlyVisible: boolean = isBodyAboveHorizon(new Date(), props.observer, target, horizonAngle)
  const isVisibleThisNight: boolean = isBodyVisibleForNight(new Date(), props.observer, target, horizonAngle)


  return {
    visibilityInfos: {
      isCurrentlyVisible: isCurrentlyVisible,
      isVisibleThisNight: isVisibleThisNight,
      visibilityLabel: isCurrentlyVisible ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible'),
      objectNextRise: dayjs(),
      objectNextSet: dayjs(),
      visibilityIcon: isCurrentlyVisible ? require('../../../../../assets/icons/FiEye.png') : require('../../../../../assets/icons/FiEyeOff.png'),
      visibilityBackgroundColor: isCurrentlyVisible ? app_colors.green_eighty : app_colors.red_eighty,
      visibilityForegroundColor: app_colors.white,
    },
    error: '',
  }
}