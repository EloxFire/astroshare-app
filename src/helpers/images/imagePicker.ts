import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

export class ImagePickerPermissionDeniedError extends Error {}

export interface PickCompressedImageOptions {
  maxWidth?: number; // Largeur max en pixels après compression (défaut 1080)
  quality?: number; // 0-1, qualité JPEG après compression (défaut 0.6)
  aspectRatio?: [number, number]; // Ex: [4, 3] pour forcer un recadrage à la sélection
}

export interface PickedImage {
  base64: string; // Data URI complet ("data:image/jpeg;base64,...") prêt à être stocké tel quel
  width: number;
  height: number;
}

// Ouvre la galerie, laisse choisir une image, puis la redimensionne/compresse avant de la
// retourner en base64. Utile tant qu'il n'y a pas de backend de stockage d'images : on évite
// de garder des photos de plusieurs Mo telles quelles dans le state/le stockage local.
// Retourne `null` si l'utilisateur annule la sélection. Lève une erreur si la permission
// d'accès à la galerie est refusée (cas à distinguer d'une simple annulation côté appelant).
export const pickAndCompressImage = async (
  options: PickCompressedImageOptions = {}
): Promise<PickedImage | null> => {
  const { maxWidth = 1080, quality = 0.6, aspectRatio } = options;

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new ImagePickerPermissionDeniedError("Accès à la galerie refusé");
  }

  const pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: !!aspectRatio,
    aspect: aspectRatio,
    quality: 1, // La compression est déléguée à expo-image-manipulator ci-dessous
  });

  if (pickerResult.canceled || pickerResult.assets.length === 0) return null;

  const pickedAsset = pickerResult.assets[0];
  // Ne jamais agrandir une image plus petite que maxWidth
  const targetWidth = Math.min(pickedAsset.width, maxWidth);

  const renderedImage = await ImageManipulator
    .manipulate(pickedAsset.uri)
    .resize({ width: targetWidth })
    .renderAsync();

  const savedImage = await renderedImage.saveAsync({
    compress: quality,
    format: SaveFormat.JPEG,
    base64: true,
  });

  if (!savedImage.base64) return null;

  return {
    base64: `data:image/jpeg;base64,${savedImage.base64}`,
    width: savedImage.width,
    height: savedImage.height,
  };
};
