// Convertit le texte brut d'un champ numérique en nombre, ou null si vide/invalide.
//
// Les champs numériques des formulaires d'ajout de matériel gardent volontairement le texte TEL
// QUEL dans leur état (pas le nombre parsé reconverti en texte via `.toString()`) : sinon, taper
// une décimale casse en plein milieu de la saisie. Exemple avec un state numérique classique
// (valeur stockée = Number, value={n?.toString()}) : l'utilisateur tape "8", "0", puis "." → le
// TextInput affiche "80." → onChangeText reçoit "80." → parseFloat("80.") vaut 80 → l'état repasse
// à 80 → le re-render réaffiche "80", amputé du "." qui vient d'être tapé. Le "5" suivant s'ajoute
// alors à "80" (→ "805") au lieu de produire "80.5". Garder le texte brut en état, et ne parser
// qu'au moment de l'utiliser (validation, sauvegarde), évite ce problème.
export const parseOptionalFloat = (text: string): number | null => {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const value = parseFloat(trimmed);
  return Number.isNaN(value) ? null : value;
};
