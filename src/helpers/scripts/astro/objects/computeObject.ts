import {DSO} from "../../../types/DSO";
import {Star} from "../../../types/Star";
import {GlobalPlanet} from "../../../types/GlobalPlanet";
import {getObjectFamily} from "./getObjectFamily";
import {convertHMSToDegreeFromString} from "../HmsToDegree";
import {convertDMSToDegreeFromString} from "../DmsToDegree";
import {calculateHorizonAngle} from "../calculateHorizonAngle";
import {
  Constellation,
  convertEquatorialToHorizontal,
  EquatorialCoordinate,
  GeographicCoordinate,
  getBodyNextRise,
  getBodyNextSet,
  getConstellation,
  getLunarEquatorialCoordinate,
  HorizontalCoordinate,
  isBodyAboveHorizon,
  isBodyCircumpolar,
  isBodyVisibleForNight,
  isTransitInstance,
  TransitInstance
} from "@observerly/astrometry";
import {ComputedObjectInfos} from "../../../types/objects/ComputedObjectInfos";
import {app_colors} from "../../../constants";
import dayjs, {Dayjs} from "dayjs";
import {i18n} from "../../i18n";
import {formatCelsius, formatKm, formatYears} from "../../utils/formatters/formaters";
import {getPlanetPosition} from "./getPlanetPosition";
import {planetsSizes} from "../planets/sizes";
import {planetTemps} from "../planets/temps";
import {planetSatellites} from "../planets/satellites";
import {getPlanetMagnitude} from "./getPlanetMagnitude";
import {getBrightStarName} from "./getBrightStarName";
import {getObjectIcon} from "./getObjectIcon";
import {ImageSourcePropType} from "react-native";
import {getObjectType} from "./getObjectType";
import {getObjectName} from "./getObjectName";
import { getConstellationName } from "../../getConstellationName";
import {getSunData} from "../solar/sunData";
import {SpecialSkyObject} from "../../../types/SpecialSkyObject";

// ─── Compute cache (DSO + Star only — static objects) ────────────────────────

type _CacheEntry = { infos: ComputedObjectInfos; expiresAt: number };
const _computeCache = new Map<string, _CacheEntry>();
const _CACHE_TTL_MS = 30 * 60 * 1000;

function _cacheKey(family: string, id: string, lat: number, lon: number, date: Date): string {
  const hour = Math.floor(date.getTime() / 3_600_000);
  return `${family}:${id}:${lat.toFixed(1)}:${lon.toFixed(1)}:${hour}`;
}

// ─────────────────────────────────────────────────────────────────────────────

interface ComputeObjectProps {
  object: DSO | Star | GlobalPlanet | SpecialSkyObject;
  observer: GeographicCoordinate;
  lang: string;
  altitude?: number;
  date?: Dayjs;
  /** Skip expensive rise/set scan and visibility graph — ideal for list cards */
  light?: boolean;
}

const isSpecialSkyObject = (object: any): object is SpecialSkyObject => {
  return object?.family === 'Sun' || object?.family === 'Moon';
};

const normalizeAmbiguousRightAscension = (ra: number, dec: number, constellationHint?: string): number => {
  if (ra < 0 || ra > 24 || !constellationHint) return ra;

  const asHours = ra * 15;
  const rawConstellation = getConstellation({ra, dec})?.abbreviation;
  const hoursConstellation = getConstellation({ra: asHours, dec})?.abbreviation;

  return rawConstellation !== constellationHint && hoursConstellation === constellationHint ? asHours : ra;
};

