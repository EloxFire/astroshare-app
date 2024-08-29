import { tutorialScreen } from "../en/screens/tutorialScreen";
import { commonTranslations } from "./common/common";
import { constellationsNamesTranslations } from "./common/constellations";
import { languagesTranslations } from "./common/languages";
import { objectTypesTranslations } from "./common/objectTypes";
import { resultCardsTranslations } from "./components/cards/resultCards";
import { homeSearchModuleTranslations } from "./components/forms/homeSearchModule";
import { locationHeaderTranslations } from "./components/locationHeader";
import { locationModalTranslations } from "./components/locationModal";
import { ephemerisBarTranslation } from "./components/weather/ephemerisBar";
import { hourlyOverviewTranslation } from "./components/weather/hourlyOverview";
import { aboutTranslations } from "./screens/about";
import { astroDataInfosTranslations } from "./screens/astroDataInfos";
import { detailsPages } from "./screens/detailsPages";
import { favouriteScreenTranslations } from "./screens/favouriteScreen";
import { homeTranslations } from "./screens/home";
import { languageSelection } from "./screens/languageSelection";
import { moonPhasesTranslation } from "./screens/moonPhases";
import { onboardingTranslations } from "./screens/onboarding";
import { satelliteTrackerTranslations } from "./screens/satelliteTracker";
import { scopeAlignmentTranslation } from "./screens/scopeAlignment";
import { settingsTranslations } from "./screens/settings";
import { skymapGeneratorTranslations } from "./screens/skymapGenerator";
import { solarWeatherTranslations } from "./screens/solarWeather";
import { transitsTranslations } from "./screens/transits";
import { viewpointsManagerTranslations } from "./screens/viewpointsManager";
import { weatherTranslation } from "./screens/weather";

export const frTranslations = {
  onboarding: onboardingTranslations,
  common: commonTranslations,
  languages: languagesTranslations,
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
  favouriteScreen: favouriteScreenTranslations,
  detailsPages: detailsPages,
  transits: transitsTranslations,
  constellations: constellationsNamesTranslations,
  objectTypes: objectTypesTranslations,
  astroDataInfos: astroDataInfosTranslations,
  about: aboutTranslations,
}