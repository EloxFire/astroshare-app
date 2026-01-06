export const dashboardTranslations = {
  title: "Dashboard",
  subtitle: "Track your sky progress",
  stats: {
    favorites: "Favorites",
    observed: "Observed",
    photographs: "Photographs",
    sketches: "Sketches",
  },
  sections: {
    stats: {
      title: "Total stats",
      subtitle: "Overview of your activity",
    },
    messier: {
      title: "Messier catalog",
      subtitle: "{{progress}}% completed",
      progressLabel: "{{observed}} / {{total}} observed",
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
  },
  achievements: {
    reach: "Reach {{count}}",
    messier: {
      observed: "Messier observed",
      photographed: "Messier photographed",
      sketched: "Messier sketched",
    },
    messierDescriptions: {
      observed: "Observe {{count}} Messier objects to unlock this achievement.",
      photographed: "Photograph {{count}} Messier objects to unlock this achievement.",
      sketched: "Sketch {{count}} Messier objects to unlock this achievement.",
    },
    exploration: {
      star: "Stars observed",
      galaxy: "Galaxies observed",
      nebula: "Nebulae observed",
      cluster: "Clusters observed",
      notes: "Notes added",
      planner: "Planner searches",
    },
    explorationDescriptions: {
      star: "Observe {{count}} stars to earn this achievement.",
      galaxy: "Observe {{count}} galaxies to earn this achievement.",
      nebula: "Observe {{count}} nebulae to earn this achievement.",
      cluster: "Observe {{count}} clusters to earn this achievement.",
      notes: "Add {{count}} observation notes to unlock this achievement.",
      planner: "Perform {{count}} planner searches to unlock this achievement.",
    },
    challenges: {
      title: "Difficult observations ({{count}})",
      observedDescription: "Log {{count}} observations of objects with magnitude greater than 10.",
      photographedDescription: "Capture {{count}} photographs of objects with magnitude greater than 10.",
    },
    solarSystem: {
      observePlanet: "Observe {{planet}}",
    },
  },
  toast: {
    unlocked: "Achievement unlocked: {{title}}",
  },
};
