import { weatherTranslation } from "./screens/weather";
import { commonTranslations } from "./common/common";
import { constellationsNamesTranslations } from "./common/constellations";
import { languagesTranslations } from "./common/languages";
import { objectTypesTranslations } from "./common/objectTypes";
import { spaceStuffTranslations } from "./common/spaceStuff";
import { resultCardsTranslations } from "./components/cards/resultCards";
import { homeSearchModuleTranslations } from "./components/forms/homeSearchModule";
import { locationHeaderTranslations } from "./components/locationHeader";
import { locationModalTranslations } from "./components/locationModal";
import { ephemerisBarTranslation } from "./components/weather/ephemerisBar";
import { hourlyOverviewTranslation } from "./components/weather/hourlyOverview";
import { widgetsTranslations } from "./components/widgets";
import { aboutTranslations } from "./screens/about";
import { astroDataInfosTranslations } from "./screens/astroDataInfos";
import { detailsPages } from "./screens/detailsPages";
import { favouriteScreenTranslations } from "./screens/favouriteScreen";
import { homeTranslations } from "./screens/home";
import { languageSelection } from "./screens/languageSelection";
import { moonPhasesTranslation } from "./screens/moonPhases";
import { onboardingTranslations } from "./screens/onboarding";
import { proTranslations } from "./screens/pro";
import { satelliteTrackerTranslations } from "./screens/satelliteTracker";
import { scopeAlignmentTranslation } from "./screens/scopeAlignment";
import { settingsTranslations } from "./screens/settings";
import { skymapTranslations } from "./screens/skymap";
import { skymapGeneratorTranslations } from "./screens/skymap/skymapGenerator";
import { solarWeatherTranslations } from "./screens/solarWeather";
import { tutorialScreen } from "./screens/tutorialScreen";
import { viewpointsManagerTranslations } from "./screens/viewpointsManager";
import { changelogScreenTranslations } from "./screens/settings/changelog";
import {launchesScreenTranslations} from "./screens/launches";
import {notificationsTranslations} from "./common/notifications";
import {ressourcesScreenTranslations} from "./screens/ressources";

export const enTranslations = {
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
  skymap: skymapTranslations,
  viewpointsManager: viewpointsManagerTranslations,
  resultCards: resultCardsTranslations,
  pro: proTranslations,
  favouriteScreen: favouriteScreenTranslations,
  detailsPages: detailsPages,
  constellations: constellationsNamesTranslations,
  objectTypes: objectTypesTranslations,
  astroDataInfos: astroDataInfosTranslations,
  about: aboutTranslations,
  widgets: widgetsTranslations,
  spaceStuff: spaceStuffTranslations,
  changelog: changelogScreenTranslations,
  launchesScreen: launchesScreenTranslations,
  notifications: notificationsTranslations,
  ressourcesScreen: ressourcesScreenTranslations
}