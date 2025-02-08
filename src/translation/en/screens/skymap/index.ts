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
      title: "3D Skymap (Coming soon)",
      subtitle: "// Visualize the sky in 3D"
    }
  },
  info: "Use our skymaps to locate yourself and explore the night sky.",
  flatmap: skymapGeneratorTranslations,
  planetarium: planetariumTranslations
}