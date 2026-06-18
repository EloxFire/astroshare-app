import { SevunModule } from "../types/SevunTypes";
import { app_colors } from "../constants";

// Remplacez les youtubeId par les vrais identifiants de vidéos YouTube AFA.
// Le thumbnail est généré automatiquement : https://img.youtube.com/vi/{youtubeId}/hqdefault.jpg

export const SEVUN_MODULES: SevunModule[] = [
  {
    id: 'beginner',
    levelKey: 'beginner',
    descriptionKey: 'beginner_description',
    color: '#4CAF82',
    resources: [
      {
        id: 'beg-1',
        title: "Introduction à l'astronomie",
        description: "Découvrez les bases de l'astronomie : le ciel nocturne, les constellations et les premiers repères célestes.",
        youtubeId: 'PLACEHOLDER_ID',
        duration: '12:34',
      },
      {
        id: 'beg-2',
        title: "Comprendre le système solaire",
        description: "Voyage à travers notre système solaire : planètes, lunes, astéroïdes et comètes.",
        youtubeId: 'PLACEHOLDER_ID',
        duration: '18:45',
      },
      {
        id: 'beg-3',
        title: "Choisir son premier télescope",
        description: "Critères essentiels pour bien choisir son premier instrument d'observation.",
        youtubeId: 'PLACEHOLDER_ID',
        duration: '15:20',
      },
      {
        id: 'beg-4',
        title: "Lire une carte du ciel",
        description: "Apprenez à utiliser une carte du ciel pour repérer et identifier les objets célestes.",
        youtubeId: 'PLACEHOLDER_ID',
        duration: '10:10',
      },
    ],
  },
  {
    id: 'intermediate',
    levelKey: 'intermediate',
    descriptionKey: 'intermediate_description',
    color: '#5B8CDB',
    resources: [
      {
        id: 'int-1',
        title: "La mise en station polaire",
        description: "Technique complète de mise en station pour un suivi précis des objets célestes.",
        youtubeId: 'PLACEHOLDER_ID',
        duration: '22:15',
      },
      {
        id: 'int-2',
        title: "Observer les nébuleuses et galaxies",
        description: "Techniques d'observation des objets du ciel profond : nébuleuses, amas et galaxies.",
        youtubeId: 'PLACEHOLDER_ID',
        duration: '25:30',
      },
      {
        id: 'int-3',
        title: "Photographie astronomique : les bases",
        description: "Introduction à l'astrophotographie : matériel, réglages et premières prises de vue.",
        youtubeId: 'PLACEHOLDER_ID',
        duration: '30:00',
      },
      {
        id: 'int-4',
        title: "Les éclipses et transits",
        description: "Comprendre et observer les éclipses de Soleil, de Lune et les transits planétaires.",
        youtubeId: 'PLACEHOLDER_ID',
        duration: '19:45',
      },
    ],
  },
  {
    id: 'advanced',
    levelKey: 'advanced',
    descriptionKey: 'advanced_description',
    color: '#C97BD1',
    resources: [
      {
        id: 'adv-1',
        title: "Astrophotographie avancée",
        description: "Maîtrisez les techniques avancées : empilement, traitement et post-production.",
        youtubeId: 'PLACEHOLDER_ID',
        duration: '40:00',
      },
      {
        id: 'adv-2',
        title: "Spectroscopie pour astronomes amateurs",
        description: "Introduction à la spectroscopie : analyser la lumière des étoiles depuis votre jardin.",
        youtubeId: 'PLACEHOLDER_ID',
        duration: '35:20',
      },
      {
        id: 'adv-3',
        title: "Contribuer à la science citoyenne",
        description: "Comment vos observations peuvent contribuer à la recherche astronomique professionnelle.",
        youtubeId: 'PLACEHOLDER_ID',
        duration: '28:15',
      },
    ],
  },
];
