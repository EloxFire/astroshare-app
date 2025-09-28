import * as Font from "expo-font";

export const useFonts = async () =>
  await Font.loadAsync({
    'GilroyBlack': require('../../assets/fonts/Gilroy-Black.ttf'),
    'GilroyMedium': require('../../assets/fonts/Gilroy-Medium.ttf'),
    'GilroyRegular': require('../../assets/fonts/Gilroy-Regular.ttf'),
    'GilroyRegularItalic': require('../../assets/fonts/Gilroy-RegularItalic.ttf'),
    'DMMonoRegular': require('../../assets/fonts/DMMono-Regular.ttf'),
    'DMMonoMedium': require('../../assets/fonts/DMMono-Medium.ttf'),
    'DMMonoLight': require('../../assets/fonts/DMMono-Light.ttf'),
    'DMMonoLightItalic': require('../../assets/fonts/DMMono-LightItalic.ttf'),
    'DMMonoMediumItalic': require('../../assets/fonts/DMMono-MediumItalic.ttf'),
  });

export default useFonts;