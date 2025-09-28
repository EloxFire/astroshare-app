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
  const moonEquatorialCoords: EquatorialCoordinate = getLunarEquatorialCoordinate(date)
  const moonHorizontalCoords: HorizontalCoordinate = convertEquatorialToHorizontal(date, observer, moonEquatorialCoords)
  const altitude: number = 341;
  const horizonAngle: number = calculateHorizonAngle(altitude);


  // Visibility infos calculation
  const isMoonCurrentlyVisible: boolean = isBodyAboveHorizon(date, observer, moonEquatorialCoords, horizonAngle)
  const isMoonVisibleThisNight: boolean = isBodyVisibleForNight(date, observer, moonEquatorialCoords, horizonAngle)

  const moonRise = getBodyNextRise(date, observer, moonEquatorialCoords, horizonAngle)
  const moonSet = getBodyNextSet(date, observer, moonEquatorialCoords, horizonAngle)


  let moonrise = i18n.t('common.errors.simple')
  let moonset = i18n.t('common.errors.simple')
  if (isTransitInstance(moonRise) && isTransitInstance(moonSet)) {
    moonrise = dayjs(moonRise.datetime).add(2, 'h').format('HH:mm').replace(':', 'h') //.isBefore(dayjs(moonRise.datetime)) ? moonrise = "Déjà\nlevée" : moonrise = dayjs(moonRise.datetime).add(2, 'h').format('HH:mm').replace(':', 'h')
    moonset = dayjs(moonSet.datetime).add(2, 'h').format('HH:mm').replace(':', 'h')
  }

  // COMPUTE OBJECT VISIBILITY GRAPH.
  const objectAltitudes: number[] = [];
  const altitudesHours: string[] = [];
  const now: Dayjs = dayjs()
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

  const currentMoonPhase: string = moonPhasesList[getLunarPhase(date)];
  const currentMoonIcon: ImageSourcePropType = moonIcons[getLunarPhase(date)]
  const currentMoonAge: number =  Math.floor(getLunarAge(date).age);
  const currentMoonIllumination: number = getLunarIllumination(date)
  const currentMoonDistance: number = Math.floor(getLunarDistance(date) / 1000)
  const currentMoonElongation: number = Math.floor(getLunarElongation(date))
  const isCurrentlyNewMoon: boolean = isNewMoon(date)
  const isCurrentlyFullMoon: boolean = isFullMoon(date)
  const currentMoonAngularDiameter: number = getLunarAngularDiameter(date)
  const currentMoonPhaseAngle = getLunarPhaseAngle(date)

  const nextNewMoon = getNextNewMoon(date)
  const nextFullMoon = getNextFullMoon(date)

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