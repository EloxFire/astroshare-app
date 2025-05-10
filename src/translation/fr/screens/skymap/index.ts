import { planetariumTranslations } from "./planetarium";
import { skymapGeneratorTranslations } from "./skymapGenerator";

export const skymapTranslations = {
  title: "Carte du ciel",
  subTitle: "// Explorez le ciel",
  buttons: {
    flatmap: {
      title: "Carte du ciel",
      subtitle: "// Repérez vous rapidement dans le ciel"
    },
    planetarium: {
      title: "Planétarium 3D",
      subtitle: "// Visualisez le ciel en 3D"
    },
    constellations: {
      title: "Cartes des constellations",
      subtitle: "// Bientôt disponible !"
    }
  },
  info: "Utilisez nos cartes du ciel pour vous repérer et explorer la voûte céleste.",
  flatmap: skymapGeneratorTranslations,
  planetarium: planetariumTranslations
}
