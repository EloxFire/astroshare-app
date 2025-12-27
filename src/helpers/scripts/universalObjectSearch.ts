import {GlobalPlanet} from "../types/GlobalPlanet";
import {Star} from "../types/Star";
import {DSO} from "../types/DSO";
import {planetNamesRegexes, solarSystemRegexes} from "./utils/regex/searchRegex";
import axios from "axios";

const normalizeKey = (value: string) => value.toLowerCase().replace(/\s+/g, '');

export const universalObjectSearch = async (searchString: string, planets: GlobalPlanet[], starsCatalog?: Star[], dsoCatalog?: DSO[]) => {

  let planetResults: GlobalPlanet[] = [];
  let starsResults: Star[] = [];
  let dsoResults: DSO[] = [];
  const searchKey = normalizeKey(searchString);

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
      return normalizeKey(dso.name).includes(searchKey)
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
