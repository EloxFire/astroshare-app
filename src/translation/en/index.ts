import { weatherTranslation } from "../fr/screens/weather";
import { commonTranslations } from "./common/common";
import { resultCardsTranslations } from "./components/cards/resultCards";
import { homeSearchModuleTranslations } from "./components/forms/homeSearchModule";
import { locationHeaderTranslations } from "./components/locationHeader";
import { locationModalTranslations } from "./components/locationModal";
import { ephemerisBarTranslation } from "./components/weather/ephemerisBar";
import { hourlyOverviewTranslation } from "./components/weather/hourlyOverview";
import { homeTranslations } from "./screens/home";
import { languageSelection } from "./screens/languageSelection";
import { moonPhasesTranslation } from "./screens/moonPhases";
import { satelliteTrackerTranslations } from "./screens/satelliteTracker";
import { scopeAlignmentTranslation } from "./screens/scopeAlignment";
import { settingsTranslations } from "./screens/settings";
import { skymapGeneratorTranslations } from "./screens/skymapGenerator";
import { solarWeatherTranslations } from "./screens/solarWeather";
import { tutorialScreen } from "./screens/tutorialScreen";
import { viewpointsManagerTranslations } from "./screens/viewpointsManager";

export const enTranslations = {
  common: commonTranslations,
  home: homeTranslations,
  settings: settingsTranslations,
  locationModal: locationModalTranslations,
  locationHeader: locationHeaderTranslations,
  homeSearchModule: homeSearchModuleTranslations,
  languageSelection: languageSelection,
  tutorialScreen: tutorialScreen,
  weather: weatherTranslation,
  weather_hourly_overview: hourlyOverviewTranslation,
  ephemerisBar: ephemerisBarTranslation,
  scopeAlignment: scopeAlignmentTranslation,
  moonPhases: moonPhasesTranslation,
  solarWeather: solarWeatherTranslations,
  satelliteTracker: satelliteTrackerTranslations,
  skymapGenerator: skymapGeneratorTranslations,
  viewpointsManager: viewpointsManagerTranslations,
  resultCards: resultCardsTranslations,
}