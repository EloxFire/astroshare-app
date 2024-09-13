import { planetariumTranslations } from "./planetarium";
import { skymapGeneratorTranslations } from "./skymapGenerator";

export const skymapTranslations = {
  title: "Sky Map",
  subTitle: "Explore the sky",
  buttons: {
    flatmap: {
      title: "2D Skymap",
      subtitle: "// Explore the sky in 2D"
    },
    planetarium: {
      title: "3D Skymap",
      subtitle: "// Explore the sky interactively !"
    }
  },
  info: "Keep track of the sky with our skymap generator",
  flatmap: skymapGeneratorTranslations,
  planetarium: planetariumTranslations
}