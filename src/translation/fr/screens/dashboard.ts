export const dashboardTranslations = {
  title: "Tableau de bord",
  subtitle: "Suivez vos progrès",
  stats: {
    favorites: {
      one: "Favori",
      other: "Favoris",
    },
    observed: {
      one: "Observation",
      other: "Observations",
    },
    photographs: {
      one: "Photographie",
      other: "Photographies",
    },
    sketches: {
      one: "Croquis",
      other: "Croquis",
    },
    galaxies: {
      one: "Galaxie observée",
      other: "Galaxies observées",
    },
    nebulae: {
      one: "Nébuleuse observée",
      other: "Nébuleuses observées",
    },
    clusters: {
      one: "Amas observé",
      other: "Amas observés",
    },
    stars: {
      one: "Étoile observée",
      other: "Étoiles observées",
    },
  },
  sections: {
    stats: {
      title: "Statistiques",
      subtitle: "Vue d'ensemble de votre activité",
    },
    messier: {
      title: "Catalogue Messier",
      subtitle: "{{progress}}% complété",
      progressLabel: {
        one: "{{observed}} / {{total}} objet observé",
        other: "{{observed}} / {{total}} objets observés",
      },
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
      actions: {
        observed: "Observé",
        photographed: "Photographié",
        sketched: "Dessiné",
        activityLogged: "Activité enregistrée",
        notesUpdated: "Notes mises à jour",
      }
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
    viewActivities: "Voir toute votre activité",
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
    activities: {
      title: "Historique des activités",
      subtitle: "Consultez toutes vos observations, photos et notes",
    },
  },
  achievements: {
    reach: "Atteindre {{count}}",
    messier: {
      observed: {
        one: "{{count}} objet Messier observé",
        other: "{{count}} objets Messier observés",
      },
      photographed: {
        one: "{{count}} objet Messier photographié",
        other: "{{count}} objets Messier photographiés",
      },
      sketched: {
        one: "{{count}} objet Messier dessiné",
        other: "{{count}} objets Messier dessinés",
      },
    },
    messierDescriptions: {
      observed: {
        one: "Observer {{count}} objet Messier pour débloquer ce succès.",
        other: "Observer {{count}} objets Messier pour débloquer ce succès.",
      },
      photographed: {
        one: "Photographier {{count}} objet Messier pour débloquer ce succès.",
        other: "Photographier {{count}} objets Messier pour débloquer ce succès.",
      },
      sketched: {
        one: "Dessiner {{count}} objet Messier pour débloquer ce succès.",
        other: "Dessiner {{count}} objets Messier pour débloquer ce succès.",
      },
    },
    exploration: {
      star: {
        one: "{{count}} étoile observée",
        other: "{{count}} étoiles observées",
      },
      galaxy: {
        one: "{{count}} galaxie observée",
        other: "{{count}} galaxies observées",
      },
      nebula: {
        one: "{{count}} nébuleuse observée",
        other: "{{count}} nébuleuses observées",
      },
      cluster: {
        one: "{{count}} amas observé",
        other: "{{count}} amas observés",
      },
      notes: {
        one: "{{count}} note ajoutée",
        other: "{{count}} notes ajoutées",
      },
      planner: {
        one: "{{count}} recherche du planificateur",
        other: "{{count}} recherches du planificateur",
      },
    },
    explorationDescriptions: {
      star: {
        one: "Observer {{count}} étoile pour obtenir ce succès.",
        other: "Observer {{count}} étoiles pour obtenir ce succès.",
      },
      galaxy: {
        one: "Observer {{count}} galaxie pour obtenir ce succès.",
        other: "Observer {{count}} galaxies pour obtenir ce succès.",
      },
      nebula: {
        one: "Observer {{count}} nébuleuse pour obtenir ce succès.",
        other: "Observer {{count}} nébuleuses pour obtenir ce succès.",
      },
      cluster: {
        one: "Observer {{count}} amas pour obtenir ce succès.",
        other: "Observer {{count}} amas pour obtenir ce succès.",
      },
      notes: {
        one: "Ajouter {{count}} note d'observation pour débloquer ce succès.",
        other: "Ajouter {{count}} notes d'observation pour débloquer ce succès.",
      },
      planner: {
        one: "Effectuer {{count}} recherche dans le planificateur pour débloquer ce succès.",
        other: "Effectuer {{count}} recherches dans le planificateur pour débloquer ce succès.",
      },
    },
    challenges: {
      title: {
        one: "Observation difficile ({{count}})",
        other: "Observations difficiles ({{count}})",
      },
      observedDescription: {
        one: "Enregistrer {{count}} observation d'objet de magnitude supérieure à 10.",
        other: "Enregistrer {{count}} observations d'objets de magnitude supérieure à 10.",
      },
      photographedDescription: {
        one: "Réaliser {{count}} photographie d'objet de magnitude supérieure à 10.",
        other: "Réaliser {{count}} photographies d'objets de magnitude supérieure à 10.",
      },
    },
    solarSystem: {
      observePlanet: "Observer {{planet}}",
    },
  },
  toast: {
    unlocked: "Succès débloqué : {{title}}",
  },
};
