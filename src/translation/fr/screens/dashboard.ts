export const dashboardTranslations = {
  title: "Tableau de bord",
  subtitle: "Suivez vos progrès",
  stats: {
    favorites: "Favoris",
    observed: "Observations",
    photographs: "Photographies",
    sketches: "Croquis",
  },
  sections: {
    stats: {
      title: "Statistiques",
      subtitle: "Vue d'ensemble de votre activité",
    },
    messier: {
      title: "Catalogue Messier",
      subtitle: "{{progress}}% complété",
      progressLabel: "{{observed}} / {{total}} observés",
      catalogTitle: "Catalogue",
      catalogSubtitle: "Touchez un objet pour ouvrir les détails",
      badge: {
        observed: "Observé",
        pending: "À faire",
      },
    },
    recent: {
      title: "Activité récente",
      subtitle: "Observations, photos et notes",
      empty: "Aucune activité pour le moment.",
      noDate: "Date inconnue",
    },
    achievements: {
      title: "Succès & badges",
      subtitle: "Objectifs à atteindre",
      badge: {
        unlocked: "Débloqué",
        locked: "Verrouillé",
      },
      previewEmpty: "Aucun succès pour le moment.",
      progressLabel: "Progression : {{current}} / {{target}}",
    },
  },
  loading: "Synchronisation de votre activité...",
  actions: {
    viewMessier: "Ouvrir le catalogue Messier",
    viewAchievements: "Voir tous les succès",
  },
  pages: {
    achievements: {
      title: "Succès",
      subtitle: "Vos paliers débloqués",
      categories: {
        messier: "Messier",
        exploration: "Exploration du ciel",
        challenges: "Observations difficiles",
        solarSystem: "Système solaire",
      },
    },
    messier: {
      title: "Catalogue Messier",
      subtitle: "Explorez et suivez vos observations",
    },
  },
  achievements: {
    reach: "Atteindre {{count}}",
    messier: {
      observed: "Messier observés",
      photographed: "Messier photographiés",
      sketched: "Messier dessinés",
    },
    messierDescriptions: {
      observed: "Observer {{count}} objets Messier pour débloquer ce succès.",
      photographed: "Photographier {{count}} objets Messier pour débloquer ce succès.",
      sketched: "Dessiner {{count}} objets Messier pour débloquer ce succès.",
    },
    exploration: {
      star: "Étoiles observées",
      galaxy: "Galaxies observées",
      nebula: "Nébuleuses observées",
      cluster: "Amas observés",
      notes: "Notes ajoutées",
      planner: "Recherches du planificateur",
    },
    explorationDescriptions: {
      star: "Observer {{count}} étoiles pour obtenir ce succès.",
      galaxy: "Observer {{count}} galaxies pour obtenir ce succès.",
      nebula: "Observer {{count}} nébuleuses pour obtenir ce succès.",
      cluster: "Observer {{count}} amas pour obtenir ce succès.",
      notes: "Ajouter {{count}} notes d'observation pour débloquer ce succès.",
      planner: "Effectuer {{count}} recherches dans le planificateur pour débloquer ce succès.",
    },
    challenges: {
      title: "Observations difficiles ({{count}})",
      observedDescription: "Enregistrer {{count}} observations d'objets de magnitude supérieure à 10.",
      photographedDescription: "Réaliser {{count}} photographies d'objets de magnitude supérieure à 10.",
    },
    solarSystem: {
      observePlanet: "Observer {{planet}}",
    },
  },
  toast: {
    unlocked: "Succès débloqué : {{title}}",
  },
};
