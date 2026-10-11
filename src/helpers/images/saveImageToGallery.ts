import { File, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export class MediaLibraryPermissionDeniedError extends Error {}

// Télécharge une image distante et l'ajoute à la galerie photo de l'appareil.
// Lève MediaLibraryPermissionDeniedError si la permission d'écriture est refusée — à distinguer
// d'une erreur de téléchargement/écriture côté appelant.
export const saveImageToGallery = async (remoteImageUrl: string): Promise<void> => {
  // writeOnly : on ne fait qu'ajouter une photo, jamais besoin de lire la galerie existante.
  const permission = await MediaLibrary.requestPermissionsAsync(true);
  if (!permission.granted) {
    throw new MediaLibraryPermissionDeniedError("Accès à la galerie refusé");
  }

  // MediaLibrary.Asset.create a besoin d'un fichier local, pas d'une URL distante — on télécharge
  // d'abord dans le cache. idempotent:true évite une erreur si le fichier a déjà été téléchargé
  // lors d'un appel précédent.
  const downloadedFile = await File.downloadFileAsync(remoteImageUrl, Paths.cache, { idempotent: true });
  await MediaLibrary.Asset.create(downloadedFile.uri);
};
