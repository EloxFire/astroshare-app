import { c, constellations } from "@observerly/astrometry";

export const routes = {
  onboarding: { path: 'Onboarding', requirements: [] },
  tutorial: { path: 'Tutorial', requirements: [] },
  home: { path: 'Home', requirements: [] },
  settings: { path: 'Settings', requirements: [] },
  language: { path: 'LanguageSelection', requirements: [] },
  about: { path: 'About', requirements: [] },
  scopeAlignment: { path: 'ScopeAlignmentScreen ', requirements: [] },
  weather: { path: 'WeatherScreen', requirements: [] },
  moonPhases: { path: 'MoonPhasesScreen', requirements: [] },
  solarWeather: { path: 'SolarWeatherScreen', requirements: [] },
  favoritesViewPoints: { path: 'FavoritesViewPoints', requirements: [] },
  apod: { path: 'ApodScreen', requirements: [] },
  satelliteTracker: { path: 'SatelliteTrackerScreen', requirements: [] },
  issTracker: { path: 'IssTrackerScreen', requirements: [] },
  starlinkTracker: { path: 'StarlinkTrackerScreen', requirements: [] },
  spaceXDataScreen: { path: 'SpaceXDataScreen', requirements: [] },
  favorites: { path: 'FavoritesScreen', requirements: [] },
  sellScreen: { path: 'SellScreen', requirements: [] },
  astroDataInfos: { path: 'AstroDataInfos', requirements: [] },
  widgetsManager: {path: 'WidgetsManager', requirements: []},
  changelogScreen: {path: 'ChangelogScreen', requirements: []},
  launchesScreen: {path: 'LaunchesScreen', requirements: []},
  launchDetails: {path: 'LaunchDetails', requirements: []},
  observationPlanner: {path: 'ObservationPlannerScreen', requirements: []},

  celestialBodies: {
    details: {
      path: "CelestialBodyOverview",
      requirements: []
    }
  },
  satellitesTrackers: {
    home: { path: 'SatelliteTrackerScreen', requirements: [] },
    details: { path: 'SatelliteTrackerDetails', requirements: []},
    satellitePasses: { path: "SatellitePasses", requirements: []},
    addCustomSatellite: { path: "AddCustomSatelliteTrackerScreen", requirements: []}
  },
  auth: {
    login: { path: 'Login', requirements: [] },
    register: { path: 'Register', requirements: [] },
    profile: { path: 'Profile', requirements: [] },
    passwordRecovery: { path: 'PasswordRecovery', requirements: [] },
    passwordReset: { path: 'PasswordReset', requirements: [] },
  },
  pro: {
    paywallScreen:{
      path: "PaywallScreen",
      requirements: []
    }
  },
  calculations: {
    home: {
      path: "CalculationsScreen",
      requirements: []
    }
  },
  skymaps: {
    home: {
      path: "SkymapSelectionScreen",
      requirements: []
    },
    flatmap: {
      path: "FlatSkymapScreen",
      requirements: []
    },
    planetarium: {
      path: "PlanetariumScreen",
      requirements: []
    },
    constellations: {
      path: "ConstellationsScreen",
      requirements: []
    }
  },
  transits: {
    home: {
      path: "TransitScreen",
      requirements: []
    },
    planetary: {
      path: "PlanetaryConjunctionScreen",
      requirements: []
    },
    eclipses: {
      solar: {
        path: "SolarEclipsesScreen",
        requirements: []
      },
      solarDetails: {
        path: "SolarEclipseDetails",
        requirements: []
      },
      lunar: {
        path: 'LunarEclipsesScreen',
        requirements: []
      },
      lunarDetails: {
        path: 'LunarEclipseDetails',
        requirements: []
      }
    }
  },
  newsManager: {
    home: {
      path: "NewsManager",
      requirements: []
    }
  },
  resources: {
    home: {
      path: "ResourcesScreen",
      requirements: []
    },
    categoryScreen: {
      path: "ResourcesCategory",
      requirements: []
    },
    resource: {
      path: "ResourceScreen",
      requirements: []
    }
  }
}