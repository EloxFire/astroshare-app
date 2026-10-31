# Astroshare — instructions pour agents

Application mobile d'astronomie : Expo SDK 57, React Native 0.86, React 19, `expo-router`, TypeScript.

**Avant toute tâche, lis [docs/agents-reference.md](docs/agents-reference.md).** On y trouve l'état du
projet, les conventions, les pièges déjà rencontrés et le détail du rendu 3D de la Lune (`MoonPhase`).

## Documenter les changements

Tout changement réalisé par un agent, une fois **approuvé et commité par l'utilisateur**, doit être
documenté dans `docs/agents-reference.md` :

1. Mets à jour les sections qu'il touche (état du projet, conventions, pièges, composants, évolutions
   envisagées, problèmes connus).
2. Ajoute une entrée au **Journal des changements** (§8), au format décrit dans cette section.

Si l'utilisateur te demande de faire le commit, inclus cette mise à jour de la doc dans ce même
commit. S'il commite lui-même, propose-la juste après. Un changement qui n'est pas encore approuvé ne
se documente pas : la doc décrit le code commité, pas des essais.

## Règles essentielles

- **Langue :** l'utilisateur échange en français, et les commentaires du code sont en français. Ils
  expliquent le *pourquoi* : garde ce niveau de détail.
- **Vérification :** `npx tsc --noEmit -p .` doit rester à 0 erreur. Il n'y a ni tests ni linter.
- **Styles :** un fichier `X.styles.ts` par composant, avec des objets imbriqués en `as const` et les
  tokens de `src/helpers/variables.ts`. Polices : uniquement les noms déclarés dans
  `src/hooks/useAppFonts.ts`.
- **i18n :** le nom d'un namespace est le chemin du fichier sous `src/i18n/locales/<langue>/`, sans
  l'extension. Déclare chaque nouveau namespace dans `src/i18n/resources.ts`, dans les trois langues.
  Ne traduis jamais au chargement d'un module : utilise `t()` dans le composant.
- **Dépendances natives :** toute nouvelle dépendance native impose de reconstruire le dev client.
  Préfère ce qui est déjà installé.
- **`patches/three+0.185.1.patch` :** appliqué au `postinstall`, il est indispensable au rendu 3D avec
  expo-gl. Régénère-le à chaque montée de version de `three`.
- **Textures `assets/images/textures/2k_*` :** ne les supprime pas, elles sont réservées à une future
  carte lunaire 3D.
- **Contenu versionné :** `docs/` et ce fichier sont commités. N'y écris aucun secret, aucune valeur du
  `.env`, aucune URL d'API ou de stockage, aucune donnée personnelle.
- **Git :** ne commite et ne pousse que sur demande de l'utilisateur.
