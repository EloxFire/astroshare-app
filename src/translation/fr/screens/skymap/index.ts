import { detailedMoonMapScreenTranslations } from "./detailedMoonMapScreen";
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
      subtitle: "// Explorez le ciel en direct !"
    },
    constellations: {
      title: "Cartes des constellations",
      subtitle: "// Bientôt disponible !"
    },
    moon: {
      title: "Carte détaillée de la Lune",
      subtitle: "// Carte 3D interactive et 2D"
    }
  },
  info: "Utilisez nos cartes du ciel pour vous repérer et explorer la voûte céleste.",
  flatmap: skymapGeneratorTranslations,
  planetarium: planetariumTranslations,
  moon: detailedMoonMapScreenTranslations
}
