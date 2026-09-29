import { app_colors } from "../../helpers/variables";
import { IMAGE_HEADER_HEIGHT } from "../ScreenHeader/ScreenHeader.styles";

// Hauteur du fondu de l'image vers la couleur de fond (bas de l'image) : assez long pour rester
// doux, assez court pour laisser l'essentiel de l'image visible.
// Arrondi : une hauteur fractionnaire tombe entre deux pixels et accentue le lissage des bords du SVG.
const IMAGE_FADE_HEIGHT = Math.round(IMAGE_HEADER_HEIGHT * 0.35);
// Le contenu remonte d'autant sur le bas de l'image : son haut (padding + titre de la page) se
// pose sur la fin du fondu, déjà quasi opaque, au lieu de ne commencer qu'une fois le fondu fini.
const CONTENT_OVERLAP = 40;
// Le fond opaque remonte de quelques pixels sur la fin du fondu (déjà à ~100%, donc sans effet
// visible) : le bord du SVG est lissé (anti-aliasing), sa dernière rangée de pixels n'est que
// partiellement couverte et laissait voir l'image brute, sombre — une ligne parasite. Le fond
// opaque, lui, a des bords nets.
const FADE_SEAM_COVER = 2;

export const imageHeaderScrollViewStyles = {
  container: {
    flex: 1,
  },

  content: {
    marginTop: -CONTENT_OVERLAP,

    // Le contenu glisse par-dessus l'image (parallaxe) : il lui faut un fond opaque, sinon
    // l'image, qui défile plus lentement, apparaîtrait derrière le texte de la page. Ce fond ne
    // commence qu'au bas de l'image (à FADE_SEAM_COVER près) : les premiers pixels du contenu
    // restent transparents, posés sur la fin du fondu. Rendu après le fondu, pour le recouvrir.
    background: {
      position: "absolute" as const,
      top: CONTENT_OVERLAP - FADE_SEAM_COVER,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: app_colors.background,
    },

    // Fondu porté par le contenu (et qui déborde au-dessus de lui, sur l'image), terminé
    // exactement là où commence le fond opaque. Attaché au contenu plutôt qu'au header : avec la
    // parallaxe, le contenu remonte plus vite que l'image, et un fondu fixé au header laisserait
    // le fond opaque remonter dans une zone pas encore fondue (ligne nette). Ici, la jonction
    // reste fondue à toute position de scroll.
    fade: {
      position: "absolute" as const,
      left: 0,
      right: 0,
      top: CONTENT_OVERLAP - IMAGE_FADE_HEIGHT,
      height: IMAGE_FADE_HEIGHT,
    },
  },

  // Barre compacte (header secondaire classique) collée en haut, par-dessus le ScrollView.
  compactHeader: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
    // Même fond que le header secondaire : sans ça, le paddingBottom serait une bande transparente
    // (le fond est peint par le ScreenHeader à l'intérieur, pas par ce conteneur).
    backgroundColor: app_colors.background,
  },
};
