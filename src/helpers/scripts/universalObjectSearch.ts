import {GlobalPlanet} from "../types/GlobalPlanet";
import {Star} from "../types/Star";
import {DSO} from "../types/DSO";
import {planetNamesRegexes, solarSystemRegexes} from "./utils/regex/searchRegex";
import axios from "axios";

export const universalObjectSearch = async (searchString: string, planets: GlobalPlanet[]) => {

  let planetResults: GlobalPlanet[] = [];
  let starsResults: Star[] = [];
  let dsoResults: DSO[] = [];

  // Search for planets
  if (planetNamesRegexes.test(searchString)) {
    planetResults = planets.filter((planet: GlobalPlanet) => planet.name.toLowerCase() === searchString.toLowerCase());
  } else if (solarSystemRegexes.some(regex => regex.test(searchString))) {
    planetResults = planets;
  }

  // Search for stars
  try {
    const starsResponse = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stars/` + searchString);
    starsResults = starsResponse.data.data;
  } catch (error) {
    console.error("Error fetching stars:", error);
    starsResults = [];
  }

  // Search for DSOs
  try {
    const dsosResponse = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/search?search=` + searchString);
    dsoResults = dsosResponse.data.data;
  } catch (error) {
    console.error("Error fetching DSOs:", error);
    dsoResults = [];
  }

  return { planetResults, starsResults, dsoResults };
}