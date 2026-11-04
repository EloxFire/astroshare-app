// Convertit une taille en octets en kilo-octets ou méga-octets, pour affichage (l'unité traduite
// est ajoutée par l'appelant via i18n, cette fonction ne renvoie que le nombre et son unité).
export function toReadableFileSize(bytes: number): { unit: "kb" | "mb"; size: number } {
  if (bytes < 1024 * 1024) {
    return { unit: "kb", size: Math.round(bytes / 1024) };
  }
  return { unit: "mb", size: Math.round(bytes / (1024 * 1024)) };
}
