import { tutorialScreen } from "../en/screens/tutorialScreen";
import { commonTranslations } from "./common/common";
import { homeSearchModuleTranslations } from "./components/forms/homeSearchModule";
import { locationHeaderTranslations } from "./components/locationHeader";
import { locationModalTranslations } from "./components/locationModal";
import { ephemerisBarTranslation } from "./components/weather/ephemerisBar";
import { hourlyOverviewTranslation } from "./components/weather/hourlyOverview";
import { homeTranslations } from "./screens/home";
import { languageSelection } from "./screens/languageSelection";
import { scopeAlignmentTranslation } from "./screens/scopeAlignment";
import { settingsTranslations } from "./screens/settings";
import { weatherTranslation } from "./screens/weather";

export const frTranslations = {
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
}