export const dashboardTranslations = {
  title: "Dashboard",
  subtitle: "Track your sky progress",
  stats: {
    favorites: {
      one: "Favorite",
      other: "Favorites",
    },
    observed: {
      one: "Observation",
      other: "Observations",
    },
    photographs: {
      one: "Photograph",
      other: "Photographs",
    },
    sketches: {
      one: "Sketch",
      other: "Sketches",
    },
    galaxies: {
      one: "Galaxy observed",
      other: "Galaxies observed",
    },
    nebulae: {
      one: "Nebula observed",
      other: "Nebulae observed",
    },
    clusters: {
      one: "Cluster observed",
      other: "Clusters observed",
    },
    stars: {
      one: "Star observed",
      other: "Stars observed",
    },
  },
  sections: {
    stats: {
      title: "Total stats",
      subtitle: "Overview of your activity",
    },
    messier: {
      title: "Messier catalog",
      subtitle: "{{progress}}% completed",
      progressLabel: {
        one: "{{observed}} / {{total}} object observed",
        other: "{{observed}} / {{total}} objects observed",
      },
      catalogTitle: "Catalog",
      catalogSubtitle: "Tap any object to open details",
      badge: {
        observed: "Observed",
        pending: "Pending",
      },
    },
    recent: {
      title: "Recent activities",
      subtitle: "Latest observations, photos and notes",
      empty: "No activity logged yet.",
      noDate: "Date unavailable",
      actions: {
        observed: "Observed",
        photographed: "Photographed",
        sketched: "Sketched",
        activityLogged: "Activity logged",
        notesUpdated: "Notes updated",
      }
    },
    achievements: {
      title: "Achievements & badges",
      subtitle: "Milestones to reach",
      badge: {
        unlocked: "Unlocked",
        locked: "Locked",
      },
      previewEmpty: "No achievements yet.",
      progressLabel: "Progress: {{current}} / {{target}}",
    },
  },
  loading: "Syncing your activity...",
  actions: {
    viewMessier: "Open Messier catalog",
    viewAchievements: "View all achievements",
    viewActivities: "View all activities",
    viewAllStats: "View all stats",
  },
  pages: {
    achievements: {
      title: "Achievements",
      subtitle: "Your unlocked milestones",
      categories: {
        messier: "Messier",
        exploration: "Sky exploration",
        challenges: "Difficult observations",
        solarSystem: "Solar system",
      },
    },
    messier: {
      title: "Messier catalog",
      subtitle: "Explore and track your observations",
    },
    activities: {
      title: "Activity log",
      subtitle: "Browse all your observations, photos and notes",
    },
    stats: {
      title: "All statistics",
      subtitle: "Deep dive into your observations",
    },
  },
  allStats: {
    filters: {
      observed: "Most observed",
      photographed: "Most photographed",
      sketched: "Most sketched",
    },
    objects: {
      title: "Most observed objects",
      subtitle: "Ranked by the selected action",
      empty: "No observations recorded yet.",
      line: "{{observed}} obs • {{photographed}} photos • {{sketched}} sketches",
    },
    types: {
      title: "Most observed types",
      subtitle: "Total observations by type",
      empty: "No observation types available.",
      line: "{{observations}} observations • {{unique}} unique objects",
      labels: {
        star: "Stars",
        galaxy: "Galaxies",
        nebula: "Nebulae",
        cluster: "Clusters",
        planet: "Planets",
        other: "Other",
      },
    },
  },
  achievements: {
    reach: "Reach {{count}}",
    messier: {
      observed: {
        one: "{{count}} Messier object observed",
        other: "{{count}} Messier objects observed",
      },
      photographed: {
        one: "{{count}} Messier object photographed",
        other: "{{count}} Messier objects photographed",
      },
      sketched: {
        one: "{{count}} Messier object sketched",
        other: "{{count}} Messier objects sketched",
      },
    },
    messierDescriptions: {
      observed: {
        one: "Observe {{count}} Messier object to unlock this achievement.",
        other: "Observe {{count}} Messier objects to unlock this achievement.",
      },
      photographed: {
        one: "Photograph {{count}} Messier object to unlock this achievement.",
        other: "Photograph {{count}} Messier objects to unlock this achievement.",
      },
      sketched: {
        one: "Sketch {{count}} Messier object to unlock this achievement.",
        other: "Sketch {{count}} Messier objects to unlock this achievement.",
      },
    },
    exploration: {
      star: {
        one: "{{count}} star observed",
        other: "{{count}} stars observed",
      },
      galaxy: {
        one: "{{count}} galaxy observed",
        other: "{{count}} galaxies observed",
      },
      nebula: {
        one: "{{count}} nebula observed",
        other: "{{count}} nebulae observed",
      },
      cluster: {
        one: "{{count}} cluster observed",
        other: "{{count}} clusters observed",
      },
      notes: {
        one: "{{count}} note added",
        other: "{{count}} notes added",
      },
      planner: {
        one: "{{count}} planner search",
        other: "{{count}} planner searches",
      },
    },
    explorationDescriptions: {
      star: {
        one: "Observe {{count}} star to earn this achievement.",
        other: "Observe {{count}} stars to earn this achievement.",
      },
      galaxy: {
        one: "Observe {{count}} galaxy to earn this achievement.",
        other: "Observe {{count}} galaxies to earn this achievement.",
      },
      nebula: {
        one: "Observe {{count}} nebula to earn this achievement.",
        other: "Observe {{count}} nebulae to earn this achievement.",
      },
      cluster: {
        one: "Observe {{count}} cluster to earn this achievement.",
        other: "Observe {{count}} clusters to earn this achievement.",
      },
      notes: {
        one: "Add {{count}} observation note to unlock this achievement.",
        other: "Add {{count}} observation notes to unlock this achievement.",
      },
      planner: {
        one: "Perform {{count}} planner search to unlock this achievement.",
        other: "Perform {{count}} planner searches to unlock this achievement.",
      },
    },
    challenges: {
      title: {
        one: "Difficult observation ({{count}})",
        other: "Difficult observations ({{count}})",
      },
      observedDescription: {
        one: "Log {{count}} observation of an object with magnitude greater than 10.",
        other: "Log {{count}} observations of objects with magnitude greater than 10.",
      },
      photographedDescription: {
        one: "Capture {{count}} photograph of an object with magnitude greater than 10.",
        other: "Capture {{count}} photographs of objects with magnitude greater than 10.",
      },
    },
    solarSystem: {
      observePlanet: "Observe {{planet}}",
    },
  },
  toast: {
    unlocked: "Achievement unlocked: {{title}}",
  },
};
