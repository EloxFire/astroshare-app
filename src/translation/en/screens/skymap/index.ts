import { detailedMoonMapScreenTranslations } from "./detailedMoonMapScreen";
import { planetariumTranslations } from "./planetarium";
import { skymapGeneratorTranslations } from "./skymapGenerator";

export const skymapTranslations = {
  title: "Sky Map",
  subTitle: "// Explore the sky",
  buttons: {
    flatmap: {
      title: "2D Skymap",
      subtitle: "// Quickly locate yourself in the sky"
    },
    planetarium: {
      title: "Planetarium",
      subtitle: "// Explore the sky live !"
    },
    constellations: {
      title: "Constellation maps",
      subtitle: "// Coming soon !"
    },
    moon: {
      title: "Detailed Moon map",
      subtitle: "// Interactive 3D and 2D map"
    }
  },
  info: "Use our skymaps to locate yourself and explore the night sky.",
  flatmap: skymapGeneratorTranslations,
  planetarium: planetariumTranslations,
  moon: detailedMoonMapScreenTranslations
}
