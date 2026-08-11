import { useFonts } from "expo-font";

// Charge les polices de marque (ZT Nature) + fonctionnelle (DM Mono).
// Pas de fichier DMMono-SemiBold.ttf fourni pour l'instant : les styles qui référencent
// "DMMonoSemiBold" (voir typography.dmMono.semiBold dans variables.ts) retomberont
// silencieusement sur la police système tant que ce fichier n'est pas ajouté ici.
export const useAppFonts = () =>
  useFonts({
    ZTNatureRegular: require("../../assets/fonts/ZTNature-Regular.ttf"),
    ZTNatureBold: require("../../assets/fonts/ZTNature-Bold.ttf"),
    ZTNatureItalic: require("../../assets/fonts/ZTNature-Italic.ttf"),
    DMMonoRegular: require("../../assets/fonts/DMMono-Regular.ttf"),
    DMMonoMedium: require("../../assets/fonts/DMMono-Medium.ttf"),
  });

export default useAppFonts;
