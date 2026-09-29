import { useCallback } from "react";
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft, UserCircle } from "lucide-react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { app_colors } from "../../helpers/variables";
import { easedGradientStops } from "../../helpers/gradients";
import { screenHeaderStyles } from "./ScreenHeader.styles";
import { SafeAreaView } from "react-native-safe-area-context";
import AstroshareFullLogo from "../../../assets/logos/astroshare_full_no_slogan.svg";

// Dégradé sombre (primary.main) posé sur l'image de fond, sous la barre de statut, le bouton
// retour et le titre, qui passent en blanc (offsets en fractions de la hauteur du header) : plein
// jusqu'à SCRIM_HOLD, puis estompé en douceur jusqu'à SCRIM_END.
const IMAGE_SCRIM_OPACITY = 0.2;
const IMAGE_SCRIM_HOLD = 0.8;
const IMAGE_SCRIM_END = 1;

const IMAGE_SCRIM_STOPS = easedGradientStops(IMAGE_SCRIM_HOLD, IMAGE_SCRIM_END, IMAGE_SCRIM_OPACITY, 0);

interface ScreenHeaderProps {
  title: string;
  main?: boolean;
  subtitle?: string;
  disableBackButton?: boolean;
  customElement?: React.ReactNode;
  // Image de fond, uniquement pour un header secondaire (ignorée si `main`) : le header passe
  // alors à une hauteur fixe, avec le texte et le bouton retour en blanc.
  image?: ImageSourcePropType;
}

export const ScreenHeader = ({ title, main = true, disableBackButton = false, subtitle, customElement, image }: ScreenHeaderProps) => {
  const canGoBack = router.canGoBack();
  const pathname = usePathname();

  const isHomeScreen = pathname === "/";
  const withImage = !main && image !== undefined;

  // Icônes de la barre de statut en clair sur le dégradé sombre, tant que l'écran a le focus. En
  // le quittant, retour à "dark" : un header secondaire vit sur un fond clair (c'est aussi le
  // statusBarStyle du Stack des réglages), comme les écrans où l'on revient.
  useFocusEffect(
    useCallback(() => {
      if (!withImage) return;
      StatusBar.setStyle("light");
      return () => StatusBar.setStyle("dark");
    }, [withImage])
  );

  return (
      <SafeAreaView style={[screenHeaderStyles.container, !main && screenHeaderStyles.container.light, withImage && screenHeaderStyles.container.withImage]}>
        {
          withImage && (
            <>
              <View style={screenHeaderStyles.container.withImage.imageContainer}>
                <Image source={image} style={screenHeaderStyles.container.withImage.imageContainer.image} />
              </View>
              {/* Le dégradé garde une seule couleur et ne fait varier que son opacité, jamais
                  "transparent" : transparent = noir à 0% d'opacité, ce qui salirait la transition. */}
              <View style={screenHeaderStyles.container.withImage.overlay}>
                <Svg width="100%" height="100%">
                  <Defs>
                    <LinearGradient id="screenHeaderImageScrim" x1="0" y1="0" x2="0" y2="1">
                      {IMAGE_SCRIM_STOPS.map(({ offset, opacity }) => (
                        <Stop key={offset} offset={offset} stopColor={app_colors.primary.main} stopOpacity={opacity} />
                      ))}
                    </LinearGradient>
                  </Defs>
                  <Rect width="100%" height="100%" fill="url(#screenHeaderImageScrim)" />
                </Svg>
              </View>
            </>
          )
        }

        {
          isHomeScreen && (
            <View style={screenHeaderStyles.container.homeHeader}>
              <AstroshareFullLogo width={120} height={30} />
              
              <TouchableOpacity onPress={() => router.push("/profile")}>
                <UserCircle color={app_colors.white} size={24} />
              </TouchableOpacity>
            </View>
          )
        }

        <View style={screenHeaderStyles.container.titleContainer}>
          {canGoBack && !disableBackButton && (
            <TouchableOpacity style={screenHeaderStyles.backButton} onPress={() => router.back()}>
              <ChevronLeft color={!main && !withImage ? app_colors.primary.main : app_colors.white} size={24} />
            </TouchableOpacity>
          )}
          <View >
            <Text style={[screenHeaderStyles.container.titleContainer.title, !main && screenHeaderStyles.container.titleContainer.title.light, withImage && screenHeaderStyles.container.titleContainer.title.onImage]}>{title}</Text>
            {subtitle && !main && (
              <Text style={[screenHeaderStyles.container.titleContainer.subtitle, withImage && screenHeaderStyles.container.titleContainer.subtitle.onImage]}>{subtitle}</Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
};
