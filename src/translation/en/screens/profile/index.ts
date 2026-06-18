import { camerasCrudTranslations } from "./gear/cameras/camerasCrud";
import { eyepiecesCrudTranslations } from "./gear/eyepieces/eyepiecesCrud";
import { telescopesCrudTranslations } from "./gear/telescopes/telescopesCrud";
import { observatoriesTranslations } from "./observatories";

export const profileTranslations = {
  observatories: observatoriesTranslations,
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
