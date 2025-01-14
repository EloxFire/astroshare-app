import {DSO} from "../../../types/DSO";
import {Star} from "../../../types/Star";
import {GlobalPlanet} from "../../../types/GlobalPlanet";
import {getObjectFamily} from "./getObjectFamily";
import {convertHMSToDegreeFromString} from "../HmsToDegree";
import {convertDMSToDegreeFromString} from "../DmsToDegree";
import {calculateHorizonAngle} from "../calculateHorizonAngle";
import {
  convertEquatorialToHorizontal,
  EquatorialCoordinate,
  GeographicCoordinate, HorizontalCoordinate,
  isBodyAboveHorizon, isBodyVisibleForNight
} from "@observerly/astrometry";
import {ComputedObjectInfos} from "../../../types/objects/ComputedObjectInfos";
import {app_colors} from "../../../constants";
import dayjs, {Dayjs} from "dayjs";
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

  // VISIBILITE ACTUELLE ET POUR LA NUIT
  const target: EquatorialCoordinate = {ra: degRa, dec: degDec}
  const isCurrentlyVisible: boolean = isBodyAboveHorizon(new Date(), props.observer, target, horizonAngle)
  const isVisibleThisNight: boolean = isBodyVisibleForNight(new Date(), props.observer, target, horizonAngle)


  // GESTION MAGNITUDE SELON TYPE D'OBJET
  let objectMagnitude: number;
  switch (objectFamily) {
    case "DSO":
      objectMagnitude = (props.object as DSO).v_mag as number || (props.object as DSO).b_mag as number;
      break;
    case "Star":
      objectMagnitude = (props.object as Star).V;
      break;
    case "Planet":
      objectMagnitude = 0;
      break;
    default:
      objectMagnitude = 0;
  }

  // GESTION BADGES VISIBILITE INSTRUMENTS
  const nakedEyesVisibilityInfos = {
    label: objectMagnitude < 6 ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible'),
    icon: require('../../../../../assets/icons/FiEye.png'),
    backgroundColor: objectMagnitude < 6 ? app_colors.green_eighty : app_colors.red_eighty,
    foregroundColor: app_colors.white
  }

  const binocularsVisibilityInfos = {
    label: objectMagnitude < 10 ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible'),
    icon: require('../../../../../assets/icons/FiEye.png'),
    backgroundColor: objectMagnitude < 10 ? app_colors.green_eighty : app_colors.red_eighty,
    foregroundColor: app_colors.white
  }

  const telescopeVisibilityInfos = {
    label: i18n.t('common.visibility.visible'),
    icon: require('../../../../../assets/icons/FiEye.png'),
    backgroundColor: app_colors.green_eighty,
    foregroundColor: app_colors.white
  }


  // COMPUTE OBJECT VISIBILITY GRAPH.
  // I want to get object altitude from H-6 hours to H+6 hours.
  // I need to get the object altitude every 1 hour.
  const objectAltitudes: number[] = [];
  const altitudesHours: string[] = [];
  const now: Dayjs = dayjs().minute() > 30 ? dayjs().endOf('hour') : dayjs().startOf('hour');
  const H: number = 6; // Number of hours to compute visibility graph
  for (let i = -H; i <= H; i++) {
    const date: Dayjs = now.add(i, 'hour');
    const horizontalCoords: HorizontalCoordinate = convertEquatorialToHorizontal(date.toDate(), props.observer, target);
    objectAltitudes.push(horizontalCoords.alt);
    altitudesHours.push(date.format('HH:mm'));
  }


  return {
    base: {
      family: objectFamily,
      common_name: objectFamily === 'DSO' ? (props.object as DSO).common_names.split(',')[0] : '',
      ra: props.object.ra,
      dec: props.object.dec,
      mag: objectMagnitude
    },
    visibilityInfos: {
      isCurrentlyVisible: isCurrentlyVisible,
      isVisibleThisNight: isVisibleThisNight,
      visibilityLabel: isCurrentlyVisible ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible'),
      objectNextRise: dayjs(),
      objectNextSet: dayjs(),
      visibilityIcon: isCurrentlyVisible ? require('../../../../../assets/icons/FiEye.png') : require('../../../../../assets/icons/FiEyeOff.png'),
      visibilityBackgroundColor: isCurrentlyVisible ? app_colors.green_eighty : app_colors.red_eighty,
      visibilityForegroundColor: app_colors.white,
      nakedEye: nakedEyesVisibilityInfos,
      binoculars: binocularsVisibilityInfos,
      telescope: telescopeVisibilityInfos,
      visibilityGraph: {
        altitudes: objectAltitudes,
        hours: altitudesHours
      }
    },
    error: '',
  }
}