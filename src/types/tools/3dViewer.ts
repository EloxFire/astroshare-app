import { ImageSourcePropType } from "react-native";

export type ThreeDModel = {
  id: string;
  category: string;
  illustration?: ImageSourcePropType;
  // Présents seulement pour les modèles déjà disponibles au téléchargement (fichier .glb).
  modelUrl?: string;
  version?: number;
  // Attribution de l'asset 3D téléchargé (pas du contenu informatif du modèle, cf. ModelDetails).
  source?: { name: string; url: string };
  // Correction d'orientation (radians, autour de l'axe Y) propre à cet asset .glb : certains
  // modèles ne présentent pas leur face attendue vers la caméra par défaut (même constat que pour
  // la texture de MoonPhase.tsx). Spécifique à chaque asset, donc définie ici plutôt que dans
  // Model3DViewer (générique, ne doit pas appliquer de rotation par défaut).
  rotationY?: number;
}

// Un modèle dont on sait qu'il a bien une URL et une version : évite de re-vérifier modelUrl/version
// partout où on veut proposer son téléchargement (ModelDownloadButton, etc.).
export type DownloadableThreeDModel = ThreeDModel & { modelUrl: string; version: number };

export function isDownloadableModel(model: ThreeDModel): model is DownloadableThreeDModel {
  return model.modelUrl !== undefined && model.version !== undefined;
}

export type ThreeDModelCategory = {
  id: string;
  color: string;
}