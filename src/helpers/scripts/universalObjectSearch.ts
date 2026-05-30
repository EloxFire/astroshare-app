import {GlobalPlanet} from "../types/GlobalPlanet";
import {Star} from "../types/Star";
import {DSO} from "../types/DSO";
import {SpecialSkyObject} from "../types/SpecialSkyObject";
import {planetNamesRegexes, solarSystemRegexes, solarBodyNamesRegex} from "./utils/regex/searchRegex";
import {astroImages, moonIcons} from "./loadImages";
import {getLunarPhase} from "@observerly/astrometry";
import {i18n} from "./i18n";
import axios from "axios";

const normalizeKey = (value: string) => value.toLowerCase().replace(/\s+/g, '');

export const universalObjectSearch = async (
  searchString: string,
  planets: GlobalPlanet[],
  starsCatalog?: Star[],
  dsoCatalog?: DSO[],
): Promise<{
  planetResults: (GlobalPlanet | SpecialSkyObject)[];
  starsResults: Star[];
  dsoResults: DSO[];
}> => {

  let planetResults: (GlobalPlanet | SpecialSkyObject)[] = [];
  let starsResults: Star[] = [];
  let dsoResults: DSO[] = [];
  const searchKey = normalizeKey(searchString);

  // ── Sun / Moon ────────────────────────────────────────────────────────────
  if (solarBodyNamesRegex.test(searchString)) {
    const isSun  = /\b(?:Sun|Soleil)\b/i.test(searchString);
    const isMoon = /\b(?:Moon|Lune)\b/i.test(searchString);

    if (isSun) {
      const sunStub: SpecialSkyObject = {
        family: 'Sun',
        name: i18n.t('common.planets.Sun'),
        ra: 0,
        dec: 0,
        icon: astroImages['SUN'],
        v_mag: -26.7,
      };
      planetResults = [sunStub];
    }

    if (isMoon) {
      const phase = getLunarPhase(new Date());
      const moonStub: SpecialSkyObject = {
        family: 'Moon',
        name: i18n.t('common.planets.Moon'),
        ra: 0,
        dec: 0,
        icon: moonIcons[phase] ?? moonIcons['Full'],
        phase,
        v_mag: -12.6,
      };
      planetResults = isSun ? [...planetResults, moonStub] : [moonStub];
    }

    return { planetResults, starsResults, dsoResults };
  }

  // Search for planets
  if (planetNamesRegexes.test(searchString)) {
    planetResults = planets.filter((planet: GlobalPlanet) => planet.name.toLowerCase() === searchString.toLowerCase());
  } else if (solarSystemRegexes.some(regex => regex.test(searchString))) {
    planetResults = planets;
  }

  // Search for stars
  if (starsCatalog && starsCatalog.length) {
    starsResults = starsCatalog.filter((star) => normalizeKey(String(star.ids)).includes(searchKey)).slice(0, 50);
  } else {
    try {
      const starsResponse = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stars/` + searchString);
      starsResults = starsResponse.data.data;
    } catch (error) {
      console.error("Error fetching stars:", error);
      starsResults = [];
    }
  }

  // Search for DSOs
  if (dsoCatalog && dsoCatalog.length) {
    dsoResults = dsoCatalog.filter((dso) => {
      // Direct Messier number match: "m42" → dso.m === 42
      const mNum = dso.m !== '' && dso.m != null ? String(dso.m) : null
      const messierMatch = mNum != null && (
        searchKey === `m${mNum}` ||
        searchKey === `messier${mNum}`
      )
      // Direct NGC number match: "ngc1976" → dso.ngc === 1976
      const ngcNum = dso.ngc !== '' && dso.ngc != null ? String(dso.ngc) : null
      const ngcMatch = ngcNum != null && searchKey === `ngc${ngcNum}`
      // Direct IC number match
      const icNum = dso.ic !== '' && dso.ic != null ? String(dso.ic) : null
      const icMatch = icNum != null && searchKey === `ic${icNum}`

      return messierMatch
        || ngcMatch
        || icMatch
        || normalizeKey(dso.name).includes(searchKey)
        || normalizeKey(dso.common_names || '').includes(searchKey)
        || normalizeKey(dso.identifiers || '').includes(searchKey);
    }).slice(0, 50);
  } else {
    try {
      const dsosResponse = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/search?search=` + searchString);
      dsoResults = dsosResponse.data.data;
    } catch (error) {
      console.error("Error fetching DSOs:", error);
      dsoResults = [];
    }
  }

  return { planetResults, starsResults, dsoResults };
}
