// Nom affiché pour une fiche de matériel : le nom personnalisé donné par l'utilisateur s'il
// existe, sinon marque + modèle, sinon un texte de repli (déjà résolu par l'appelant via t()) si
// la fiche (ajoutée manuellement) n'a rien.
export const gearName = (
  name: string | null | undefined,
  brand: string | null,
  model: string | null,
  fallback: string
): string => name || [brand, model].filter(Boolean).join(" ") || fallback
