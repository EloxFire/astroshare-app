import { ModelDetailsAdapter } from "./types";
import { moonAdapter } from "./moon";

// Un modèle sans entrée ici n'a simplement aucun comportement spécial — pas de cas à gérer pour lui.
export const modelDetailsAdapters: Record<string, ModelDetailsAdapter> = {
  moon: moonAdapter,
};
