import { Stack } from "expo-router";

// Onglet masqué (href: null dans app/_layout.tsx), accessible depuis plusieurs autres onglets
// (Recherche...) : son Stack reste monté tout le long de la session, y compris quand on le quitte.
// Par défaut, React Navigation distingue deux visites de "[id]" par leurs params (getId implicite
// basé sur le nom d'écran + les params) : router.push("/objects/A") puis router.push("/objects/B")
// empilent donc DEUX écrans dans ce Stack, même en y accédant depuis des onglets différents —
// retour = d'abord la fiche A, pas l'onglet de départ (router.replace ne change rien : le
// remplacement se fait au niveau de l'onglet racine, pas de ce Stack imbriqué).
// getId constant : toute navigation vers "[id]", quels que soient ses params, vise alors le même
// écran existant (mis à jour en place, jamais empilé) — ce Stack garde donc toujours un seul écran,
// et un "back" depuis la fiche n'a plus rien à dépiler localement : il retombe directement sur
// l'onglet d'origine (backBehavior="history" du Tabs racine, app/_layout.tsx).
export default function ObjectsStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" getId={() => "object-details"} />
    </Stack>
  );
}
