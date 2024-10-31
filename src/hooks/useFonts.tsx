import * as Font from "expo-font";

export const useFonts = async () =>
  await Font.loadAsync({
    'AuxMono': require('../../assets/fonts/Aux_mono.ttf'),
    'GilroyBlack': require('../../assets/fonts/Gilroy-Black.ttf'),
    'GilroyMedium': require('../../assets/fonts/Gilroy-Medium.ttf'),
    'GilroyRegular': require('../../assets/fonts/Gilroy-Regular.ttf'),
    'GilroyRegularItalic': require('../../assets/fonts/Gilroy-RegularItalic.ttf'),
  });

export default useFonts;