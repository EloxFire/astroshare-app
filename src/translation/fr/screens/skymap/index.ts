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
    }
  },
  info: "Keep track of the sky with our skymap generator",
  flatmap: skymapGeneratorTranslations,
  planetarium: planetariumTranslations
}
