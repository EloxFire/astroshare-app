import type { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut, LinearTransition, runOnJS } from "react-native-reanimated";
import { X } from "lucide-react-native";
import { app_colors } from "../../../../../helpers/variables";
import { eclipseCircumstancesSheetStyles as styles } from "./EclipseCircumstancesSheet.styles";

const SWIPE_THRESHOLD = 16; // px de déplacement vertical avant de basculer

interface EclipseCircumstancesSheetProps {
  minimized: boolean;
  onExpand: () => void;
  onMinimize: () => void;
  onClose: () => void;
  // Bloc d'en-tête (icône/lieu/titre) fourni par l'écran appelant — TOUJOURS visible, replié ou
  // non, voir le screenshot de référence de l'utilisateur (seul ce qui est sous l'en-tête se
  // replie, pas l'en-tête lui-même).
  header: ReactNode;
  bottomInset: number;
  children: ReactNode;
}

/**
 * "Modal" custom pour les circonstances locales d'une éclipse (solaire/lunaire) : pas une vraie
 * <Modal> RN (la carte en dessous doit rester visible et tactile), mais une feuille accrochée au
 * bas de l'écran avec 2 états — repliée (juste l'en-tête) et dépliée (en-tête + contenu complet,
 * défilable) — plus une fermeture complète indépendante des deux.
 *
 * Bascule UNIQUEMENT au swipe vertical sur l'en-tête (geste réel, pas un tap sur un bouton —
 * demande explicite de l'utilisateur : "un vrai swipe, pas un clic"). Le geste n'enveloppe QUE
 * l'en-tête (poignée + icône/lieu/titre), jamais le contenu déplié en dessous : la ScrollView garde
 * son propre geste de défilement natif, sans conflit.
 */
const EclipseCircumstancesSheet = ({
  minimized,
  onExpand,
  onMinimize,
  onClose,
  header,
  bottomInset,
  children,
}: EclipseCircumstancesSheetProps) => {
  const headerGesture = Gesture.Pan().onEnd((event) => {
    if (event.translationY > SWIPE_THRESHOLD || event.velocityY > 300) runOnJS(onMinimize)();
    else if (event.translationY < -SWIPE_THRESHOLD || event.velocityY < -300) runOnJS(onExpand)();
  });

  return (
    <Animated.View layout={LinearTransition.duration(220)} style={[styles.card, !minimized && { maxHeight: "62%" }]}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <X size={15} color={app_colors.primary.main} />
      </TouchableOpacity>

      <GestureDetector gesture={headerGesture}>
        <View style={[styles.headerWrap, minimized && { paddingBottom: Math.max(16, bottomInset) }]}>
          <View style={styles.handleHitArea}>
            <View style={styles.handle} />
          </View>
          {header}
        </View>
      </GestureDetector>

      {!minimized && (
        // `Animated.ScrollView` (pas un <Animated.View><ScrollView/></Animated.View>) : un simple
        // View flex:1 autour d'une ScrollView NE lui transmet pas sa hauteur bornée — la ScrollView
        // elle-même a besoin de `flex:1` sur SON PROPRE style pour savoir quand déclencher son
        // défilement interne, sinon elle grandit avec son contenu sans jamais scroller (régression
        // observée : "le scroll ne marche plus").
        <Animated.ScrollView
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(120)}
          style={{ flex: 1 }}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(16, bottomInset) }]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </Animated.ScrollView>
      )}
    </Animated.View>
  );
};

export default EclipseCircumstancesSheet;
