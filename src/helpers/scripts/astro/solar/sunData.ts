import {
  Constellation,
  convertEquatorialToHorizontal,
  EquatorialCoordinate,
  GeographicCoordinate,
  getBodyNextRise,
  getBodyNextSet,
  getConstellation,
  getSolarAngularDiameter,
  getSolarDistance,
  getSolarEquatorialCoordinate,
  HorizontalCoordinate,
  isBodyAboveHorizon,
  isTransitInstance
} from "@observerly/astrometry"
import dayjs, {Dayjs} from "dayjs"
import {getConstellationName} from "../../getConstellationName"
import {calculateHorizonAngle} from "../calculateHorizonAngle"
import {i18n} from "../../i18n";
import {app_colors} from "../../../constants";
import {ComputedSunInfos} from "../../../types/objects/ComputedSunInfos";

export const getSunData = (date: Dayjs, observer: GeographicCoordinate): ComputedSunInfos => {
  const referenceNow = dayjs(date);
  const referenceDate = referenceNow.toDate();
  const localOffsetMinutes = referenceNow.utcOffset();

  const target: EquatorialCoordinate = getSolarEquatorialCoordinate(referenceDate)
  const angularSize: number = getSolarAngularDiameter(referenceDate)
  const distance: number = Math.floor(getSolarDistance(referenceDate) / 1000)

  const constellation: Constellation | undefined = getConstellation(target)
  const localizedConstellationName: string = constellation ? getConstellationName(constellation.abbreviation) : 'N/A';

  const horizonAngle: number = calculateHorizonAngle(341);
  const isCurrentlyVisible: boolean = isBodyAboveHorizon(referenceDate, observer, target, horizonAngle)
  const currentHorizontal = convertEquatorialToHorizontal(referenceDate, observer, target);
  const objectCurrentAltitude: number = currentHorizontal.alt;
  const objectCurrentAzimuth: number = currentHorizontal.az;

  const findHorizonCrossingInWindow = (direction: 'rise' | 'set', startTime: Dayjs, endTime: Dayjs): Dayjs | null => {
    const stepMinutes = 5;
    const totalMinutes = endTime.diff(startTime, 'minute');
    let previousTime = startTime;
    let previousAlt = convertEquatorialToHorizontal(startTime.toDate(), observer, target).alt;

    for (let minutes = stepMinutes; minutes <= totalMinutes; minutes += stepMinutes) {
      const currentTime = startTime.add(minutes, 'minute');
      const currentAlt = convertEquatorialToHorizontal(currentTime.toDate(), observer, target).alt;

      if (direction === 'rise' && previousAlt < horizonAngle && currentAlt >= horizonAngle) {
        const fraction = (horizonAngle - previousAlt) / (currentAlt - previousAlt);
        return previousTime.add(stepMinutes * fraction, 'minute');
      }

      if (direction === 'set' && previousAlt >= horizonAngle && currentAlt < horizonAngle) {
        const fraction = (previousAlt - horizonAngle) / (previousAlt - currentAlt);
        return previousTime.add(stepMinutes * fraction, 'minute');
      }

      previousAlt = currentAlt;
      previousTime = currentTime;
    }

    return null;
  }

  const dayStart = referenceNow.startOf('day');
  const dayEnd = dayStart.add(1, 'day');

  // Calculate sunrise/sunset specifically for the current day, even if they already happened
  let sunRiseTime: Dayjs | null = findHorizonCrossingInWindow('rise', dayStart, dayEnd);
  let sunSetTime: Dayjs | null = findHorizonCrossingInWindow('set', dayStart, dayEnd);

  // Fallback to next rise/set if not found in the current day window (polar day/night cases)
  const sunNextRise = getBodyNextRise(referenceDate, observer, target, horizonAngle)
  const sunNextSet = getBodyNextSet(referenceDate, observer, target, horizonAngle)

  if (!sunRiseTime && isTransitInstance(sunNextRise)) {
    sunRiseTime = dayjs(sunNextRise.datetime).add(localOffsetMinutes, 'minute');
  }

  if (!sunSetTime && isTransitInstance(sunNextSet)) {
    sunSetTime = dayjs(sunNextSet.datetime).add(localOffsetMinutes, 'minute');
  }

  const objectAltitudes: number[] = [];
  const altitudesHours: string[] = [];
  const H: number = 6;
  for (let i = -H; i <= H; i++) {
    const graphDate: Dayjs = referenceNow.add(i, 'hour');
    const horizontalCoords: HorizontalCoordinate = convertEquatorialToHorizontal(graphDate.toDate(), observer, target);
    objectAltitudes.push(horizontalCoords.alt);
    altitudesHours.push(graphDate.format('HH:mm'));
  }

  const isVisibleToday: boolean = isCurrentlyVisible || Boolean(sunRiseTime) || Boolean(sunSetTime)

  return {
    base: {
      family: 'Sun',
      name: i18n.t('common.planets.Sun'),
      ra: target.ra,
      dec: target.dec,
      alt: objectCurrentAltitude,
      az: objectCurrentAzimuth,
      angularDiameter: angularSize,
      distance: distance,
      constellation: localizedConstellationName,
      icon: require('../../../../../assets/icons/astro/planets/color/SUN.png')
    },
    visibility: {
      isCurrentlyVisible: isCurrentlyVisible,
      isVisibleToday: isVisibleToday,
      visibilityLabel: isCurrentlyVisible ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible'),
      visibilityBackgroundColor: isCurrentlyVisible ? app_colors.green_eighty : app_colors.red_eighty,
      visibilityForegroundColor: app_colors.white,
      visibilityIcon: isCurrentlyVisible ? require('../../../../../assets/icons/FiSun.png') : require('../../../../../assets/icons/FiEyeOff.png'),
      sunrise: sunRiseTime,
      sunset: sunSetTime,
      visibilityGraph: {
        altitudes: objectAltitudes,
        hours: altitudesHours
      }
    }
  }
}
