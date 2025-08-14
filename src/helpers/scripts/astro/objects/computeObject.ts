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
  GeographicCoordinate, getBodyNextRise, getBodyNextSet, HorizontalCoordinate,
  isBodyAboveHorizon, isBodyCircumpolar, isBodyVisibleForNight, isTransitInstance, TransitInstance
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

interface ComputeObjectProps {
  object: DSO | Star | GlobalPlanet;
  observer: GeographicCoordinate;
  lang: string;
  altitude?: number;
}

export const computeObject = (props: ComputeObjectProps): ComputedObjectInfos | null => {
  if(!props.object){
    console.log('[computeObject] Error: object is null')
    return null;
  }else{
    console.log(`[computeObject] Object type: ${typeof props.object}`);
    const objectFamily: "DSO" | "Star" | "Planet" | "Other" = getObjectFamily(props.object);
    const alt: number = props.altitude ? props.altitude : 341;
    const horizonAngle: number = calculateHorizonAngle(alt);


    let degRa: number = objectFamily === 'DSO' ? convertHMSToDegreeFromString(props.object.ra as string) : props.object.ra as number
    let degDec: number = objectFamily === 'DSO' ? convertDMSToDegreeFromString(props.object.dec as string) : props.object.dec as number

    if(!degRa || !degDec) {
      console.log('[computeObject] Error: could not convert ra and dec to degrees')
      return null;
    }

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
    const isCurrentlyVisible: boolean = isBodyAboveHorizon(new Date(), props.observer, target, horizonAngle)
    const isVisibleThisNight: boolean = isBodyVisibleForNight(new Date(), props.observer, target, horizonAngle)
    const isObjectCircumpolar: boolean = isBodyCircumpolar(props.observer, target, horizonAngle);
    const objectCurrentAltitude: number = convertEquatorialToHorizontal(new Date(), props.observer, target).alt;
    const objectCurrentAzimuth: number = convertEquatorialToHorizontal(new Date(), props.observer, target).az;


    // CALCUL HEURES DE LEVER ET COUCHER
    let objectNextRise: Dayjs | null = null;
    let objectNextSet: Dayjs | null = null;
    if(!isObjectCircumpolar) {
      const nextRise: false | TransitInstance = getBodyNextRise(new Date(), props.observer, target, horizonAngle);
      const nextSet: boolean | TransitInstance = getBodyNextSet(new Date(), props.observer, target, horizonAngle);

      if(isTransitInstance(nextRise)){
        objectNextRise = dayjs(nextRise.datetime);
      }

      if(isTransitInstance(nextSet)){
        objectNextSet = dayjs(nextSet.datetime);
      }
    }

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
        objectMagnitude = getPlanetMagnitude((props.object as GlobalPlanet).name);
        break;
      default:
        objectMagnitude = 10000;
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
    const now: Dayjs = dayjs()
    const H: number = 6; // Number of hours to compute visibility graph
    for (let i = -H; i <= H; i++) {
      const date: Dayjs = now.add(i, 'hour');
      const horizontalCoords: HorizontalCoordinate = convertEquatorialToHorizontal(date.toDate(), props.observer, target);
      objectAltitudes.push(horizontalCoords.alt);
      altitudesHours.push(date.format('HH:mm'));
    }


    // GESTION DES INFORMATIONS SUPLÉMENTAIRES (si dispo)
    // Seul les DSO ont des infos supplémentaires
    let dsoAdditionalInfos: ComputedObjectInfos['dsoAdditionalInfos'] = undefined;
    if(objectFamily === 'DSO') {
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
    if(objectFamily === 'Planet') {
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



    return {
      base: {
        family: objectFamily,
        type: objectType,
        name: objectName,
        otherName: objectOtherName,
        icon: objectIcon,
        ra: props.object.ra,
        dec: props.object.dec,
        degRa: degRa,
        degDec: degDec,
        mag: objectFamily === 'Planet' ? objectMagnitude + ' (max)' : objectMagnitude,
        alt: objectCurrentAltitude.toFixed(2) + '°',
        az: Math.round(objectCurrentAzimuth) + '°',
      },
      visibilityInfos: {
        isCurrentlyVisible: isCurrentlyVisible,
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
    }
  }
}
