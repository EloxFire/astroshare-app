import { camerasCrudTranslations } from "./gear/cameras/camerasCrud";
import { eyepiecesCrudTranslations } from "./gear/eyepieces/eyepiecesCrud";
import { telescopesCrudTranslations } from "./gear/telescopes/telescopesCrud";

export const profileTranslations = {
  gear: {
    telescopes: {
      crud: telescopesCrudTranslations,
    },
    eyepieces: {
      crud: eyepiecesCrudTranslations,
    },
    cameras: {
      crud: camerasCrudTranslations,
    }
  }
}