export const routes = {
  onboarding: { path: 'Onboarding', requirements: [] },
  home: { path: 'Home', requirements: [] },
  
  scopeAlignment: { path: 'ScopeAlignmentScreen ', requirements: [] },
  weather: { path: 'WeatherScreen', requirements: [] },
  moonPhases: { path: 'MoonPhasesScreen', requirements: [] },
  solarWeather: { path: 'SolarWeatherScreen', requirements: [] },
  apod: { path: 'ApodScreen', requirements: [] },
  satelliteTracker: { path: 'SatelliteTrackerScreen', requirements: [] },
  issTracker: { path: 'IssTrackerScreen', requirements: [] },
  starlinkTracker: { path: 'StarlinkTrackerScreen', requirements: [] },
  spaceXDataScreen: { path: 'SpaceXDataScreen', requirements: [] },
  favorites: { path: 'FavoritesScreen', requirements: [] },
  sellScreen: { path: 'SellScreen', requirements: [] },
  launchesScreen: {path: 'LaunchesScreen', requirements: []},
  launchDetails: {path: 'LaunchDetails', requirements: []},
  observationPlanner: {path: 'ObservationPlannerScreen', requirements: []},
  
  settings: { 
    home: { path: 'Settings', requirements: [] },
    tutorial: { path: 'Tutorial', requirements: [] },
    language: { path: 'LanguageSelection', requirements: [] },
    about: { path: 'About', requirements: [] },
    widgetsManager: {path: 'WidgetsManager', requirements: []},
    astroDataInfos: { path: 'AstroDataInfos', requirements: [] },
    changelogScreen: {path: 'ChangelogScreen', requirements: []},
    newsManager: {
      home: {
        path: "NewsManager",
        requirements: []
      }
    },
  },
  partners: {
    sevun: {
      home: { path: 'SevunScreen', requirements: [] },
      module: { path: 'SevunModuleScreen', requirements: [] },
      resource: { path: 'SevunResourceScreen', requirements: [] },
    }
  },
  dashboard: {
    home: { path: 'DashboardScreen', requirements: [] },
    achievements: { path: 'DashboardAchievementsScreen', requirements: [] },
    activities: { path: 'DashboardActivitiesScreen', requirements: [] },
    messier: { path: 'DashboardMessierCatalogScreen', requirements: [] },
    stats: { path: 'DashboardAllStatsScreen', requirements: [] },
  },
  checklistManager: {
    home: { path: 'ChecklistManagerScreen', requirements: [] },
  },
  clock: {
    home: { path: 'ClockScreen', requirements: [] },
  },
  celestialBodies: {
    details: {
      path: "CelestialBodyOverview",
      requirements: []
    }
  },
  lightpollution: {
    home: { path: 'LightPollutionMapScreen', requirements: [] },
  },
  satellitesTrackers: {
    home: { path: 'SatelliteTrackerScreen', requirements: [] },
    details: { path: 'SatelliteTrackerDetails', requirements: []},
    satellitePasses: { path: "SatellitePasses", requirements: []},
    addCustomSatellite: { path: "AddCustomSatelliteTrackerScreen", requirements: []}
  },
  telescopeSimulator: {
    home: { path: 'TelescopeSimulatorHome', requirements: [] },
  },
  auth: {
    login: { path: 'Login', requirements: [] },
    register: { path: 'Register', requirements: [] },
    profile: {
      home: { path: 'Profile', requirements: [] },
      dataSync: { path: 'DataSyncScreen', requirements: [] },
      subscriptionManagement: { 
        home: { path: 'SubscriptionManagementScreen', requirements: [] },
        subscriptionDetails: { path: 'SubscriptionDetailsScreen', requirements: [] },
      },
      personnalInfosForm: { path: 'PersonnalInfosScreen', requirements: []},
      astroGearManagement: {
        home: { path: 'AstroGearManagementScreen', requirements: []},
        telescopes: {
          crud: { path: 'TelescopesCrud', requirements: []},
        },
        eyepieces: {
          crud: { path: 'EyepiecesCrud', requirements: []},
        },
        mounts: {
          crud: { path: 'MountsCrud', requirements: []},
        },
        cameras: {
          crud: { path: 'CamerasCrud', requirements: []},
        },
        accessories: {
          crud: { path: 'AccessoriesCrud', requirements: []},
        }
      },
      observatories: {
        home: { path: 'ObservatoriesScreen', requirements: []},
        crud: { path: 'ObservatoryCrud', requirements: []},
      }
    },
    forgotPassword: { path: 'ForgotPassword', requirements: [] },
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
    },
    moon: {
      path: "DetailedMoonMapScreen",
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
  resources: {
    home: {
      path: "ResourcesScreen",
      requirements: []
    },
    categoryScreen: {
      path: "ResourcesCategory",
      requirements: []
    },
    details: {
      path: "ResourceDetails",
      requirements: []
    }
  }
}
