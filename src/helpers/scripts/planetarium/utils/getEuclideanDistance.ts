export const getEuclideanDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.hypot(Math.abs(x2 - x1), Math.abs(y2 - y1)); //retourne la distance euclidienne entre deux points, pour le pinch gesture (distance entre les doigts)
}