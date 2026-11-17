// Accès "PRO" au sens produit : abonné payant, mais aussi partenaire et admin (déjà au-dessus d'un
// abonnement classique). MEMBER (compte gratuit), GUEST et BANNED restent en dehors. Premier usage
// de ce test dans l'app (voir le TODO laissé dans SpaceWeatherScreen) — tout nouvel écran qui gate
// une fonctionnalité derrière Astroshare PRO doit passer par cette fonction plutôt que de retester
// `role` à la main, pour rester cohérent si la définition de "PRO" évolue.
//
// Le paramètre n'est volontairement pas typé `User` : `useAuth()` (AuthContext) renvoie `any`
// (contexte typé `any` dans tout le reste de l'app), et `User["role"]` est lui-même mal typé
// (`UserRoles` est un objet, pas une union de chaînes) — hors scope de cette fonction à corriger.
export const isProUser = (authUser: { role?: string } | null | undefined): boolean => {
  if (!authUser) return false;
  return authUser.role === "SUBSCRIBER" || authUser.role === "PARTNER" || authUser.role === "ADMIN";
};
