import { weatherTranslation } from "../fr/screens/weather";
import { commonTranslations } from "./common/common";
import { homeSearchModuleTranslations } from "./components/forms/homeSearchModule";
import { locationHeaderTranslations } from "./components/locationHeader";
import { locationModalTranslations } from "./components/locationModal";
import { homeTranslations } from "./screens/home";
import { languageSelection } from "./screens/languageSelection";
import { settingsTranslations } from "./screens/settings";
import { tutorialScreen } from "./screens/tutorialScreen";

export const enTranslations = {
  common: commonTranslations,
  home: homeTranslations,
  settings: settingsTranslations,
  locationModal: locationModalTranslations,
  locationHeader: locationHeaderTranslations,
  homeSearchModule: homeSearchModuleTranslations,
  languageSelection: languageSelection,
  tutorialScreen: tutorialScreen,
  weather: weatherTranslation
}