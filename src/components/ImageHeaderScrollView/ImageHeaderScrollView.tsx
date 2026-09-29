import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { Animated, ImageSourcePropType, NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { ScreenHeader } from "../ScreenHeader/ScreenHeader";
import { IMAGE_HEADER_HEIGHT } from "../ScreenHeader/ScreenHeader.styles";
import { app_colors } from "../../helpers/variables";
import { easedGradientStops } from "../../helpers/gradients";
import { imageHeaderScrollViewStyles } from "./ImageHeaderScrollView.styles";

// L'image défile à cette fraction de la vitesse du contenu (0.5 = deux fois moins vite) : le
// contenu glisse par-dessus, effet de profondeur (parallaxe).
const IMAGE_PARALLAX_SPEED = 0.5;
// Distance de scroll sur laquelle la barre compacte apparaît en fondu.
const COMPACT_HEADER_FADE_DISTANCE = 40;
// Fondu image → couleur de fond : 16 stops pour que la courbe adoucie reste parfaitement lisse
// sur toute sa hauteur (voir IMAGE_FADE_HEIGHT dans ImageHeaderScrollView.styles.ts).
const IMAGE_FADE_STOPS = easedGradientStops(0, 1, 0, 1, 16);

interface ImageHeaderScrollViewProps {
  title: string;
  subtitle?: string;
  image: ImageSourcePropType;
  disableBackButton?: boolean;
  children: ReactNode;
}

// Écran à header image qui défile avec le contenu : l'image (ScreenHeader, variante image) défile
// plus lentement que le contenu, qui glisse par-dessus en se fondant dedans. Une fois l'image
// passée sous le haut de l'écran, une barre compacte (le header secondaire classique : retour +
// titre) apparaît en fondu et reste collée en haut, et la barre de statut repasse en icônes
// foncées. Le contenu est rendu dans un ScrollView : pas de FlatList dedans (une liste virtualisée
// ne peut pas vivre dans un ScrollView vertical).
export const ImageHeaderScrollView = ({ title, subtitle, image, disableBackButton, children }: ImageHeaderScrollViewProps) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [compactHeaderHeight, setCompactHeaderHeight] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const collapsedRef = useRef(false);

  // Le contenu (opaque) remonte à pleine vitesse : la partie visible de l'image s'arrête donc à
  // IMAGE_HEADER_HEIGHT - scroll. Elle est entièrement sous la barre compacte à partir de ce seuil.
  const fullyCollapsedAt = IMAGE_HEADER_HEIGHT - compactHeaderHeight;
  const compactHeaderFadeStart = fullyCollapsedAt - COMPACT_HEADER_FADE_DISTANCE;

  const compactHeaderOpacity = scrollY.interpolate({
    inputRange: [compactHeaderFadeStart, fullyCollapsedAt],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const imageHeaderTranslateY = scrollY.interpolate({
    inputRange: [0, IMAGE_HEADER_HEIGHT],
    outputRange: [0, IMAGE_HEADER_HEIGHT * (1 - IMAGE_PARALLAX_SPEED)],
    extrapolate: "clamp",
  });

  // Animations sur le thread natif ; côté JS, on ne réagit qu'au franchissement du seuil (à
  // mi-fondu de la barre compacte) pour la barre de statut et les clics : pas de re-render à
  // chaque frame de scroll.
  const handleScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
        listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
          const isCollapsed = event.nativeEvent.contentOffset.y >= compactHeaderFadeStart + COMPACT_HEADER_FADE_DISTANCE / 2;
          if (isCollapsed !== collapsedRef.current) {
            collapsedRef.current = isCollapsed;
            setCollapsed(isCollapsed);
          }
        },
      }),
    [scrollY, compactHeaderFadeStart]
  );

  // ScreenHeader (variante image) passe déjà la barre de statut en "light" au focus, et en "dark"
  // en quittant l'écran. Cet effet-ci s'exécute après le sien à chaque focus (les effets d'un
  // enfant passent avant ceux du parent, et les listeners de focus sont appelés dans l'ordre
  // d'abonnement) ainsi qu'à chaque bascule : c'est donc lui qui décide tant que l'écran a le
  // focus, selon que l'image ou la barre compacte (fond clair) est sous la barre de statut.
  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle(collapsed ? "dark" : "light");
    }, [collapsed])
  );

  return (
    <View style={imageHeaderScrollViewStyles.container}>
      {/* bounces={false} : sur iOS, tirer au-delà du haut ferait apparaître la couleur de fond
          au-dessus de l'image. */}
      <Animated.ScrollView onScroll={handleScroll} scrollEventThrottle={16} bounces={false}>
        <Animated.View style={{ transform: [{ translateY: imageHeaderTranslateY }] }}>
          <ScreenHeader title={title} subtitle={subtitle} main={false} image={image} disableBackButton={disableBackButton} />
        </Animated.View>

        <View style={imageHeaderScrollViewStyles.content}>
          {/* Une seule couleur (celle du fond) dont seule l'opacité varie, jamais "transparent" :
              transparent = noir à 0% d'opacité, ce qui salirait le milieu du fondu. */}
          <View pointerEvents="none" style={imageHeaderScrollViewStyles.content.fade}>
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id="imageHeaderScrollViewFade" x1="0" y1="0" x2="0" y2="1">
                  {IMAGE_FADE_STOPS.map(({ offset, opacity }) => (
                    <Stop key={offset} offset={offset} stopColor={app_colors.background} stopOpacity={opacity} />
                  ))}
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#imageHeaderScrollViewFade)" />
            </Svg>
          </View>

          {/* Après le fondu : recouvre sa dernière rangée de pixels (voir FADE_SEAM_COVER). */}
          <View pointerEvents="none" style={imageHeaderScrollViewStyles.content.background} />

          {children}
        </View>
      </Animated.ScrollView>

      {/* Invisible et traversable par les touches tant que l'image est visible, pour ne pas
          bloquer le scroll qui démarre sur le haut de l'image. */}
      <Animated.View
        pointerEvents={collapsed ? "auto" : "none"}
        style={[imageHeaderScrollViewStyles.compactHeader, { opacity: compactHeaderOpacity }]}
        onLayout={(event) => setCompactHeaderHeight(event.nativeEvent.layout.height)}
      >
        <ScreenHeader title={title} main={false} disableBackButton={disableBackButton} />
      </Animated.View>
    </View>
  );
};
