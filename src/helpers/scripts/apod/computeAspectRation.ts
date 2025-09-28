import {Dimensions} from "react-native";

const windowWidth = Dimensions.get('window').width
export const MAX_MEDIA_WIDTH: number = windowWidth - 20

export function computeContainAspect(width: number, height: number) {
  // Retourne une aspectRatio pour un rendu contain responsive, limité à la largeur
  // de l’écran (avec bordure intérieure).
  const maxW: number = MAX_MEDIA_WIDTH
  let w: number = width
  let h: number = height
  if (w > maxW) {
    const r = maxW / w
    w = maxW
    h = h * r
  }
  return { aspectRatio: w / h }
}