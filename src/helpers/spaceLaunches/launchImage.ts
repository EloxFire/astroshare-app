import { LaunchImage } from "../../types/spaceLaunches/Launch";

// `image` est soit une URL brute, soit l'objet riche renvoyé par LL2 ({image_url, thumbnail_url,
// ...}) — voir le commentaire sur LaunchImage. Ne jamais passer l'objet tel quel à <Image source>,
// React Native plante (cast ReadableNativeMap → String) s'il reçoit autre chose qu'une string.
export const getLaunchImageUrl = (image: LaunchImage | undefined): string | null => {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.image_url ?? image.thumbnail_url ?? null;
}
