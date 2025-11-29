import {
  convertEquatorialToHorizontal,
  EquatorialCoordinate,
  GeographicCoordinate, getBodyNextRise, getBodyNextSet, getBodyTransit,
  getLunarAge, getLunarAngularDiameter, getLunarDistance, getLunarElongation,
  getLunarEquatorialCoordinate,
  getLunarIllumination,
  getLunarPhase, getLunarPhaseAngle, getNextFullMoon, getNextNewMoon,
  HorizontalCoordinate,
  isBodyAboveHorizon,
  isBodyVisibleForNight, isFullMoon, isNewMoon, isTransitInstance
} from "@observerly/astrometry";
import {calculateHorizonAngle} from "../calculateHorizonAngle";
import {ComputedMoonInfos} from "../../../types/objects/ComputedMoonInfos";
import {i18n} from "../../i18n";
import {app_colors} from "../../../constants";
import dayjs, {Dayjs} from "dayjs";
import {ImageSourcePropType} from "react-native";
import {moonIcons} from "../../loadImages";

interface computeMoonProps {
  date: Date;
  observer: GeographicCoordinate;
}

export const computeMoon = ({date, observer}: computeMoonProps): ComputedMoonInfos => {
  const referenceNow = dayjs(date);
  const referenceDate = referenceNow.toDate();
  const moonEquatorialCoords: EquatorialCoordinate = getLunarEquatorialCoordinate(referenceDate)
  const moonHorizontalCoords: HorizontalCoordinate = convertEquatorialToHorizontal(referenceDate, observer, moonEquatorialCoords)
  const altitude: number = 341;
  const horizonAngle: number = calculateHorizonAngle(altitude);


  // Visibility infos calculation
  const isMoonCurrentlyVisible: boolean = isBodyAboveHorizon(referenceDate, observer, moonEquatorialCoords, horizonAngle)
  const isMoonVisibleThisNight: boolean = isBodyVisibleForNight(referenceDate, observer, moonEquatorialCoords, horizonAngle)

  const findNextHorizonCrossing = (direction: 'rise' | 'set'): Dayjs | null => {
    const stepMinutes = 5;
    const maxMinutes = 36 * 60;
    const startTime = referenceNow;
    let previousTime = startTime;
    let previousAlt = convertEquatorialToHorizontal(startTime.toDate(), observer, moonEquatorialCoords).alt;

    for (let minutes = stepMinutes; minutes <= maxMinutes; minutes += stepMinutes) {
      const currentTime = startTime.add(minutes, 'minute');
      const currentAlt = convertEquatorialToHorizontal(currentTime.toDate(), observer, moonEquatorialCoords).alt;

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

  const moonRise = getBodyNextRise(referenceDate, observer, moonEquatorialCoords, horizonAngle)
  const moonSet = getBodyNextSet(referenceDate, observer, moonEquatorialCoords, horizonAngle)


  let moonrise = i18n.t('common.errors.simple')
  let moonset = i18n.t('common.errors.simple')
  let moonRiseTime: Dayjs | null = null;
  let moonSetTime: Dayjs | null = null;

  if (isTransitInstance(moonRise)) {
    moonRiseTime = dayjs(moonRise.datetime);
  }

  if (isTransitInstance(moonSet)) {
    moonSetTime = dayjs(moonSet.datetime);
  }

  const scannedRise = findNextHorizonCrossing('rise');
  const scannedSet = findNextHorizonCrossing('set');

  if (scannedRise && (!moonRiseTime || scannedRise.isBefore(moonRiseTime))) {
    moonRiseTime = scannedRise;
  }

  if (scannedSet && (!moonSetTime || scannedSet.isBefore(moonSetTime))) {
    moonSetTime = scannedSet;
  }

  if (moonRiseTime) {
    moonrise = moonRiseTime.format('HH:mm').replace(':', 'h')
  }

  if (moonSetTime) {
    moonset = moonSetTime.format('HH:mm').replace(':', 'h')
  }

  // COMPUTE OBJECT VISIBILITY GRAPH.
  const objectAltitudes: number[] = [];
  const altitudesHours: string[] = [];
  const now: Dayjs = referenceNow
  const H: number = 6;
  for (let i = -H; i <= H; i++) {
    const date: Dayjs = now.add(i, 'hour');
    const horizontalCoords: HorizontalCoordinate = convertEquatorialToHorizontal(date.toDate(), observer, moonEquatorialCoords);
    objectAltitudes.push(horizontalCoords.alt);
    altitudesHours.push(date.format('HH:mm'));
  }

  const moonPhasesList: any = {
    "New": i18n.t('common.moon_phases.new'),
    "Waxing Crescent": i18n.t('common.moon_phases.waxing_crescent'),
    "First Quarter": i18n.t('common.moon_phases.first_quarter'),
    "Waxing Gibbous": i18n.t('common.moon_phases.waxing_gibbous'),
    "Full": i18n.t('common.moon_phases.full'),
    "Waning Gibbous": i18n.t('common.moon_phases.waning_gibbous'),
    "Last Quarter": i18n.t('common.moon_phases.last_quarter'),
    "Waning Crescent": i18n.t('common.moon_phases.waning_crescent'),
  }

  const lunarPhaseKey = getLunarPhase(referenceDate);
  const currentMoonPhase: string = moonPhasesList[lunarPhaseKey];
  const currentMoonIcon: ImageSourcePropType = moonIcons[lunarPhaseKey]
  const currentMoonAge: number =  Math.floor(getLunarAge(referenceDate).age);
  const currentMoonIllumination: number = getLunarIllumination(referenceDate)
  const currentMoonDistance: number = Math.floor(getLunarDistance(referenceDate) / 1000)
  const currentMoonElongation: number = Math.floor(getLunarElongation(referenceDate))
  const isCurrentlyNewMoon: boolean = isNewMoon(referenceDate)
  const isCurrentlyFullMoon: boolean = isFullMoon(referenceDate)
  const currentMoonAngularDiameter: number = getLunarAngularDiameter(referenceDate)
  const currentMoonPhaseAngle = getLunarPhaseAngle(referenceDate)

  const nextNewMoon = getNextNewMoon(referenceDate)
  const nextFullMoon = getNextFullMoon(referenceDate)

  return {
    base: {
      family: "Moon",
      common_name: i18n.t('common.objects.types.moon'),
      ra: moonEquatorialCoords.ra,
      dec: moonEquatorialCoords.dec,
      alt: moonHorizontalCoords.alt,
      az: moonHorizontalCoords.az,
      icon: currentMoonIcon
    },
    data: {
      phase: currentMoonPhase,
      illumination: currentMoonIllumination,
      distance: currentMoonDistance,
      elongation: currentMoonElongation,
      isNewMoon: isCurrentlyNewMoon,
      isFullMoon: isCurrentlyFullMoon,
      age: currentMoonAge,
      angularDiameter: currentMoonAngularDiameter,
      phaseAngle: currentMoonPhaseAngle,
      nextNewMoon: (nextNewMoon),
      nextFullMoon: nextFullMoon
    },
    visibility: {
      isCurrentlyVisible: isMoonCurrentlyVisible,
      isVisibleThisNight: isMoonVisibleThisNight,
      visibilityLabel: isMoonCurrentlyVisible ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible'),
      visibilityBackgroundColor: isMoonCurrentlyVisible ? app_colors.green_eighty : app_colors.red_eighty,
      visibilityForegroundColor: app_colors.white,
      visibilityIcon: isMoonCurrentlyVisible ? require('../../../../../assets/icons/FiEye.png') : require('../../../../../assets/icons/FiEyeOff.png'),
      objectNextRise: moonrise,
      objectNextSet: moonset,
      visibilityGraph: {
        altitudes: objectAltitudes,
        hours: altitudesHours
      }
    }
  }
}
