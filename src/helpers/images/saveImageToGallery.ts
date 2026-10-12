import { File, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export class MediaLibraryPermissionDeniedError extends Error {}

const ASTROSHARE_ALBUM_NAME = "Astroshare";

// Album.create a besoin d'au moins un asset pour créer l'album (pas d'album vide) — donc au
// premier appel, on crée l'asset à la racine de la galerie puis on l'utilise pour créer l'album
// (il y est déplacé, voir doc Album.create/moveAssets). Les appels suivants trouvent l'album
// existant et Asset.create peut y placer l'asset directement en un seul appel.
const addAssetToAstroshareAlbum = async (filePath: string): Promise<void> => {
  const existingAlbum = await MediaLibrary.Album.get(ASTROSHARE_ALBUM_NAME);
  if (existingAlbum) {
    await MediaLibrary.Asset.create(filePath, existingAlbum);
    return;
  }

  const asset = await MediaLibrary.Asset.create(filePath);
  await MediaLibrary.Album.create(ASTROSHARE_ALBUM_NAME, [asset]);
};

// Télécharge une image distante et l'ajoute à la galerie photo de l'appareil, dans un album
// "Astroshare" dédié (créé au premier téléchargement).
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
  await addAssetToAstroshareAlbum(downloadedFile.uri);
};
