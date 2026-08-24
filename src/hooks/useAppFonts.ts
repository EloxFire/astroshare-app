import { useFonts } from "expo-font";
import { useEffect } from "react";

const FONT_MAP = {
  ZTNatureRegular: require("../../assets/fonts/ZTNature-Regular.ttf"),
  ZTNatureBold: require("../../assets/fonts/ZTNature-Bold.ttf"),
  ZTNatureItalic: require("../../assets/fonts/ZTNature-Italic.ttf"),
  DMMonoRegular: require("../../assets/fonts/DMMono-Regular.ttf"),
  DMMonoMedium: require("../../assets/fonts/DMMono-Medium.ttf"),
};

// Charge les polices de marque (ZT Nature) + fonctionnelle (DM Mono).
export const useAppFonts = () => {
  const [fontsLoaded, fontError] = useFonts(FONT_MAP);

  useEffect(() => {
    if (fontsLoaded) {
      console.log("[useAppFonts] Polices chargées:", Object.keys(FONT_MAP).join(", "));
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontError) {
      console.error("[useAppFonts] Échec du chargement des polices:", fontError);
    }
  }, [fontError]);

  return [fontsLoaded, fontError] as const;
};

export default useAppFonts;
