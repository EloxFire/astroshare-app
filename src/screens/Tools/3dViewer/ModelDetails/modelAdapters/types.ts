import { ComponentType } from "react";

// Comportement propre à un modèle précis (id de threeDModelsList), branché par une table de
// correspondance (voir index.ts) plutôt que par des if/else dans ModelDetails.tsx : ajouter un
// modèle avec un comportement spécial = ajouter un fichier ici, jamais toucher ModelDetails.tsx.
export interface ModelDetailsAdapter {
  // Valeurs de stats calculées en direct plutôt que figées dans threeDModelsDetails (voir
  // ModelStat.value), par id de stat.
  resolveLiveStats?: (now: Date) => Record<string, number>;
  // Contenu additionnel propre à ce modèle, inséré après les tags (ex: phase du jour pour la Lune).
  ExtraContent?: ComponentType<{ now: Date }>;
}