export const computeObject = (props: ComputeObjectProps): ComputedObjectInfos | null => {
  const referenceNow = props.date && props.date.isValid() ? props.date : dayjs();
  const referenceDate = referenceNow.toDate();
  const localOffsetMinutes = referenceNow.utcOffset();
  const alt: number = props.altitude ?? 341;
  const horizonAngle: number = calculateHorizonAngle(alt);

  if(!props.object){
    console.log('[computeObject] Error: object is null')
    return null;
  }else{
    if (isSpecialSkyObject(props.object)) {
      if (props.object.family === 'Sun') {
        const sunInfos = getSunData(referenceNow, props.observer);

        return {
          base: {
            family: 'Planet',
            type: 'Sun',
            rawType: 'Sun',
            name: sunInfos.base.name,
            constellation: sunInfos.base.constellation,
            otherName: undefined,
            icon: sunInfos.base.icon,
            ra: sunInfos.base.ra,
            dec: sunInfos.base.dec,
            degRa: sunInfos.base.ra,
            degDec: sunInfos.base.dec,
            v_mag: -26,
            b_mag: undefined,
            j_mag: undefined,
            k_mag: undefined,
            h_mag: undefined,
            alt: sunInfos.base.alt.toFixed(2) + '°',
            az: Math.round(sunInfos.base.az) + '°',
          },
          visibilityInfos: {
            isCurrentlyVisible: sunInfos.visibility.isCurrentlyVisible,
            isCircumpolar: false,
            isVisibleThisNight: sunInfos.visibility.isVisibleToday,
            visibilityLabel: sunInfos.visibility.visibilityLabel,
            visibilityBackgroundColor: sunInfos.visibility.visibilityBackgroundColor,
            visibilityForegroundColor: sunInfos.visibility.visibilityForegroundColor,
            visibilityIcon: sunInfos.visibility.visibilityIcon,
            objectNextRise: sunInfos.visibility.sunrise,
            objectNextSet: sunInfos.visibility.sunset,
            nakedEye: {
              label: i18n.t('common.visibility.visible'),
              icon: require('../../../../../assets/icons/FiEye.png'),
              backgroundColor: app_colors.green_eighty,
              foregroundColor: app_colors.white,
            },
            binoculars: {
              label: i18n.t('common.visibility.visible'),
              icon: require('../../../../../assets/icons/FiEye.png'),
              backgroundColor: app_colors.green_eighty,
              foregroundColor: app_colors.white,
            },
            telescope: {
              label: i18n.t('common.visibility.visible'),
              icon: require('../../../../../assets/icons/FiEye.png'),
              backgroundColor: app_colors.green_eighty,
              foregroundColor: app_colors.white
            },
            visibilityGraph: sunInfos.visibility.visibilityGraph
          },
          dsoAdditionalInfos: undefined,
          planetAdditionalInfos: undefined,
          error: '',
        };
      }

      // For the Moon, always recompute ra/dec from the reference date so the
      // displayed position is accurate regardless of when the search stub was built.
      const target: EquatorialCoordinate = props.object.family === 'Moon'
        ? getLunarEquatorialCoordinate(referenceDate)
        : { ra: props.object.ra, dec: props.object.dec };
      const objectConstellation: Constellation | undefined = getConstellation(target);
      const localizedConstellationName: string = objectConstellation ? getConstellationName(objectConstellation.abbreviation) : 'N/A';
      const isCurrentlyVisible: boolean = isBodyAboveHorizon(referenceDate, props.observer, target, horizonAngle);
      const isVisibleThisNight: boolean = isBodyVisibleForNight(referenceDate, props.observer, target, horizonAngle);
      const currentHorizontal = convertEquatorialToHorizontal(referenceDate, props.observer, target);
      const objectCurrentAltitude: number = currentHorizontal.alt;
      const objectCurrentAzimuth: number = currentHorizontal.az;

      const findNextHorizonCrossing = (direction: 'rise' | 'set'): Dayjs | null => {
        const stepMinutes = 5;
        const maxMinutes = 36 * 60;
        const startTime = referenceNow;
        let previousTime = startTime;
        let previousAlt = convertEquatorialToHorizontal(startTime.toDate(), props.observer, target).alt;

        for (let minutes = stepMinutes; minutes <= maxMinutes; minutes += stepMinutes) {
          const currentTime = startTime.add(minutes, 'minute');
          const currentAlt = convertEquatorialToHorizontal(currentTime.toDate(), props.observer, target).alt;

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
      };

      const nextRise: false | TransitInstance = getBodyNextRise(referenceDate, props.observer, target, horizonAngle);
      const nextSet: boolean | TransitInstance = getBodyNextSet(referenceDate, props.observer, target, horizonAngle);

      let objectNextRise: Dayjs | null = isTransitInstance(nextRise) ? dayjs(nextRise.datetime).add(localOffsetMinutes, 'minute') : null;
      let objectNextSet: Dayjs | null = isTransitInstance(nextSet) ? dayjs(nextSet.datetime).add(localOffsetMinutes, 'minute') : null;

      const scannedRise = findNextHorizonCrossing('rise');
      const scannedSet = findNextHorizonCrossing('set');

      if (scannedRise && (!objectNextRise || scannedRise.isBefore(objectNextRise))) {
        objectNextRise = scannedRise;
      }

      if (scannedSet && (!objectNextSet || scannedSet.isBefore(objectNextSet))) {
        objectNextSet = scannedSet;
      }

      const objectAltitudes: number[] = [];
      const altitudesHours: string[] = [];
      const H: number = 6;
      let graphCurrentHorizontal: HorizontalCoordinate | null = null;
      for (let i = -H; i <= H; i++) {
        const date: Dayjs = referenceNow.add(i, 'hour');
        const horizontalCoords: HorizontalCoordinate = convertEquatorialToHorizontal(date.toDate(), props.observer, target);
        if (i === 0) {
          graphCurrentHorizontal = horizontalCoords;
        }
        objectAltitudes.push(horizontalCoords.alt);
        altitudesHours.push(date.format('HH:mm'));
      }
      const displayedCurrentAltitude = graphCurrentHorizontal?.alt ?? objectCurrentAltitude;
      const displayedCurrentAzimuth = graphCurrentHorizontal?.az ?? objectCurrentAzimuth;

      const magnitude = props.object.v_mag ?? -12;

      const visibilityLabel = isCurrentlyVisible ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible');
      const visibilityBackgroundColor = isCurrentlyVisible ? app_colors.green_eighty : app_colors.red_eighty;

      const badgeForMagnitude = (limit: number) => {
        const visible = magnitude < limit;
        return {
          label: visible ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible'),
          icon: require('../../../../../assets/icons/FiEye.png'),
          backgroundColor: visible ? app_colors.green_eighty : app_colors.red_eighty,
          foregroundColor: app_colors.white,
        };
      };

      return {
        base: {
          family: 'Planet',
          type: props.object.family,
          rawType: props.object.family,
          name: props.object.name,
          otherName: props.object.family === 'Moon' ? props.object.phase : undefined,
          constellation: localizedConstellationName,
          icon: props.object.icon,
          // Use the resolved target coordinates (recomputed from date for Moon)
          // rather than the zeroed-out stub values.
          ra: target.ra,
          dec: target.dec,
          degRa: target.ra,
          degDec: target.dec,
          v_mag: magnitude,
          b_mag: undefined,
          j_mag: undefined,
          k_mag: undefined,
          h_mag: undefined,
          alt: displayedCurrentAltitude.toFixed(2) + '°',
          az: Math.round(displayedCurrentAzimuth) + '°',
        },
        visibilityInfos: {
          isCurrentlyVisible: isCurrentlyVisible,
          isCircumpolar: false,
          isVisibleThisNight: isVisibleThisNight,
          visibilityLabel: visibilityLabel,
          visibilityBackgroundColor: visibilityBackgroundColor,
          visibilityForegroundColor: app_colors.white,
          visibilityIcon: isCurrentlyVisible ? require('../../../../../assets/icons/FiEye.png') : require('../../../../../assets/icons/FiEyeOff.png'),
          objectNextRise: objectNextRise,
          objectNextSet: objectNextSet,
          nakedEye: badgeForMagnitude(6),
          binoculars: badgeForMagnitude(10),
          telescope: {
            label: i18n.t('common.visibility.visible'),
            icon: require('../../../../../assets/icons/FiEye.png'),
            backgroundColor: app_colors.green_eighty,
            foregroundColor: app_colors.white
          },
          visibilityGraph: {
            altitudes: objectAltitudes,
            hours: altitudesHours
          }
        },
        dsoAdditionalInfos: undefined,
        planetAdditionalInfos: undefined,
        error: '',
      };
    }

    const objectFamily: "DSO" | "Star" | "Planet" | "Other" = getObjectFamily(props.object);

    // Cache check (non-light, static objects only)
    if (!props.light && (objectFamily === 'DSO' || objectFamily === 'Star')) {
      const _id = objectFamily === 'DSO' ? (props.object as DSO).name : (props.object as Star).ids;
      const _key = _cacheKey(objectFamily, _id, props.observer.latitude, props.observer.longitude, referenceDate);
      const _hit = _computeCache.get(_key);
      if (_hit && Date.now() < _hit.expiresAt) return _hit.infos;
    }


    let degDec: number = objectFamily === 'DSO' ? convertDMSToDegreeFromString(props.object.dec as string) : props.object.dec as number
    let degRa: number = objectFamily === 'DSO'
      ? normalizeAmbiguousRightAscension(
        convertHMSToDegreeFromString(props.object.ra as string),
        degDec,
        (props.object as DSO).const
      )
      : props.object.ra as number

    if(!Number.isFinite(degRa) || !Number.isFinite(degDec)) {
      console.log('[computeObject] Error: could not convert ra and dec to degrees')
      return null;
    }

    const objectConstellation: Constellation | undefined = getConstellation({ra: degRa, dec: degDec});
    const localizedConstellationName: string = objectConstellation ? getConstellationName(objectConstellation.abbreviation) : 'N/A';

    let objectName: string = '';
    if(objectFamily === 'DSO'){
      objectName = getObjectName(props.object as DSO, 'all', true);
    }else if (objectFamily === 'Star'){
      objectName = getBrightStarName((props.object as Star).ids);
    }else if (objectFamily === 'Planet'){
      objectName = (props.object as GlobalPlanet).name;
    }else {
      objectName = 'Unknown object';
    }

    let objectOtherName: string | undefined;
    if(objectFamily === 'DSO') {
      objectOtherName = (props.object as DSO).common_names.split(',')[0].trim();
    } else if (objectFamily === 'Star') {
      objectOtherName = undefined
    } else if (objectFamily === 'Planet') {
      objectOtherName = undefined;
    }

    let objectIcon: ImageSourcePropType = getObjectIcon(props.object);
    let objectType: string = getObjectType(props.object)

    // VISIBILITE ACTUELLE ET POUR LA NUIT
    const target: EquatorialCoordinate = {ra: degRa, dec: degDec}
    const isCurrentlyVisible: boolean = isBodyAboveHorizon(referenceDate, props.observer, target, horizonAngle)
    const isVisibleThisNight: boolean = isBodyVisibleForNight(referenceDate, props.observer, target, horizonAngle)
    const isObjectCircumpolar: boolean = isBodyCircumpolar(props.observer, target, horizonAngle);
    const currentHorizontal = convertEquatorialToHorizontal(referenceDate, props.observer, target);
    const objectCurrentAltitude: number = currentHorizontal.alt;
    const objectCurrentAzimuth: number = currentHorizontal.az;


    // CALCUL HEURES DE LEVER ET COUCHER
    let objectNextRise: Dayjs | null = null;
    let objectNextSet: Dayjs | null = null;
    const findNextHorizonCrossing = (direction: 'rise' | 'set'): Dayjs | null => {
      const stepMinutes = 5;
      const maxMinutes = 36 * 60; // search up to 36h ahead
      const startTime = referenceNow;
      let previousTime = startTime;
      let previousAlt = convertEquatorialToHorizontal(startTime.toDate(), props.observer, target).alt;

      for (let minutes = stepMinutes; minutes <= maxMinutes; minutes += stepMinutes) {
        const currentTime = startTime.add(minutes, 'minute');
        const currentAlt = convertEquatorialToHorizontal(currentTime.toDate(), props.observer, target).alt;

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
    

    if (!props.light && !isObjectCircumpolar) {
      const nextRise: false | TransitInstance = getBodyNextRise(referenceDate, props.observer, target, horizonAngle);
      const nextSet: boolean | TransitInstance = getBodyNextSet(referenceDate, props.observer, target, horizonAngle);

      if(isTransitInstance(nextRise)){
        objectNextRise = dayjs(nextRise.datetime).add(localOffsetMinutes, 'minute');
      }

      if(isTransitInstance(nextSet)){
        objectNextSet = dayjs(nextSet.datetime).add(localOffsetMinutes, 'minute');
      }

      const scannedRise = findNextHorizonCrossing('rise');
      const scannedSet = findNextHorizonCrossing('set');

      if(scannedRise && (!objectNextRise || scannedRise.isBefore(objectNextRise))){
        objectNextRise = scannedRise;
      }

      if(scannedSet && (!objectNextSet || scannedSet.isBefore(objectNextSet))){
        objectNextSet = scannedSet;
      }
    }

    // GESTION MAGNITUDE SELON TYPE D'OBJET
    let objectMagnitude: {v: number | undefined, b: number | undefined, j: number | undefined, k: number | undefined, h: number | undefined} = {v: 0, b: 0, j: 0, k: 0, h: 0};
    switch (objectFamily) {
      case "DSO":
        objectMagnitude = {
          v: typeof (props.object as DSO).v_mag === 'string' ? undefined : (props.object as DSO).v_mag as number,
          b: typeof (props.object as DSO).b_mag === 'string' ? undefined : (props.object as DSO).b_mag as number,
          j: typeof (props.object as DSO).j_mag === 'string' ? undefined : (props.object as DSO).j_mag as number,
          k: typeof (props.object as DSO).k_mag === 'string' ? undefined : (props.object as DSO).k_mag as number,
          h: typeof (props.object as DSO).h_mag === 'string' ? undefined : (props.object as DSO).h_mag as number,
        }
        break;
      case "Star":
        objectMagnitude = {
          v: (props.object as Star).V,
          b: undefined,
          j: undefined,
          k: undefined,
          h: undefined,
        }
        break;
      case "Planet":
        objectMagnitude = {
          v: getPlanetMagnitude((props.object as GlobalPlanet).name),
          b: undefined,
          j: undefined,
          k: undefined,
          h: undefined,
        }
        break;
    }

    // GESTION BADGES VISIBILITE INSTRUMENTS
    const nakedEyesVisibilityInfos = {
      label: objectMagnitude.v ? objectMagnitude.v < 6 ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible') : i18n.t('common.errors.unknown'),
      icon: require('../../../../../assets/icons/FiEye.png'),
      backgroundColor: objectMagnitude.v ? objectMagnitude.v < 6 ? app_colors.green_eighty : app_colors.red_eighty : app_colors.white_eighty,
      foregroundColor: app_colors.white
    }

    const binocularsVisibilityInfos = {
      label: objectMagnitude.v ? objectMagnitude.v < 10 ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible') : i18n.t('common.errors.unknown'),
      icon: require('../../../../../assets/icons/FiEye.png'),
      backgroundColor: objectMagnitude.v ? objectMagnitude.v < 10 ? app_colors.green_eighty : app_colors.red_eighty : app_colors.white_eighty,
      foregroundColor: app_colors.white
    }

    const telescopeVisibilityInfos = {
      label: i18n.t('common.visibility.visible'),
      icon: require('../../../../../assets/icons/FiEye.png'),
      backgroundColor: app_colors.green_eighty,
      foregroundColor: app_colors.white
    }


    // COMPUTE OBJECT VISIBILITY GRAPH (skipped in light mode)
    let displayedCurrentAltitude = objectCurrentAltitude;
    let displayedCurrentAzimuth = objectCurrentAzimuth;
    let objectAltitudes: number[] = [];
    let altitudesHours: string[] = [];
    if (!props.light) {
      const now: Dayjs = referenceNow;
      const H: number = 6;
      for (let i = -H; i <= H; i++) {
        const date: Dayjs = now.add(i, 'hour');
        const horizontalCoords: HorizontalCoordinate = convertEquatorialToHorizontal(date.toDate(), props.observer, target);
        if (i === 0) {
          displayedCurrentAltitude = horizontalCoords.alt;
          displayedCurrentAzimuth = horizontalCoords.az;
        }
        objectAltitudes.push(horizontalCoords.alt);
        altitudesHours.push(date.format('HH:mm'));
      }
    }


    // GESTION DES INFORMATIONS SUPLÉMENTAIRES (si dispo)
    // Seul les DSO ont des infos supplémentaires
    let dsoAdditionalInfos: ComputedObjectInfos['dsoAdditionalInfos'] = undefined;
    if(!props.light && objectFamily === 'DSO') {
      dsoAdditionalInfos = {
        image: (props.object as DSO).image_url !== "" ? {uri: (props.object as DSO).image_url} : require('../../../../../assets/icons/astro/OTHER.png'),
        distance: (props.object as DSO).distance ? `${(props.object as DSO).distance} ${(props.object as DSO).dist_unit}` : 'N/A',
        dimensions: (props.object as DSO).dimensions || 'N/A',
        discovered_by: (props.object as DSO).discovered_by || 'N/A',
        discovery_year: (props.object as DSO).discovery_year || 'N/A',
        apparent_size: (props.object as DSO).apparent_size || 'N/A',
        age: formatYears((props.object as DSO).age, props.lang)
      }
    }

    let planetAdditionalInfos: ComputedObjectInfos['planetAdditionalInfos'] = undefined;
    if(!props.light && objectFamily === 'Planet') {
      planetAdditionalInfos = {
        symbol: (props.object as GlobalPlanet).symbol,
        solarSystemPosition: getPlanetPosition((props.object as GlobalPlanet).name) + '/8',
        inclination: (props.object as GlobalPlanet).i.toFixed(2) + '°',
        mass: (props.object as GlobalPlanet).name === 'Earth' ? (9.972e24 + " Kg").toString() : (props.object as GlobalPlanet).m.toFixed(2) + i18n.t('detailsPages.planets.units.mass'),
        orbitalPeriod: (props.object as GlobalPlanet).name === 'Earth' ? "365.25 jours" : (props.object as GlobalPlanet).T.toFixed(2) + " " + i18n.t('detailsPages.planets.units.orbitalPeriod'),
        distanceToSun: (props.object as GlobalPlanet).a.toFixed(2) + " " + i18n.t('detailsPages.planets.units.distanceSun'),
        diameter: formatKm(planetsSizes[(props.object as GlobalPlanet).name.toUpperCase()], props.lang).toString(),
        surfaceTemperature: formatCelsius(planetTemps[(props.object as GlobalPlanet).name.toUpperCase()], props.lang).toString(),
        naturalSatellites: planetSatellites[(props.object as GlobalPlanet).name.toUpperCase()]
      }
    }



    const _result: ComputedObjectInfos = {
      base: {
        family: objectFamily,
        type: objectType,
        rawType: objectFamily === 'DSO' ? (props.object as DSO).type : objectFamily === 'Star' ? 'Star' : objectFamily === 'Planet' ? 'Planet' : 'Other',
        name: objectName,
        constellation: localizedConstellationName,
        otherName: objectOtherName,
        icon: objectIcon,
        ra: props.object.ra,
        dec: props.object.dec,
        degRa: degRa,
        degDec: degDec,
        v_mag: objectMagnitude.v,
        b_mag: objectMagnitude.b,
        j_mag: objectMagnitude.j,
        k_mag: objectMagnitude.k,
        h_mag: objectMagnitude.h,
        alt: displayedCurrentAltitude.toFixed(2) + '°',
        az: Math.round(displayedCurrentAzimuth) + '°',
      },
      visibilityInfos: {
        isCurrentlyVisible: isCurrentlyVisible,
        isCircumpolar: isObjectCircumpolar,
        isVisibleThisNight: isVisibleThisNight,
        visibilityLabel: isCurrentlyVisible ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible'),
        objectNextRise: objectNextRise,
        objectNextSet: objectNextSet,
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
      dsoAdditionalInfos: dsoAdditionalInfos,
      planetAdditionalInfos: planetAdditionalInfos,
      error: '',
    };

    // Cache static objects for 30 min (non-light only)
    if (!props.light && (objectFamily === 'DSO' || objectFamily === 'Star')) {
      const _id = objectFamily === 'DSO' ? (props.object as DSO).name : (props.object as Star).ids;
      const _key = _cacheKey(objectFamily, _id, props.observer.latitude, props.observer.longitude, referenceDate);
      if (_computeCache.size >= 400) _computeCache.delete(_computeCache.keys().next().value!);
      _computeCache.set(_key, { infos: _result, expiresAt: Date.now() + _CACHE_TTL_MS });
    }

    return _result;
  }
}
