# Astroshare — référence pour agents de code

Point d'entrée pour un agent qui intervient sur ce dépôt : état du projet, conventions, pièges connus
et, en détail, le rendu 3D de la Lune (`MoonPhase`) et les calculs astronomiques associés.

- **État décrit** : 19 novembre 2026, branche `ASTROSHARE_V3`. Vérifie toujours le code
  avant de te fier à un détail d'ici : ce document peut avoir pris du retard.
- **Langue** : le code est commenté en français, et l'utilisateur échange en français. Garde ces deux usages.
- **Contenu versionné** : ce fichier est commité. N'y ajoute jamais de secret, de valeur du `.env`, d'URL
  d'API ou de stockage, ni de donnée personnelle.
- **Maintenance** : tout changement réalisé par un agent, une fois approuvé et commité par
  l'utilisateur, doit être reporté ici. Mets à jour les sections concernées et ajoute une entrée au
  Journal des changements (§8). Règle complète : `CLAUDE.md`.

---

## 1. Le projet en bref

Application mobile d'astronomie (Expo / React Native) : outils d'observation (calendrier lunaire,
météo, APOD, viseur polaire, météo spatiale), observatoires de l'utilisateur, compte, réglages.

### Stack

| Domaine | Choix |
|---|---|
| Base | Expo SDK 57, React Native 0.86 (nouvelle architecture), React 19.2 |
| Navigation | `expo-router` (routes dans `app/`) |
| Langage | TypeScript strict. Version installée : 6.0.3 (`devDependencies`) ; `dependencies` mentionne aussi `~5.3.3`, c'est la 6.0.3 qui est résolue |
| État global | `zustand` persisté dans AsyncStorage (`src/store/userData.store.ts`, clé `astroshare_userData`) |
| Contextes | `src/context/` : `AuthContext`, `LocationContext`, `WeatherDataContext` |
| Requêtes | `@tanstack/react-query`, helpers dans `src/helpers/api/` |
| i18n | `i18next` + `react-i18next` (voir §3) |
| Dates | `dayjs` (plugins `utc` et `timezone` étendus une fois dans `src/i18n/index.ts`) |
| Astronomie | `@observerly/astrometry` 0.67 + helpers maison dans `src/helpers/astrometry/` |
| Satellites | `satellite.js` 7.2 (propagation SGP4 locale, pur JS) + helpers maison dans `src/helpers/satellites/` |
| 3D | `three` r185 + `expo-three` 8 + `expo-gl` (voir §5) |
| Graphismes | `react-native-svg` (aussi pour les dégradés), `lucide-react-native` pour les icônes |
| Auth | Firebase |

### Arborescence

| Dossier | Rôle |
|---|---|
| `app/` | Routes `expo-router`, fichiers fins qui rendent un écran de `src/screens/` |
| `src/screens/` | Écrans, avec leurs sous-composants propres (`components/`) |
| `src/components/` | Composants réutilisables, un dossier par composant (`X.tsx` + `X.styles.ts`), regroupés par type : `buttons/`, `inputs/`, `overlays/`, `layout/`, `charts/`, `rendering/`, `media/`, `cards/`, `weather/`. `Badges/`, `MapTargetMarker/` et `ChipsContainer/` restent à la racine (seuls de leur genre) |
| `src/helpers/` | Logique pure : `api/`, `astrometry/`, `observatories/`, `variables.ts` (tokens), `globalStyles.ts`, `gradients.ts`… |
| `src/hooks/` | `useAppFonts`, `useAppUnits` (formatage des unités et dates), `useUpcomingMoonPhases`… |
| `src/i18n/` | Init i18next, `resources.ts`, fichiers `locales/<langue>/…json` |
| `src/types/` | Types partagés |
| `assets/` | Polices, images, logos SVG, textures (`assets/images/textures/`) |
| `patches/` | Patchs `patch-package` appliqués au `postinstall` (voir §5.3) |

### Build et vérification

- **App de développement :** l'app tourne dans un dev client (`expo-dev-client`), et les builds passent par EAS (scripts `build:*` de `package.json`). Toute nouvelle dépendance native impose un nouveau build du dev client : préfère les dépendances JS pures ou déjà présentes.
- **Variables d'environnement :** elles sont dans `.env`, non versionné. `.env.exemple` liste les noms. Les variables `EXPO_PUBLIC_*` sont incluses dans le bundle de l'app.
- **Typecheck :** `npx tsc --noEmit -p .`, à 0 erreur à cette date. Garde-le à 0.
- **Pas de tests ni de linter :** aucun script `test` ou `lint`. Vérifie par le typecheck et par des scripts ponctuels (voir §5.8).
- **Metro** (`metro.config.js`) :
  - `unstable_enablePackageExports = false` : les paquets sont résolus via leur champ `main`. Pour `three`, c'est `build/three.cjs`, et c'est ce fichier que le patch modifie. Ce même réglage permet aussi d'importer un sous-module précis d'un paquet (`satellite.js/dist/io.js`…) même quand son `package.json` ne déclare que `"."` dans `exports` — utile pour éviter une branche cassée dans le point d'entrée (voir `satellite.js` ci-dessous). `tsc`, lui, respecte `exports` : un import profond qui marche très bien dans Metro peut quand même être refusé par TypeScript, d'où l'entrée `satellite.js/dist/*` dans `tsconfig.json` → `paths` (même technique que `@firebase/auth`, déjà là).
  - Les `.svg` sont importés comme composants (`react-native-svg-transformer`).
  - **`satellite.js` casse le build Android** si on l'importe par `import * as satellite from "satellite.js"` : son point d'entrée réexporte aussi son module `wasm/`, qui fait un `import()` dynamique de `#wasm-single-thread` (un subpath import résolu vers un loader Emscripten pensé pour Node, qui fait lui-même `import("node:module")`). Metro trace cette branche même si elle n'est jamais appelée, et échoue sur `node:module`, introuvable en React Native. Fix : importer seulement les sous-modules réellement utilisés (`satellite.js/dist/io.js`, `propagation.js`, `transforms.js` dans `src/helpers/satellites/propagation.ts`), dont toute la chaîne de dépendances a été vérifiée sans aucune référence à `wasm/` ni à Node.

---

## 2. Conventions

- **Commentaires :** en français, ils expliquent le *pourquoi* (cause, contrainte, alternative écartée). Garde ce niveau de détail.
- **Styles :**
  - Un fichier `X.styles.ts` à côté du composant, avec des objets JS imbriqués et des littéraux `as const`. Pas de `StyleSheet.create`. Les sous-styles s'utilisent par chemin (`styles.card.header.title`).
  - Les tokens viennent de `src/helpers/variables.ts` (`app_colors`, `spacing`, `radius`, `typography`, `gaps`, `withOpacity`) et de `src/helpers/globalStyles.ts`.
- **Polices :** n'utilise que les noms déclarés dans `src/hooks/useAppFonts.ts` : `ZTNatureRegular`, `ZTNatureBold`, `ZTNatureItalic`, `DMMonoRegular`, `DMMonoMedium`. Un nom absent, `"ZTNature"` par exemple, retombe sans erreur sur la police système.
- **Barre de statut :** elle est gérée de façon impérative, écran par écran (`StatusBar.setStyle` / `setBarStyle` au montage ou au focus). Le Stack `app/settings/_layout.tsx` est en `statusBarStyle: "dark"`. `ScreenHeader` et `ImageHeaderScrollView` la basculent eux-mêmes quand une image est affichée.
- **Champs dans une ligne :** `InputWithIcon` et `SelectInput` prennent toute la largeur par défaut. Passe la prop `fill` (`flex: 1`) pour les mettre à côté d'un autre élément dans une `View` en `flexDirection: "row"`. `TabSwitch` a besoin de `fitContent` dans ce cas : sans ça, ses onglets en `flex: 1` font réclamer toute la largeur à son conteneur, à cause d'une règle de compatibilité de Yoga.
- **Listes :**
  - `ScrollView` pour un contenu court ou de taille fixe.
  - `FlatList` pour une liste longue ou de taille inconnue (exemple : `TimezoneScreen`).
  - Jamais de `FlatList` dans un `ScrollView` vertical : passe par `ListHeaderComponent` / `ListFooterComponent`.

### Pièges React Native déjà rencontrés

- **Enfant en `position: "absolute"` :** ses `width`/`height` en `%` se calculent sur la zone de contenu du parent, paddings déduits. Ses `top`/`left`/`right`/`bottom` se calculent sur la boîte entière. Pour couvrir un parent qui a un padding : les quatre bords à 0, sans `%`.
- **`<Image>` chargée par `require()` :** elle reçoit d'office la taille du fichier en `width`/`height`, qui l'emporte sur les bords à 0. Mets-la à `100%` dans un conteneur absolu sans padding. Voir `imageContainer` dans `src/components/layout/ScreenHeader/ScreenHeader.styles.ts`.
- **Bord d'un dessin SVG :** il est lissé (anti-aliasing). Si un dégradé SVG doit se raccorder à un aplat de même couleur, fais recouvrir sa dernière rangée de pixels par une vue opaque. Voir `FADE_SEAM_COVER` dans `ImageHeaderScrollView.styles.ts`.
- **Dégradés :** ne fais jamais varier un dégradé vers `"transparent"`, qui est du noir à 0 % d'opacité et salit le milieu du dégradé. Garde une seule couleur et ne fais varier que l'opacité. Pour une transition douce, utilise `easedGradientStops` (`src/helpers/gradients.ts`, courbe smoothstep), avec `<LinearGradient>` de `react-native-svg`.
- **Liste posée par-dessus la suite de l'écran (`position: "absolute"`) :** son `zIndex` ne joue qu'entre éléments voisins. Les éléments affichés après elle dans l'écran passent donc au-dessus et reçoivent les appuis à sa place. Mets la liste dans le flux, sous le champ (c'est le cas d'`InputWithIcon` et de `SelectInput`), ou dans une `Modal`.
- **Bouton dans un `ScrollView` avec le clavier ouvert :** sans `keyboardShouldPersistTaps="handled"` sur le `ScrollView`, le premier appui ne fait que fermer le clavier et n'atteint pas le bouton. C'est indispensable pour les suggestions d'un champ.
- **Clavier qui cache un champ :** `android:windowSoftInputMode="adjustResize"` est posé une fois pour toutes (`AndroidManifest.xml`, `app.config.ts` → `android.softwareKeyboardLayoutMode`), mais ne suffit pas partout :
  - **Dans une `Modal` RN, jamais.** Une `Modal` s'ouvre dans sa propre fenêtre Android (un `Dialog`), qui n'hérite pas du réglage de l'activité. `KeyboardAvoidingView behavior="height"` (pas `"padding"`, qui ne fait rien sur Android) corrige ça en redimensionnant la vue à la main — voir `AddSatelliteModal` et `SelectInput`.
  - **Sur un écran normal avec un long formulaire dans un `ScrollView`,** le redimensionnement de l'activité ne suffit pas toujours à faire remonter le `ScrollView` jusqu'au champ actif (observé sur `AddSession`, en new architecture). Même correctif : `KeyboardAvoidingView` autour du `ScrollView` (`"padding"` sur iOS, `"height"` sur Android).
  - **Sur un écran sans aucun `ScrollView`** (ex : les écrans d'auth, mise en page fixe), `KeyboardAvoidingView` seul ne fait que comprimer la mise en page sans rien rendre défilable. Il faut aussi un `ScrollView` avec `contentContainerStyle={{ flexGrow: 1 }}` — `flexGrow: 1` garde la mise en page identique (un enfant en `flex:1` poussé en bas, par exemple) tant que le contenu tient à l'écran, et ne devient défilant que si le clavier réduit trop l'espace.
  - Correctif posé écran par écran / modale par modale, pas un seul wrapper global : le `Tabs` racine (`app/_layout.tsx`) ne peut pas en porter un sans casser la barre d'onglets, qui doit rester fixe.
- **`UrlTile` (react-native-maps) avec des tuiles XYZ maison, décalées sans raison apparente :** la
  pyramide est probablement en adressage **TMS** (origine Y en bas à gauche) plutôt que **XYZ**
  (origine Y en haut à gauche, attendu par défaut) — cas typique d'un export `gdal2tiles.py` sans
  `--xyz`. La prop `flipY` de `UrlTile` corrige ça sans toucher aux tuiles elles-mêmes. Rencontré sur
  l'atlas de pollution lumineuse (`LightPollutionMapScreen`).
- **`UrlTile.maximumZ` fait disparaître la couche en zoomant plus loin que la résolution d'origine**
  (elle s'arrête net à ce niveau de zoom). `maximumNativeZ` fait l'inverse : il continue de demander
  la dernière tuile disponible et l'agrandit (un peu floue, mais toujours visible) — c'est lui qu'il
  faut pour une couche basse résolution (ex: un atlas ~1 km) sous une carte qu'on peut zoomer plus
  loin.
- **`Marker` à enfants personnalisés (react-native-maps) qui ne se met pas à jour :** la vue est
  convertie en bitmap natif une seule fois (`tracksViewChanges` ne suit pas les re-renders en continu,
  trop coûteux) — la position (`coordinate`, prop native à part) suit bien les changements, mais pas
  le contenu du bitmap (ex: une couleur qui change). Poser un `key` sur la valeur qui doit faire
  changer l'apparence (ex: `key={color}`) force un nouveau montage, donc une nouvelle capture — moins
  coûteux que `tracksViewChanges` toujours actif pour un marqueur unique.
- **Pas de librairie de slider dans le projet :** les pistes glissables (lecture du radar météo,
  opacité d'une couche de carte) sont un `PanResponder` natif sur une zone mesurée au `onLayout` —
  voir `WeatherRadarMap` (calée sur des frames discrètes) et `OpacitySlider` du dossier Pollution
  lumineuse (continue, 0 à 1) pour le gabarit à reprendre plutôt que d'ajouter une dépendance.

### Formatage (`src/helpers/format.ts`)

- **Passer par `formatDate`** (`useAppUnits`) pour toute date affichée : il respecte le fuseau et le réglage UTC de l'utilisateur.
- **`formatShortMonth(date)`** : mois abrégé de la langue, sans point final (« janv », « jan », « gen »), pour les pastilles de date. Il n'est pas coupé à 3 lettres, sinon juin et juillet donneraient tous deux « jui ».
- **`formatCompactDuration(minutes)`** : durée compacte, sans traduction (« 50 min », « 1h05 », « 2h », « -30 min »). C'est le format des durées de session du Journal.
- **`formatDuration(seconds, t)`** : durée traduite, via une clé `duration` propre à chaque namespace. Elle attend des **secondes**, alors que les `startTime`/`endTime` d'une session sont en **millisecondes** : leur passer l'écart brut multiplie la durée par 1000.
- **`formatLocationLabel(location, fallback)`** : nom affiché du lieu d'une session. Il prend `display_name` (le nom choisi pour un observatoire) avant `name`, car un `Observatory` hérite aussi de `name` via `GpsLocation`, qui n'est que le nom géocodé du lieu.

### Catalogue d'objets (`src/types/catalog/CatalogObject.ts`, `src/helpers/api/catalog/objects.ts`)

- **Routes :** `/v3/objects` (liste paginée et filtrable), `/v3/objects/search` (recherche, déjà triée par le serveur : ne pas retrier) et `/v3/objects/:id` (fiche complète). Elles sont publiques, sans jeton.
- **Identifiant :** référence toujours un objet par son `id` stable (`NGC1976`, `HIP69673`, `SS-MARS`), jamais par un index.
- **Unions ouvertes :** `kind`, `category`, l'unité de distance et `ephemeris.provider` peuvent recevoir des valeurs que l'app ne connaît pas encore. Traite-les toujours avec un cas par défaut.
- **Objets du système solaire** (`kind: "solar_system"` : Soleil, Lune, planètes) :
  - `position`, `magnitude` et `distance` valent `null`, car ces objets bougent. Leur position se calcule à la date voulue d'après `solar_system.ephemeris`. Les filtres `maxMag` et `bbox` de la liste les excluent d'office.
  - `ephemeris.provider` vaut aujourd'hui `"observerly"` (calcul local avec `@observerly/astrometry`). Les comètes et astéroïdes arriveront avec `"orbit"` et des éléments orbitaux dans `solar_system.orbit`, pas encore typés.
  - `solar_system.facts` est un dictionnaire libre (masse, diamètre, période orbitale…) : vérifie le type de chaque valeur à l'usage.
  - À confirmer côté API : sa doc annonce `"ly" | "yr"` pour l'unité de distance, et `"yr"` ressemble à une coquille. Les blocs `photometry`, `physical`, `discovery`, `content` et `custom` de la fiche complète sont typés non nuls ; à vérifier sur une vraie réponse d'objet du système solaire.
- **Affichage dans une liste :** `getCatalogObjectTitle` et `getCatalogObjectSubtitle` (`src/helpers/journal/sessions.ts`). Le sous-titre traduit la catégorie via `tools/journal/sessions/add` (`observedObjects.categories`) : toute nouvelle catégorie de l'API doit y être ajoutée dans les trois langues, sinon sa valeur brute s'affiche. Le libellé de catalogue (Messier, NGC, IC) n'est déduit que d'un préfixe suivi d'un numéro, pour ne pas étiqueter « IC » un nom comme « Icarus ».

### Suivi de satellites (`src/types/satellites/`, `src/helpers/api/satellites/`, `src/helpers/satellites/`)

- **Routes :** `/v3/norad` (catalogue CelesTrak — liste paginée, recherche par id ou par nom partiel
  insensible à la casse, lot par liste d'ids) et `/v3/satellite` (relais N2YO — TLE, position
  instantanée, passages visibles). Helpers : `src/helpers/api/satellites/norad.ts` et `tracking.ts`,
  même principe try/catch/`console.log`/`null` que `getLauncherById`.
  - **`/v3/norad/:query` (recherche par id ou nom) pagine en opt-in** (`page`/`limit`, mêmes bornes
    que la liste principale : défaut 100, max 500) : sans ces paramètres, la réponse garde sa forme
    d'origine (`{ data: [...] }`) ; avec, elle devient `{ page, limit, total, data }`. Sans pagination,
    une requête large comme "starlink" renvoie plus de 13 000 résultats d'un coup — vérifié en
    direct. `findNoradSatellites` (sans pagination, compat ascendante) et `searchNoradSatellites`
    (paginée, `norad.ts`) coexistent : la seconde sert à `useSatelliteNameSearch`
    (`src/hooks/useSatelliteNameSearch.ts`), qui alimente le champ "Nom" d'`AddSatelliteModal` en ne
    demandant que les ~30 résultats affichés, avec le total réel du serveur pour signaler qu'il y en
    a davantage.
- **Unions ouvertes :** `object_type.label`, `ops_status.label` (catalogue) et `quality` d'un passage
  (suivi) sont des identifiants à traduire, pas du texte à afficher tel quel — toujours un cas par
  défaut (`src/helpers/satellites/labels.ts`).
- **Position et trace au sol calculées localement (SGP4, `satellite.js`), pas via l'API en boucle :**
  `/v3/satellite/position` plafonne à 300 s par appel, insuffisant pour la fenêtre de trace (45 min
  passées + 90 min à venir) de la fiche satellite. Un seul TLE récupéré à l'ouverture de l'écran
  suffit ensuite à tout calculer côté app (`src/helpers/satellites/propagation.ts`), même principe que
  les calculs Soleil/Lune (§5). Position live rafraîchie toutes les secondes, trace au sol toutes les
  60 s, chacune dans son propre `useFocusEffect`/`setInterval`, actif seulement tant que l'écran a le
  focus.
- **Satellites mis en avant (`src/helpers/satellites/featured.ts`) résolus par recherche de nom**, pas
  par id NORAD codé en dur : la route catalogue accepte un nom partiel, ce qui évite de fabriquer un id
  non vérifié.
- **Carte du monde (`SatelliteGroundTrackMap`) :** tracé SVG maison en pointillés (`<Pattern>` +
  `<Circle>` de `react-native-svg`), projection équirectangulaire simple, données terrestres Natural
  Earth 1:110m (domaine public). Pas de `react-native-maps` : rendu 2D stylisé choisi plutôt qu'une
  vraie carte, pour rester fidèle à la maquette sans dépendance supplémentaire. Le point de position
  actuelle a un halo animé en boucle (`Animated.Circle` de `react-native-svg`, rayon/opacité
  interpolés, `useNativeDriver: false` — pas de pilotage natif possible sur des props SVG). Prop
  `embedded` : désactive le fond/arrondi/padding propres au composant quand il est posé dans un bloc
  déjà sombre (voir le header fusionné de `SatelliteDetailsScreen`, §4 `ScreenHeader`).
- **Accès PRO :** `isProUser(authUser)` (`src/helpers/auth/subscription.ts`) teste `role` parmi
  `SUBSCRIBER`/`PARTNER`/`ADMIN`. Premier usage de ce genre de garde dans l'app ; généralisé en
  `LockedFeatureCard` (§4) plutôt que construit en carte unique pour cet écran, puisqu'un même besoin
  (TODO déjà présent dans `SpaceWeatherScreen`) existait déjà ailleurs.
- **« Mes satellites » :** liste purement locale (`trackedSatellites: number[]` dans
  `userData.store.ts`), l'API n'a pas de liste de suivi côté serveur — même principe que
  `observatories`/`pinnedTools`.

### Carte de pollution lumineuse (`src/screens/Tools/LightPollutionMap/`)

Outil entièrement PRO (`access: "premium"` dans `tools.ts`, contrairement au suivi de satellites qui
n'a qu'une section PRO) : `isProUser` gate l'écran entier, `LockedFeatureCard` sinon (même pattern que
« Mes satellites », §4). Carte plein écran immersive : pas de `ScreenHeader` classique, un chevron
retour flottant à la place (écran dédié, pas une modale par-dessus un autre écran) — format et langage
visuel (boutons ronds translucides puis, après une retouche demandée par l'utilisateur, cartes
blanches) inspirés de `WeatherRadarMap` en plein écran (§4).

- **Réutilise `LocationContext.fetchLocation` plutôt que d'appeler l'API directement** : cette
  fonction (déjà utilisée ailleurs dans l'app) géocode un nom de ville **et** interroge
  `/v3/lightpollution` pour ses coordonnées en un seul appel. Elle accepte aussi des coordonnées
  directes via une requête `"lat::lon"` (géocodage inverse + pollution lumineuse) — c'est ce qui sert
  à la sélection par appui sur la carte, sans code API supplémentaire.
- **Pas de sélection au départ :** la carte s'ouvre neutre (pas de marqueur ni de carte de résultat),
  seulement centrée sur la position « effective » de l'app (observatoire actif ou GPS) pour orienter
  la vue. Une recherche, un appui sur la carte ou le bouton « ma position » choisissent un lieu ; le
  bouton ✕ de la carte de résultat revient à « rien sélectionné ».
- **Style de carte sombre** (`src/helpers/map/darkMapStyle.ts`) : tableau `customMapStyle` Google Maps
  standard (routes/POI/transports masqués, libellés clairs), entièrement côté client.
- **Tuiles de l'atlas (World Atlas 2015) en overlay (`UrlTile`) :** `flipY` nécessaire (pyramide TMS,
  voir le piège §2). `maximumNativeZ` (pas `maximumZ`, voir le même piège) plafonné à la résolution
  d'origine (~1 km) pour que la couche reste visible (agrandie) en zoomant plus loin plutôt que de
  disparaître — valeur choisie par hypothèse, jamais vérifiée en direct (hôte des tuiles injoignable
  depuis un agent). Opacité réglable par l'utilisateur (`OpacitySlider`, voir le piège §2 sur les
  sliders maison), 75 % par défaut.
- **`MapTargetMarker`** (`src/components/MapTargetMarker/`, partagé) a gagné une prop `color`
  optionnelle (jaune par défaut, inchangé pour ses autres usages) : colore le marqueur selon le niveau
  Bortle du point affiché (`app_colors.bortleScale`). `key={color}` sur l'usage ici — voir le piège §2
  sur les `Marker` à enfants personnalisés qui ne suivent pas un changement de couleur seul. Un premier
  essai avec un marqueur-étiquette maison (nom du lieu accolé) a été abandonné : l'utilisateur a
  préféré un point seul, plus proche de ce que `MapTargetMarker` fait déjà ailleurs dans l'app.
- **`BortleScaleBar`** (composant local à l'écran) : dégradé `app_colors.bortleScale` en SVG (même
  technique que `StepTwo`, §4), en petit pour la légende statique et en grand avec le niveau courant
  mis en évidence pour la carte de résultat.
- **« Voie lactée visible/invisible » et « Magnitude limite » ne sont pas des données API**
  (`/v3/lightpollution` ne renvoie que `bortle`/`mpsas`/`location`/`source`) : valeurs de référence
  standard de l'échelle de Bortle, ajoutées dans `src/helpers/lightPollution/lightPollution.ts`
  (`getLightPollutionLimitingMagnitude`, `isMilkyWayVisible`) et `common.json` →
  `lightPollution.limitingMagnitude` (fr seulement, comme le reste du bloc `lightPollution` — jamais
  traduit en/it, trou pré-existant non comblé ici, voir §7).

### Météo spatiale (`src/screens/Tools/SpaceWeather/`)

- **Contrat API migré :** les routes `/kpi`, `/wind`, `/imf`, `/scales`, `/flares`, `/sun` et
  `/outlook` renvoyaient auparavant des `label` déjà traduits en français ; elles exposent maintenant
  des identifiants stables (`level`, nouveaux champs de type comme `NoaaSeverity`,
  `SolarFlareActivity`, `SunWavelengthLabel`…) à traduire côté app. Chaque identifiant a son
  dictionnaire dans `tools/spaceWeather.json` (`imagery.wavelengths.*`, `magneticField.level.*`,
  `scales.severity.*`, `solarFlares.activity.*`), dupliqué à l'identique en fr/en/it (vérifié : même
  jeu de clés dans les 3 fichiers). Plus aucun code ne doit lire un champ `label` comme texte
  affichable directement sur ces routes.
- **Deux nouvelles routes :** `/v3/solarweather/aurora` (prévision NOAA Ovation ; probabilité
  "ici" seulement si `lat`/`lon` passés) et `/v3/solarweather/outlook` (tendance Kp sur 27 jours, pas
  de `label` malgré un exemple de doc qui en montrait un — vérifié en direct, le champ n'existe pas).
  Helpers : `src/helpers/api/spaceWeather/aurora.ts` et `outlook.ts`, même principe que les autres
  fichiers du dossier.
- **Écran scindé en une carte par section** (`src/screens/Tools/SpaceWeather/components/`),
  l'ancien fichier faisant plus de 700 lignes : `SunImageryCard`, `SunSummaryCard`, `KpCard`,
  `OutlookCard`, `NoaaScalesCard`, `MagneticFieldCard`, `AuroraForecastCard`, `SolarWindCard`,
  `EventsCard`. Chaque carte récupère ses propres données au focus de l'écran (même philosophie que
  le reste de l'app), avec deux exceptions volontaires :
  - `imf`/`solarWind` restent récupérés dans l'écran parent et passés en prop à `MagneticFieldCard`/
    `SolarWindCard` : ils partagent un seul minuteur de rafraîchissement de 5 min côté API, un par
    endpoint aurait dédoublé ce minuteur ;
  - `noaaScales` est volontairement dupliqué entre `KpCard` (pour son badge) et `NoaaScalesCard` :
    appel léger, préféré au fil de props entre deux cartes sœurs sans lien direct.
  `SpaceWeatherScreen.tsx` ne garde que `ScreenHeader`, l'effet `imf`/`solarWind` et la composition
  des cartes ; `SpaceWeatherScreen.styles.ts` a été supprimé (plus aucun style au niveau de l'écran).
- **Bloc « chez vous » d'`AuroraForecastCard` :** remplace un badge peu lisible par un encart coloré
  (icône + titre + probabilité en grand) juste au-dessus de l'image sélectionnée. Le titre s'adapte à
  la position réellement utilisée par l'app (`useLocation().isUsingObservatory` /
  `activeObservatory`) : nom de l'observatoire actif s'il y en a un, « Chez vous » seulement en
  position GPS — éviter d'afficher « Chez vous » pour la position d'un observatoire enregistré
  ailleurs.

---

## 3. Internationalisation

- **Où sont les traductions :** `src/i18n/resources.ts` est la source unique, partagée par l'init (`src/i18n/index.ts`) et par le calcul de complétude (`src/i18n/translationCompleteness.ts`, écran Langue).
- **Nom d'un namespace :** c'est le chemin du fichier depuis `locales/<langue>/`, sans extension. Exemple : `useTranslation("settings/addObservatory")` correspond à `locales/<langue>/settings/addObservatory.json`. Le `/` dans un nom de namespace fonctionne avec i18next, et la syntaxe `ns:clé` aussi (`t("settings/addObservatory:stepTwo.title")`).
- **Ajouter un namespace :** crée le JSON dans chaque langue, puis ajoute l'import et l'entrée dans les trois blocs de `resources.ts`.
- **Clés :** une clé ne répète pas le nom de son namespace (`t("recap.sessions")`, pas `t("profile.recap.sessions")`).
- **Langues :** `fr` est la langue de référence et de repli. `en` et `it` peuvent être partielles : les clés absentes retombent sur le français. Tous les namespaces ont désormais un fichier dans les trois langues.
- **Ne pas traduire au chargement d'un module :** un `i18next.t()` exécuté à l'import, comme les `label` de `src/helpers/observatories/observatories.ts`, est figé dans la langue du démarrage. Traduis dans le composant avec `t()`. Exemple : les options de type de lieu dans `StepTwo.tsx`. Pour une fonction déclarée hors du composant, passe-lui `t` en paramètre (exemple : `getCatalogObjectSubtitle` dans `src/helpers/journal/sessions.ts`).
- **Clé d'un autre namespace :** une fonction partagée par des écrans de namespaces différents peut viser une clé précise avec `ns:clé`, quel que soit le namespace du `t` reçu. Exemple : `getCatalogObjectSubtitle` lit `tools/journal/sessions/add:observedObjects.categories.…`, depuis `AddSession` comme depuis `SessionDetails`.
- **Composants partagés :** un composant réutilisable traduit lui-même ses libellés fixes dans `common`, sous une clé à son nom (`locationMapCard`, `usefulNightCard`, `downloadButton`). Les textes qui dépendent de l'écran restent passés en props, déjà traduits.
- **Namespaces imbriqués :** un écran peut avoir son propre fichier sous celui de sa section. Par exemple, `tools/journal/sessions/add` (formulaire d'ajout de session) se trouve dans `locales/<langue>/tools/journal/sessions/add.json`, à côté de `tools/journal.json`. Le fichier `journal.json` et le dossier `journal/` coexistent sans problème.

---

## 4. Composants d'interface notables

### `ScreenHeader` (`src/components/layout/ScreenHeader/`)

- **Variantes :** `main` (fond foncé, titre blanc) ou secondaire (`main={false}`, fond clair).
- **Prop `image` :** elle n'agit que sur un header secondaire. Le header passe à `IMAGE_HEADER_HEIGHT` (250), affiche l'image en fond avec un dégradé sombre léger, passe le texte et le chevron en blanc, et met la barre de statut en icônes claires tant que l'écran a le focus. L'utilisateur a demandé de ne pas modifier la mise en page du texte dans cette variante : seules les couleurs changent.
- **Sous-titre en `main` :** longtemps réservé au header secondaire (`!main`), il s'affiche désormais aussi en `main` (texte blanc atténué, style `subtitle.onDark`).
- **Prop `compact` :** en `main`, ramène le titre à la taille de la variante secondaire (20px) tout en gardant le blanc — pour un header fusionné avec un bloc attenant qui reprend déjà le titre en grand (voir `SatelliteDetailsScreen` ci-dessous). Sans effet si `!main`.
- **Prop `backgroundColor` :** remplace la couleur de fond par défaut (celle de `main`/secondaire), sans toucher à la couleur du texte/bouton retour ni à l'affichage du sous-titre, qui restent pilotés par `main` seul.
- **Prop `customElement` :** rendu juste sous le titre/sous-titre (déclarée de longue date dans l'interface, jamais câblée avant — maintenant branchée).
- **Fusionner le header avec un bloc attenant (même fond, un seul bord arrondi en bas)** : header en `main` sans `title`, puis un `View` juste en dessous avec le même `backgroundColor: app_colors.primary.main` et l'arrondi (`radius.heroCard`) uniquement sur les coins du bas — aucun des deux blocs n'a de gap ni de radius en haut, donc ils se lisent comme une seule pièce. Pattern déjà utilisé par `ProfileScreen` (photo de profil), repris par `SatelliteDetailsScreen` (titre en `compact` directement dans le header, puis badges + carte de trace au sol dans le bloc attenant).

### `Button` (`src/components/buttons/Button/`)

- **Composant de base pour toute action bouton** (icône + libellé) : remplace les boutons écrits à la main dans la quasi-totalité de l'app (Profile, Auth, Observatories, Journal, tout l'écran Matériel).
- **Variantes (`variant`)** : `color` (accent.main, action principale, défaut), `danger` (rouge plein, action destructive — pas la version atténuée red.light/red.main), `info` (habillage `defaultCard` de `globalStyles.ts`, texte/icône en accent.main, action secondaire qui doit se fondre dans une liste de cartes).
- **`label` facultatif :** un bouton icône seule reste possible (ex : supprimer sans texte, `ObservatoryDetails`).
- **`loading` :** remplace icône + texte par un `ActivityIndicator`, sans changer la taille ni le style du bouton (ex : soumission de `LoginScreen`).
- **`iconPosition` :** `"left"` (défaut) ou `"right"` (ex : boutons « suivant » d'`AddNewObservatory`, où la flèche suit le texte).
- **`disabled` :** comme avant cette migration, ne donne aucun retour visuel ni message — voir §7.

### `InfoTooltip` (`src/components/overlays/InfoTooltip/`)

- **Rôle :** icône « i » qui ouvre une modale flottante **centrée** (titre + description), pour expliquer une carte sans occuper de place dedans en permanence. Généralise les icônes `Info` posées sans action dans `SpaceWeatherScreen.tsx` (champ magnétique, vent solaire).
- **Différence avec `DayDetailModal`** (`MoonCalendar`) : celle-ci est un panneau du bas (`animationType="slide"`, radius en haut seulement). `InfoTooltip` est centrée (`animationType="fade"`, radius sur les quatre coins), pour un contenu court.
- **Props :** `title`, `description` (déjà traduits par l'appelant), `iconSize`/`iconColor` facultatifs.
- **Fermeture :** tap sur le fond, ou sur la croix dans l'en-tête de la carte.

### `ImageHeaderScrollView` (`src/components/layout/ImageHeaderScrollView/`)

- **Rôle :** un écran dont le header à image défile avec le contenu. Utilisé dans `ObservatoryDetails`.
- **Défilement :** l'image défile en parallaxe, deux fois moins vite que le contenu (`IMAGE_PARALLAX_SPEED`). Le contenu, opaque, glisse par-dessus.
- **Barre compacte :** le header secondaire classique apparaît en fondu, collé en haut, une fois l'image sortie. La barre de statut bascule aussi à ce moment.
- **Fondu de l'image :** il est attaché au haut du **contenu**, pas au header. Avec la parallaxe, un fondu fixé au header laisserait apparaître une ligne nette.
- **Chevauchement :** le contenu remonte de `CONTENT_OVERLAP` (40 px) sur la fin du fondu.
- **Pas de `FlatList` dans le contenu :** c'est un `ScrollView`. L'utilisateur s'engage à ne pas y mettre de `FlatList`.

### `SelectInput` (`src/components/inputs/SelectInput/`)

- **Composant contrôlé :** `options: { label, value }[]`, avec `value` et `onChange`. `multiple` sert de discriminant de type : `T | null` en choix simple, `T[]` en choix multiple. Les valeurs y restent dans l'ordre des options.
- **`NoInfer` sur `value`/`onChange` :** sans lui, l'inférence du type échoue en choix multiple. Il demande TypeScript 5.4 ou plus.
- **`presentation` :** `"dropdown"` (liste sous le champ) ou `"sheet"` (panneau `Modal` avec `FlatList`, recherche facultative via `searchable`). Par défaut, le panneau s'ouvre au-delà de `SHEET_OPTIONS_THRESHOLD` (8) options.
- **Options construites depuis une liste d'ids :** type les ids avec l'union attendue (exemple : `observatoriesTypes` typé `ObservatoryType`).

### `InputWithIcon` : suggestions (`src/components/inputs/InputWithIcon/`)

- **Liste :** dans le flux, collée sous le champ, hauteur plafonnée (`maxHeight`) et rendue en `FlatList` (pas un `ScrollView`+`.map()`) : une recherche large peut renvoyer des milliers de résultats (ex: recherche par nom de satellite), et seule une liste virtualisée les supporte sans ralentir le rendu. Elle pousse le contenu en dessous tant qu'elle est ouverte, ne passe plus par-dessus, à cause du piège de la §2.
- **Dans un `ScrollView` :** il faut `keyboardShouldPersistTaps="handled"` (§2), sinon le premier appui sur une suggestion est perdu.
- **Après un choix :** la liste est masquée par un état à part (`suggestionsDismissed`), remis à zéro à la frappe suivante. Le champ garde le focus. Ne force jamais `isFocused` à `false` à la main : le champ resterait actif et les suggestions ne réapparaîtraient plus.
- **`onFocus`, `onBlur` et `onChangeText` de l'appelant :** ils sont appelés en plus de ceux du composant, pas à leur place.

### Cartes du Journal (`src/components/cards/`)

- **`IconButtonCard` :** carte-bouton avec une pastille de 44 px à gauche, un titre et un sous-titre.
  - La pastille contient une icône (`icon`) ou une date (`date` : jour et mois abrégé, qui l'emporte sur l'icône). Il faut au moins l'un des deux, le type l'impose.
  - Autres props : `badgeBackgroundColor`/`badgeContentColor`, `fill` pour partager une ligne, et `selected` pour un choix unique (fond violet clair, bordure violette).
- **`ObservationCard` :** une observation, avec une illustration ronde (disque sombre sans `image`), la désignation, le nom et les détails. Le chevron est toujours affiché.
- **`SessionCard` :** une session, sur carte sombre. Elle montre une pastille de date, le lieu, les horaires, et une colonne par note (`grades: { label, value }[]`, note sur `MAX_GRADE` = 5).
- **`CheckboxCard` :** carte cochable qui contient la `Checkbox`. Toute la carte coche ou décoche. La `Checkbox` n'y est qu'un indicateur (`pointerEvents="none"`, masquée pour l'accessibilité), pour éviter un double déclenchement et une case annoncée deux fois.
- **`ObjectCardLite` :** ligne d'objet observé, avec trois pastilles (oculaire, photo, dessin) et un bouton de suppression. `onPress`, `onRemove` et l'action de chaque pastille sont facultatifs : sans eux, la ligne est en lecture seule, avec des pastilles qui ne servent que d'indicateurs et sans bouton de suppression (exemple : `SessionDetails`).
- **Toutes ces cartes :** sans `onPress`, elles ne réagissent pas au toucher. Les textes arrivent déjà formatés et traduits par l'appelant.

### `LocationMapCard` (`src/components/cards/LocationMapCard/`)

- **Rôle :** carte d'un lieu. Elle montre une mini-carte centrée sur le point (`MapTargetMarker`), la latitude et la longitude en DMS, l'altitude, et deux boutons : « Copier » (les coordonnées) et « Itinéraire » (Plans sur iOS, Google Maps ailleurs). Elle sert dans `ObservatoryDetails` et `SessionDetails`.
- **Props :** `latitude`, `longitude` et `elevation`. Une altitude nulle ou absente s'affiche « Inconnue » ; 0 m reste une vraie valeur.
- **Recentrage :** `initialRegion` de `MapView` n'agit qu'au premier rendu. Le composant recentre donc la carte (`animateToRegion`) quand les coordonnées changent, par exemple au retour sur la fiche d'un observatoire qu'on vient de modifier.
- **Traductions :** `common`, clé `locationMapCard`.

### Journal d'observation : enregistrement d'une session (`AddSession`)

- **Store :** `addAstronomySession(session)` ajoute la session à `statistics.astronomySessions` (`src/store/userData.store.ts`). Type : `AstronomySession` (`src/types/statistics/AstronomySession.ts`).
- **Objets observés :** `observedObjects: SessionObservedObject[]`, c'est-à-dire l'objet du catalogue (`/v3/objects`) et trois bascules : oculaire, photo, dessin. `astrophotos` et `drawings` en sont déduits.
- **Lieu :** un observatoire choisi dans la liste (l'observatoire actif est présélectionné) ou la position GPS lue par `LocationContext`. C'est la seule condition pour enregistrer.
  - Pour un observatoire, la session garde une **copie sans l'image** (`location`), plus `observatoryId`. La copie reste lisible si l'observatoire change ou disparaît, et la photo en base64 n'est pas recopiée dans chaque session.
- **Setups :** seuls leurs ids sont gardés pendant la saisie. Les vrais `Setup` sont retrouvés dans le store au moment d'enregistrer, donc à jour.
- **Notes de ciel :** 0 (aucune étoile touchée) est enregistré comme `null`. Les champs `observations` (météores, comètes, etc.) ne sont pas encore saisis : ils valent `false`.
- **Affichage d'une session enregistrée** (écran Journal, `SetupDetails`, `SessionDetails`) : horaires avec `formatDate(...).format("HH:mm")`, durée avec `formatCompactDuration(getSessionMinutes(session))` (`src/helpers/journal/sessions.ts`), lieu avec `formatLocationLabel` (§2). Une note `null` s'affiche comme 0.
- **Écran Journal :** ses libellés sont traduits (`tools/journal`, fr, en, it). La carte « Dernière session » et les trois sessions récentes viennent du store et mènent à la fiche de la session. Les autres valeurs restent factices, en dur, en attendant d'être branchées sur le store : seeing moyen, lieux visités, dernier objet observé, statistiques d'objets, succès, nombres du raccourci Matériel.

### Journal d'observation : fiche d'une session (`SessionDetails`)

- **Route :** `/tools/journal/sessions/[id]`. On y arrive depuis l'écran Journal (dernière session, sessions récentes) et depuis la fiche d'un setup.
- **Contenu :** `SessionCard` en résumé (date complète en surtitre), compteurs d'objets (observés, photographiés, dessinés), `LocationMapCard`, objets observés en lecture seule (`ObjectCardLite`), setups utilisés, notes, bouton de suppression.
- **Données d'origine :** le lieu et les setups affichés sont les copies enregistrées avec la session. Le lien « Voir l'observatoire » (en-tête de la section Lieu) et le lien de chaque setup n'apparaissent que si l'élément existe encore dans le store.
- **Suppression :** `removeAstronomySession(id)`, sans confirmation, comme les fiches du matériel. La sortie de l'écran se fait dans un `useEffect`, quand la session a disparu : `router.back()`, ou `router.replace("/tools/journal")` s'il n'y a pas d'historique.
- **Pas de bouton Modifier :** `AddSession` ne sait pas encore se préremplir à partir d'une session existante (§6).
- **Traductions :** `tools/journal/sessions/details`.

### Observatoires : ajout et modification (`AddNewObservatoryScreen` / `StepOne`)

- **Un seul écran pour les deux :** malgré son nom et `StepTwo.tsx` encore présent, le flux à deux étapes n'est pas actif (`currentFormStep` est commenté dans `AddNewObservatoryScreen.tsx`) — `StepOne.tsx` porte tout le formulaire (lieu, type, équipements, tags, notes, image). `StepTwo.tsx` ne sert plus qu'à fournir ses styles (`addNewObservatoryStepTwoStyles`, image picker) à `StepOne`.
- **Modification :** même principe que les formulaires de matériel (Gear) — `?id=` en query param (lu dans `AddNewObservatoryScreen.tsx` pour le titre, dans `StepOne.tsx` pour le reste). `StepOne` préremplit tous ses champs locaux par lazy `useState`, et initialise `newObservatory` (le `Context`) par un `useEffect` au montage, qui recentre aussi la carte (`animateToRegion`) — `initialRegion` de `MapView` n'agit qu'au tout premier rendu, insuffisant si le store se réhydrate après coup.
- **Enregistrement :** `id`/`createdAt`/`shared` sont conservés en modification (`updateObservatory`), régénérés en création (`addObservatory`). Retour à l'écran précédent (`router.back()`) en modification, vers la liste (`router.replace`) en création.
- **Bouton Modifier** (`ObservatoryDetails.tsx`) : pousse vers `/settings/observatories/addNewObservatory?id=...`. Il pointait vers la liste des observatoires avant correction.

### `WeatherRadarMap` (`src/components/weather/WeatherRadarMap/`)

Carte radar de l'outil Météo (`react-native-maps`, fournisseur Google). Elle a deux couches de tuiles
`UrlTile`, chargées directement depuis les fournisseurs : les précipitations, animées, et les nuages.
Une version plein écran est affichée dans une `Modal`.

- **Données :** `GET /v3/weather/radar` (`src/helpers/api/weather/radar.ts`, jeton Firebase en `Bearer`),
  lu via `WeatherDataContext`. Le type est dans `src/types/weather/Radar.ts`.
  - Précipitations : fournisseur **LibreWXR** (remplaçant compatible de l'API RainViewer v2). Une frame
    toutes les 10 min, triées chronologiquement : environ 2 h d'historique observé
    (`is_forecast: false`), puis environ 1 h de prévision (`is_forecast: true`). La prévision est
    expérimentale, sans garantie de service, et **peut être vide**.
  - Nuages : OpenWeatherMap, **vue instantanée uniquement**, ni historique ni prévision. Leur URL contient
    une clé en clair, ce qui est voulu : c'est la raison pour laquelle la route est protégée.
- **Règle :** ne suppose jamais un nombre fixe de frames. Seul `is_forecast` sépare l'observé de la prévision.
- **« Maintenant » :** c'est la dernière frame observée. La carte s'ouvre et revient en pause sur elle
  après chaque actualisation, et non sur la dernière frame de la liste, qui serait une prévision.
- **Piste de lecture :** un repère « maintenant », une zone prévision teintée, et la mention
  « Observé » ou « Prévision » sous l'heure. Ces éléments n'apparaissent que s'il y a des prévisions.
  Le bloc de l'heure a une largeur fixe dans ce cas, pour que la piste ne change pas de largeur
  pendant le glissé.
- **Nuages suspendus** (`cloudsSuspended`) : ils sont masqués pendant toute l'animation, et à l'arrêt sur
  une frame de prévision. Ils sont affichés seulement à l'arrêt sur une frame observée. Le bouton
  nuages garde le choix de l'utilisateur et apparaît grisé (style `suspended`).
- **Piège, l'opacité de `UrlTile` :** elle sert à masquer les nuages sans retélécharger les tuiles.
  react-native-maps l'implémente sur Android, mais **pas pour Google Maps sur iOS**
  (`AIRGoogleMapUrlTile`). Sur iOS, la couche est donc retirée, puis remontée.
- **Piège, `key` d'une `UrlTile` :** un changement de `urlTemplate` sur une `UrlTile` déjà affichée n'est
  pas toujours redessiné, à cause du cache natif. D'où le `key` égal à l'URL de la tuile.
- **Zoom maximal :** plafonné à 12 (`MAX_MAP_ZOOM_LEVEL`), sur la carte comme sur les tuiles.
- **Traductions :** `tools/weather`, en français seulement pour l'instant.

### `LockedFeatureCard` (`src/components/cards/LockedFeatureCard/`)

- **Rôle :** carte générique pour une fonctionnalité réservée aux comptes PRO (icône, titre,
  description, bouton d'action). Généralisée depuis le TODO laissé dans `SpaceWeatherScreen.tsx` à
  l'occasion de la section « Mes satellites » de l'écran Satellites — à réutiliser pour toute future
  zone verrouillée, plutôt que d'en refaire une par écran.
- **Condition d'affichage :** toujours testée côté appelant via `isProUser(authUser)`, jamais dans le
  composant lui-même.
- **CTA :** le bouton n'a pour l'instant aucune action câblée (pas d'écran PRO/abonnement dans l'app) —
  voir §6.

### `SatelliteGroundTrackMap` (`src/components/charts/SatelliteGroundTrackMap/`)

- **Rôle :** carte du monde en pointillés (continents en `<Pattern>` de points SVG, projection
  équirectangulaire), avec la trace au sol d'un satellite (passé en trait blanc pointillé, futur en
  trait jaune plein), la position de l'observateur et la position courante du satellite.
- **Antiméridien :** la trace est coupée en plusieurs `<Path>` dès qu'un saut de longitude dépasse
  180° entre deux points consécutifs, pour éviter un trait horizontal parasite traversant toute la
  carte.
- **Données terrestres :** `src/helpers/satellites/worldLandPath.ts`, généré une fois depuis Natural
  Earth 1:110m (domaine public) — voir le commentaire du fichier pour régénérer si besoin.

### `PassArcChart` (`src/components/charts/PassArcChart/`)

- **Rôle :** arc d'élévation d'un passage de satellite (début → pic → fin), dessiné avec deux courbes
  de Bézier quadratiques se rejoignant exactement au point de pic connu — pas de bibliothèque de
  lissage, dans le même esprit que `AltitudeChart`/`CircularGauge` (mesure de largeur par `onLayout`,
  `Svg`/`Path`/`SvgText` à la main).

---

## 5. Rendu 3D de la Lune : `MoonPhase`

Fichier : `src/components/rendering/MoonPhase/MoonPhase.tsx`. Calculs : `src/helpers/astrometry/moon/orientation.ts`.

### 5.1 Rôle et utilisation

Rendu 3D local de la Lune pour une date, sans appel réseau. Il remplace les images que servait
l'ancienne API Astroshare (endpoint `/moon/illustration`, voir l'historique git avant le commit
`01b5fb5`). Ces images venaient très probablement de la NASA (« Moon Phase and Libration », SVS /
Dial-A-Moon) : PNG 730×730, nord céleste en haut. Ce sont elles qui ont servi de référence visuelle.

```tsx
<MoonPhase date={new Date()} size={150} />                                    // nord céleste en haut
<MoonPhase date={new Date()} size={150} observer={{ latitude, longitude }} /> // vue du ciel de l'observateur, à l'instant
<MoonPhase date={phaseDate} size={64} observer={obs} skyOrientationTime="meridian" />
```

| Prop | Rôle |
|---|---|
| `date` | Instant représenté (libration, phase, orientation) |
| `size` | Côté du carré en points (défaut 100) |
| `style` | Style du conteneur |
| `observer?` | `GeographicCoordinate` (`@observerly/astrometry`). Si présent, l'image pivote pour mettre le zénith en haut (Lune retournée vue de l'hémisphère Sud). Sinon : nord céleste en haut |
| `skyOrientationTime?` | `"instant"` (défaut) : orientation à `date`, le disque tourne au fil de la nuit. `"meridian"` : orientation au passage au méridien, pour une vue qui représente un jour ou une phase sans heure d'observation précise |

Appels actuels :

| Endroit | Réglage |
|---|---|
| `TonightView` (grande lune) | `observer` + `"instant"` |
| `TonightView` (4 prochaines phases) | `observer` + `"meridian"` |
| `DayDetailModal` | `observer` + `"meridian"` |
| `DayCell` (grille du mois) | **Pas** de 3D : une instance par cellule ouvrirait jusqu'à 42 contextes GL. Il utilise le badge et `MoonPhaseIcon` (SVG 2D) |

**Coût :** chaque instance crée **son propre contexte GL**. Textures envoyées à la carte graphique,
shaders compilés : rien n'est partagé entre instances. Le coût est donc proportionnel au nombre
d'instances. Cinq instances simultanées (`TonightView`) donnent des performances jugées suffisantes
par l'utilisateur. N'en ajoute pas davantage sur un même écran sans en mesurer l'effet.

### 5.2 Déroulé du rendu

1. **Mise en page :** le `GLView` n'est monté qu'après le premier `onLayout` (`isLaidOut`). Monté trop tôt dans un parent flex en cours de calcul, il garderait une taille transitoire pour toujours.
2. **Préchargement :** `loadMoonTextures()` est lancé dès le montage du composant. La promesse est mise en cache au niveau du module et partagée entre instances.
3. **`onContextCreate`** :
   - neutralise les appels `gl.pixelStorei` non gérés (§5.3) ;
   - attend les textures, puis met `colorSpace = SRGBColorSpace` sur la texture de couleur, qu'expo-three ne règle pas lui-même ;
   - crée le `Renderer` d'expo-three (`pixelRatio: PixelRatio.get()`) et une caméra **orthographique** (`CAMERA_FRAME_HALF_SIZE = 1.15`, le disque occupe environ 87 % du cadre) placée en +Z ;
   - ajoute une `AmbientLight` à 0,06 et une `DirectionalLight` à `LIGHT_INTENSITY` (5) ;
   - crée une sphère de 64×64 segments avec `createMoonMaterial` (Lambert, éclairage Lommel-Seeliger, §5.5) ;
   - appelle `applyOrientation(sphere, light, camera, inputs)` (§5.4) ;
   - dessine **une seule image** (`renderer.render` + `gl.endFrameEXP()`). Pas de boucle `requestAnimationFrame` : la scène est statique, et une boucle à 60 images par seconde par instance saturait le thread JS.
4. **Mises à jour :** un effet sur `[date, observer?.latitude, observer?.longitude, skyOrientationTime]` réapplique `applyOrientation`, puis redessine via `renderFrameRef`. Toute nouvelle modification de la scène doit se terminer par un appel à `renderFrameRef.current?.()`, sinon rien ne s'affiche.
5. **Valeurs à jour :** `onContextCreate` est asynchrone. Il lit donc les props les plus récentes dans `orientationInputsRef`, pas dans sa closure.

### 5.3 Pièges spécifiques à expo-gl, expo-three et three

- **Patch three** (`patches/three+0.185.1.patch`, appliqué par `postinstall: patch-package`) :
  - Il désactive le contrôle « WebGL 1 is not supported since r163 ». Le contexte expo-gl hérite d'une classe de base de type WebGL 1 même quand il est compatible WebGL 2, donc ce contrôle se déclenche à tort.
  - Il protège `onFirstUse` de `WebGLProgram` (`&& program`).
  - Le patch modifie `build/three.cjs` (le fichier réellement chargé par Metro, §1) et `src/`, pas `three.module.js`. À chaque montée de version de three, il faut régénérer ce patch.
- **Log `EXGL: gl.pixelStorei() doesn't support this parameter yet!`** : expo-gl ne gère que `UNPACK_FLIP_Y_WEBGL` et `UNPACK_ALIGNMENT`, et affiche ce message pour tous les autres paramètres que three envoie. C'est un `console.log` natif, que LogBox ne peut pas filtrer.
  - **Correction :** `filterUnsupportedPixelStorei` pose une fonction enveloppe sur l'instance `gl`.
  - **À respecter :** la méthode d'origine doit être appelée **avec `gl` en `this`** (`pixelStorei.call(gl, …)`), car le natif retrouve son contexte via `this`. C'est le même procédé que les enveloppes de log d'expo-gl (`GLUtils`).
- **Textures avec expo-three :** `TextureLoader` (expo-three) produit une « data texture » qui contient `{ localUri, width, height }`. L'image JPEG est décodée nativement lors de l'envoi à la carte graphique, **une fois par contexte GL**. Le résoudre via `Asset.fromModule(…).downloadAsync()` puis l'URI locale est plus fiable que de laisser expo-three résoudre le `require()` (voir `loadTexture`).
- **Pas de `@react-three/fiber` :** sa version native plantait à l'import avec React 19. La scène est gérée à la main.
- **`MeshLambertMaterial` plutôt que `MeshStandardMaterial` :** il compile beaucoup plus vite, et chaque instance recompile. Il gère la carte de normales depuis r151.

### 5.4 Géométrie et orientation (`applyOrientation`)

Repère de la caméra : x vers la droite (ouest du ciel), y vers le haut (nord céleste), z vers l'observateur.

- **Placement de la texture :** `SphereGeometry` place le milieu de la texture (u = 0,5, longitude sélénographique 0) sur l'axe +X. `TEXTURE_ROTATION_Y = -π/2` l'amène face à la caméra. Résultat : l'est sélénographique (côté Mare Crisium) est à droite de l'écran, le nord en haut. La rangée du haut de l'image correspond au pôle Nord (`flipY` par défaut).
- **Rotation de la sphère :** `sphere.rotation.set(b, TEXTURE_ROTATION_Y − l, P, "ZXY")`. L'ordre d'Euler `"ZXY"` donne la matrice Rz·Rx·Ry, qui applique donc d'abord Y (libration en longitude l, signe moins car un point à l'est est à droite), puis X (libration en latitude b), puis Z (inclinaison de l'axe P, comptée vers l'est, donc vers la gauche).
- **Direction de la lumière :** avec i l'angle de phase et χ l'angle de position du bord éclairé, la lumière vaut `(−sin χ·sin i, cos χ·sin i, cos i)`. Le `−sin χ` vient du fait que l'est est à gauche.
- **Rotation dans le ciel :** si `observer` est fourni, `camera.rotation.z = q`, avec q l'angle parallactique. Faire pivoter la caméra de q fait tourner l'image de −q, et le zénith arrive en haut. La Lune et sa lumière tournent ensemble.
- **Caméra orthographique, pas perspective :** une caméra perspective à d rayons ne montre qu'une calotte de `arccos(1/d)` degrés autour du centre. À d = 3, c'était 70,5°, et toute la bande du bord, où la libration se voit, était coupée. Depuis la Terre (environ 60 rayons lunaires), on voit la demi-sphère presque entière : l'orthographique est la bonne approximation.

### 5.5 Éclairage (`createMoonMaterial`)

- **Modèle :** le régolithe lunaire n'est pas lambertien. On applique **Lommel-Seeliger**, `2·cos(i) / (cos(i) + cos(e))`. Le disque reste uniforme à la pleine lune, sans bord assombri, et la ligne jour/nuit est nette, comme sur les images de la NASA.
- **Implémentation :** `onBeforeCompile` remplace la seule ligne `vec3 irradiance = dotNL * directLight.color;` de `ShaderChunk.lights_lambert_pars_fragment`. Si une version de three change ce morceau de shader, un garde-fou conserve l'éclairage de Lambert et affiche un avertissement en `__DEV__`.
- **`LIGHT_INTENSITY = 5` :** c'est la valeur qui donne la même luminosité moyenne que les images de la NASA à la pleine lune, sans saturation. À 6, le bord devenait blanc.

### 5.6 Calculs astronomiques (`orientation.ts`)

Tous les angles sont en degrés. Méthodes de Meeus, *Astronomical Algorithms* (chapitres 47, 48 et 53).

| Fonction | Résultat | Vérification |
|---|---|---|
| `getLunarLibration(date)` | Libration optique géocentrique `{ longitude, latitude }` (l > 0 : vers l'est ; b > 0 : vers le nord) | Meeus 53.a : l = −1,02° / b = +4,22° pour −1,21° / +4,19° attendus. Sur 2026 : l de −8,4° à +7,0°, b ±6,7° |
| `getLunarAxisPositionAngle(date, b?)` | Angle de position P de l'axe (environ ±25°, compté du nord vers l'est) | Meeus 53.a : 15,12° pour 15,08°. Sur 2026 : ±22,3° |
| `getLunarBrightLimbPositionAngle(date)` | Angle χ du milieu du bord éclairé (0–360°, 270° = ouest, à droite) | Meeus 48.a : 285,07° pour 285,0° |
| `getLunarSkyRotation(date, observer, time)` | Angle parallactique q (`"instant"`), ou 0 / 180° au méridien (`"meridian"` : 0 si la déclinaison est inférieure à la latitude) | Signe : −35° quand la Lune est à l'est, 0 au méridien, +35° à l'ouest, 180° dans l'hémisphère Sud |
| `getLunarOrientation(date)` | `{ libration, axisPositionAngle, brightLimbPositionAngle, phaseAngle }` | — |

Précision : environ 0,2 à 0,5°, limitée par la longitude de la Lune que donne la bibliothèque (environ 0,2° d'écart avec Meeus). C'est invisible aux tailles affichées.

**Pièges de `@observerly/astrometry` :**
- **`getLunarArgumentOfLatitude` :** **ne pas l'utiliser pour la libration.** Malgré son nom, c'est le F des calculs de phases et d'éclipses (Meeus, chapitre 49), arrondi à la lunaison la plus proche. Le F instantané est calculé dans `getMeanLunarArgumentOfLatitude` (Meeus, éq. 47.5).
- **`getObliquityOfTheEcliptic` :** il renvoie l'obliquité **moyenne**. Ajoute `getNutation().Δε` pour l'obliquité vraie.
- **`getParallacticAngle(date, observer, target)` :** il renvoie l'angle de position du zénith, avec la convention ci-dessus (vérifiée).
- **Fonctions de la bibliothèque à jour :** les coordonnées équatoriales de la Lune et du Soleil, l'angle de phase et la nutation correspondent aux exemples de Meeus.

### 5.7 Textures

- **Utilisées :** `assets/images/textures/1k_moon.jpg` (169 Ko) et `1k_moon_normal.jpg` (291 Ko), en 1024×512 et JPEG standard (non progressif). Même la lune de 150 points n'occupe qu'environ 450 pixels réels et ne montre que la moitié de la texture.
- **Sources haute résolution :** `2k_moon.jpg` et `2k_moon_normal.jpg` (2048×1024, 1 Mo et 5 Mo) ne sont plus chargées par l'app, mais **ne doivent pas être supprimées** : elles serviront à la future carte lunaire (§6). Les versions 1K en ont été tirées avec PIL (LANCZOS, qualité 88 pour la couleur, 92 pour la carte de normales).

### 5.8 Vérifier sans appareil

On ne peut pas lancer l'app depuis un agent. Méthodes utilisées jusqu'ici :

- **Typecheck :** `npx tsc --noEmit -p .`
- **Calculs dans Node :** le Node local n'a pas le support TypeScript intégré. Transpile le fichier avec le compilateur du projet, en redirigeant l'import de la bibliothèque vers son build :

  ```js
  const ts = require("typescript");
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
    .replace('"@observerly/astrometry"', `"${process.cwd()}/node_modules/@observerly/astrometry/dist/index.js"`);
  ```

  Écris le résultat en `.mjs` dans un dossier temporaire, puis compare aux valeurs du tableau du §5.6.
- **Contrôle visuel :** un petit moteur de rendu Python (PIL, numpy non installé) qui reproduit la géométrie. Placement de `SphereGeometry` : `x = −cos φ · sin θ`, `y = cos θ`, `z = sin φ · sin θ`, avec u = φ/2π et la rangée de l'image = θ/π. Rotations `ZXY` inversées pour retrouver le point de la texture, caméra orthographique, lumière et éclairage ci-dessus. Compare avec des images Dial-A-Moon de la NASA aux mêmes dates.
- **Dates utiles :** plus de pôle Nord visible le 10/11/2026 (b ≈ +6,7°). Presque pleine lune le 24/11/2026 (idéal pour juger libration et inclinaison). Mare Crisium collée au bord le 18/12/2026 (l ≈ −8,3°), ou décollée le 29/12/2026 (l ≈ +6,8°).
- **Côté utilisateur :** après relance de l'app, le rendu a été jugé proche de Dial-A-Moon (orientation, libration, ligne jour/nuit).

### 5.9 Limites actuelles

- **Pas de lumière cendrée :** la partie non éclairée reste noire, alors que la NASA l'éclaire faiblement.
- **Pas de libration diurne** (environ ±1°, dépend du lieu d'observation).
- **Libration physique négligée** (±0,04°).
- **Pas de parallaxe pour la rotation du ciel :** calcul géocentrique, moins de 1° d'écart.
- **Pas de rotation continue de la sphère :** elle désynchroniserait la texture de l'éclairage calculé.

---

## 6. Évolutions envisagées

- **Carte lunaire 3D interactive** (prévue, à rediscuter avec l'utilisateur avant de commencer) :
  - Elle demande des textures haute résolution : garder les `2k_*`, et prévoir probablement plus, par exemple le *CGI Moon Kit* de la NASA, issu de LRO, disponible en très haute résolution.
  - Ce sera un composant distinct de `MoonPhase` (zoom, rotation, caméra perspective possible).
  - Il pourra réutiliser `orientation.ts`.
- **Lumière cendrée** sur la partie sombre, pour se rapprocher de Dial-A-Moon.
- **Libration diurne**, à partir de `observer`.
- **Images fixes pour les 4 petites phases de `TonightView`** (5 contextes GL ramenés à 1) : jugé inutile pour l'instant, les performances suffisent.
- **`SelectInput` :** un message « aucun résultat » dans le panneau de recherche, qui demande une prop de texte traduit.
- **Fond de modale :** le fond assombri de `SelectInput` et de `DayDetailModal` monte avec le panneau (`animationType="slide"`). Un fondu séparé serait plus soigné.
- **Modifier une session :** `AddSession` en mode modification (`?id=`, comme les formulaires de matériel), puis un bouton Modifier dans `SessionDetails`.
- **Confirmation avant suppression** d'une session ou d'un matériel : aujourd'hui, la suppression est immédiate.
- **Objets du système solaire** (types prêts, §2) : icônes par `kind`, positions et levers/couchers des planètes. `@observerly/astrometry` 0.67 fournit déjà `getPlanetaryPositions`, `getBodyNextRise` et `getBodyNextSet`, encore inutilisés : l'app ne calcule aujourd'hui que le Soleil et la Lune, donc le rendu des planètes reste à construire.
- **Écran Astroshare PRO :** le CTA de `LockedFeatureCard` (section « Mes satellites ») ne mène nulle
  part encore, faute d'écran d'abonnement dans l'app.
- **Diagramme périgée/apogée illustré :** la fiche satellite affiche aujourd'hui ces deux valeurs en
  tuiles chiffrées + une phrase d'écart, pas l'ellipse schématique de la maquette.
- **États d'éclipse d'un passage** (« entre dans l'ombre », etc., visibles sur la maquette) : pas dans
  la réponse documentée de `/v3/satellite/passes`, remplacés par le champ réel `quality`
  (excellent/visible/faible) plutôt que fabriqués.

---

## 7. Problèmes connus, non corrigés

| Fichier | Problème |
|---|---|
| `src/screens/Settings/Observatories/AddNewObservatory/StepOne/StepOne.tsx` | `t("stepOne.lightPollution.noSource")` : la clé existe sous `stepOne.noSource` |
| `src/screens/Settings/Observatories/ObservatoryDetails/ObservatoryDetails.tsx` | `t('common.errors.unknown')` : la clé n'existe nulle part |
| `src/helpers/observatories/observatories.ts` | Libellés traduits à l'import, donc figés dans la langue du démarrage (§3) |
| `src/types/observatory.ts` | `ObservatoryEquipment` (`wifi`, `toilet`, `bedding`) ne correspond pas aux `id` de `observatoriesEquipments` (`internet`, `bathroom`, `kitchen`). Les données enregistrées utilisent les `id` de la liste |
| Formulaires d'ajout de matériel (`src/screens/Tools/Journal/Gear/**/Add*`), sauf `AddMount` et `AddSetup` | Le bouton `Button` d'enregistrement est `disabled` quand un champ requis manque, sans aucun message : rien ne se passe au clic, sans explication. `AddSetup` affiche une erreur sur le champ nom à la place de `disabled` (voir §4 `Button`) ; les autres formulaires de matériel ne le sont pas encore |
| `src/i18n/locales/{en,it}/tools/journal/gear/setups/details.json` | `pieceCount_one`/`pieceCount_other` contiennent encore `{{count}}`, alors que `SetupDetails` les appelle sans `count` (le nombre est affiché à part, comme dans le fichier `fr`) : « {{count}} pieces of gear » s'affiche tel quel en anglais et en italien |
| `src/components/cards/ObjectCardLite/ObjectCardLite.tsx` | Libellé d'accessibilité du bouton de suppression écrit en dur en français (« Retirer de la liste ») |
| `src/types/auth/UserRoles.ts` | `UserRoles` est typé comme un objet (`{ADMIN: "ADMIN", ...}`), pas comme une union de chaînes : `User.role` ne se compare pas directement sous TypeScript strict. Contourné dans `isProUser` (`src/helpers/auth/subscription.ts`) en typant son paramètre `{role?: string} \| null \| undefined` plutôt qu'en important `User` |
| `src/screens/Tools/SatelliteTracker/SatellitesScreen.tsx` | Condition PRO de la section « Mes satellites » inversée (`userIsPro ? <LockedFeatureCard /> : <liste réelle />`) : affiche la carte verrouillée aux comptes PRO et la liste réelle aux comptes non-PRO. Repéré en construisant `LightPollutionMapScreen` (qui, lui, utilise la bonne condition) |
| `src/i18n/locales/{en,it}/common.json` | Le bloc `lightPollution` (`indicators`, `indicatorDescriptions`, `sqm.numeric`, `limitingMagnitude`) n'existe que dans `fr` : en/it retombent silencieusement sur le français pour tout texte lié à l'échelle de Bortle (`ObservatoryDetails`, `StepTwo`, `LightPollutionMapScreen`) |

Quand l'un de ces problèmes est corrigé, retire sa ligne et note la correction au journal (§8).

---

## 8. Journal des changements

Changements réalisés par des agents, approuvés et commités par l'utilisateur. Ajoute chaque nouvelle
entrée **en haut** de la liste, en une à trois lignes.

Format : `- **AAAA-MM-JJ** — commit court — ce qui a changé et pourquoi, en termes de comportement —
sections de ce document mises à jour.` Si l'entrée est commitée en même temps que le changement, un
commit ne pouvant pas contenir son propre identifiant, écris « même commit » : il se retrouve avec
`git log -- docs/agents-reference.md`.

Le détail technique reste dans les sections concernées et dans le message de commit : le journal sert
à retrouver *quand* et *où* quelque chose a changé.

Le journal commence avec le commit `8527e2f`. Les changements antérieurs, comme la restructuration
i18n, `SelectInput` ou `ImageHeaderScrollView`, sont décrits dans les sections ci-dessus mais n'ont pas
d'entrée datée.

- **2026-11-19** — même commit — Météo spatiale : migration du contrat API (`label` traduits côté
  serveur remplacés par des identifiants stables sur `/kpi`, `/wind`, `/imf`, `/scales`, `/flares`,
  `/sun`, `/outlook`, avec dictionnaire de traduction fr/en/it correspondant), deux nouvelles routes
  (`/solarweather/aurora`, `/solarweather/outlook`), `SpaceWeatherScreen.tsx` scindé en 9 cartes
  autonomes sous `components/`, et bloc « chez vous » d'`AuroraForecastCard` adapté à la position
  effective (observatoire actif ou GPS) au lieu d'un badge fixe « Chez vous » — §2 (nouvelle
  sous-section).
- **2026-11-19** — même commit — Carte de pollution lumineuse retouchée après premiers tests sur
  appareil : carte sombre (`customMapStyle`), carte de résultat refaite en blanc au plus proche d'une
  maquette retravaillée (badge, échelle Bortle en dégradé, pastilles Voie lactée/magnitude limite),
  sélection vide par défaut avec bouton de fermeture, tuiles corrigées (`maximumNativeZ` au lieu de
  `maximumZ`, qui faisait disparaître la couche en zoomant), couleur du marqueur qui ne suivait pas
  les changements (`key` sur `MapTargetMarker`), opacité des tuiles réglable (`OpacitySlider`, piste
  maison comme `WeatherRadarMap`, pas de dépendance ajoutée) — §2, §4, §7. Corrige au passage un build
  Android cassé par `satellite.js` (import profond au lieu du point d'entrée du paquet, qui traînait
  une branche WASM pensée pour Node) — §1, §2.
- **2026-11-18** — même commit — nouvel outil Carte de pollution lumineuse (`/tools/light-pollution-map`,
  déjà pré-enregistré dans `tools.ts`/`tools.json`, seule la route manquait) : carte plein écran façon
  `WeatherRadarMap`, recherche d'une ville par nom ou sélection directe par appui sur la carte
  (réutilise `LocationContext.fetchLocation`, aucun nouvel appel API), tuiles de l'atlas World Atlas
  2015 en overlay (`UrlTile`, `flipY` pour une pyramide TMS — nouveau piège §2), marqueur coloré par
  niveau Bortle (`MapTargetMarker` gagne une prop `color`), écran entier verrouillé PRO — §2, §4, §7
  (bug d'accès PRO inversé repéré au passage dans `SatellitesScreen`, non corrigé).
- **2026-11-18** — même commit — clavier qui cachait un champ, corrigé à plusieurs endroits
  (`KeyboardAvoidingView`, cf. nouveau piège §2) : `SelectInput` (modale), `AddSession` et tous les
  formulaires d'ajout de matériel (Gear, 8 écrans) + `AddNewObservatory`, et les 3 écrans d'auth
  (Login/Register/ForgotPassword, qui gagnent aussi un `ScrollView` qu'ils n'avaient pas). Recherche
  par nom paginée côté serveur pour `AddSatelliteModal` (`searchNoradSatellites`,
  `useSatelliteNameSearch`) : seuls les résultats affichés sont téléchargés, plutôt que plus de
  13 000 d'un coup. Liste de suggestions d'`InputWithIcon` passée en `FlatList` (virtualisée, hauteur plafonnée)
  pour le même genre de recherche à beaucoup de résultats — §2, §4.
- **2026-11-18** — même commit — fiche satellite (`SatelliteDetailsScreen`) retouchée après retour
  utilisateur sur les maquettes : header fusionné avec le bloc titre/carte (même fond `primary.main`,
  un seul arrondi en bas), valeurs lat/long/altitude/vitesse déplacées sous la carte, point de
  position agrandi avec un halo animé en boucle. `ScreenHeader` gagne au passage un sous-titre
  utilisable en `main`, une prop `compact` (titre réduit sur fond sombre) et une prop
  `backgroundColor`, et câble enfin sa prop `customElement` (déclarée depuis longtemps, jamais
  utilisée) — §2, §4.
- **2026-11-18** — même commit — nouvel outil Suivi de satellites : écrans liste et fiche détaillée
  (position live et trace au sol calculées localement en SGP4 via `satellite.js`, carte du monde en
  pointillés dessinée en SVG à partir de données Natural Earth, passages visibles, orbite, fiche
  d'identité), section « Mes satellites » réservée aux comptes PRO (`isProUser`, `LockedFeatureCard`
  généralisé depuis le TODO de `SpaceWeatherScreen`), satellites mis en avant résolus par recherche de
  nom plutôt que par id codé en dur — §1, §2 (nouvelle sous-section), §4, §6, §7.
- **2026-11-16** — même commit — catalogue d'objets préparé pour le système solaire : `kind`/`category` `"solar_system"`, `position` nullable, bloc `solar_system` de la fiche (éphémérides, faits), catégorie traduite en fr, en et it, libellés NGC/IC réservés aux désignations numérotées — §2, §3, §6.
- **2026-11-16** — `5c33f04` (documenté après coup, le même jour) — fiche d'une session (`SessionDetails`), action `removeAstronomySession`, composant `LocationMapCard` extrait d'`ObservatoryDetails` (avec recentrage de la carte et altitude 0 m affichée), `ObjectCardLite` utilisable en lecture seule, Journal relié à la fiche — §3, §4, §6, §7.
- **2026-11-15** — même commit —
  - modification d'un observatoire (même principe que le matériel, `?id=`), bouton Modifier d'`ObservatoryDetails` corrigé — §4 « Observatoires : ajout et modification » ;
  - `updateObservatory` ajouté au store ;
  - namespaces `en`/`it` manquants créés en entier : `suggestionsCards`, `tools/apod`, `tools/polarScope`, `tools/spaceWeather`, `tools/weather` — §3 ;
  - 4 fichiers JSON `fr` invalides (virgule finale illégale avant `}`) corrigés : `moon.json`, `settings.json`, `tools/3dviewer.json`, `settings/addObservatory.json` ;
  - composant `InfoTooltip`, branché sur les icônes Info sans action de `SpaceWeatherScreen` (champ magnétique, vent solaire) — §4 ;
  - `ToolsScreen` : recherche et filtre de catégorie câblés sur `ToolsSection` (ils ne l'étaient pas), qui accepte maintenant la liste déjà filtrée en prop ; `Badge` : texte rogné en bas corrigé (`lineHeight` manquant à cette taille de police) ;
  - `src/components/` réorganisé en sous-dossiers par type (`buttons/`, `inputs/`, `overlays/`, `layout/`, `charts/`, `rendering/`, `media/`), `ObservabilityScoreCard` et `UsefulNightCard` déplacés dans `cards/` (déjà la convention pour tout composant `*Card`) — §1.
- **2026-11-15** — même commit — composant `Button` (`src/components/buttons/Button/`), variantes `color`/`danger`/`info`, props `loading` et `iconPosition` ; remplace les boutons écrits à la main dans Profile, Auth (Login/Register/ForgotPassword), Observatories (`ObservatoryDetails`, `AddNewObservatory`), Journal et tout l'écran Matériel (7 formulaires d'ajout + 8 écrans de détail). Les boutons « Supprimer » du Matériel, en rouge atténué (red.light/red.main), repassent au rouge plein déjà utilisé ailleurs (déconnexion du profil) — §4, §7.
- **2026-11-13** — même commit — durées des sessions corrigées sur l'écran Journal (millisecondes passées à `formatDuration`, qui attend des secondes) et passées sur `formatCompactDuration`, comme `SetupDetails` ; lieu d'un observatoire affiché par son nom (`formatLocationLabel`) ; namespace `tools/journal` traduit en en et it, avec les libellés de l'écran Journal — §2, §3, §4.
- **2026-11-12** — même commit — Journal :
  - enregistrement des sessions dans le store (`addAstronomySession`, objets observés, lieu sélectionnable, bouton d'enregistrement) ;
  - nouvelle `CheckboxCard`, avec la sélection multiple des setups ;
  - suggestions d'`InputWithIcon` corrigées ;
  - `formatCompactDuration` et traductions du formulaire en fr, en et it ;
  - sections §2, §3 et §4.
- **2026-11-08** — `5440321` et `26d2ed4` (documentés après coup, le 2026-11-12) — cartes `IconButtonCard`, `ObservationCard` et `SessionCard`, helper `formatShortMonth`, namespace `tools/journal/sessions/add` — §2, §3, §4. Le namespace `tools/3dviewer` (`70d2ebf`, 2026-11-03) suit la convention de la §3.
- **2026-10-31** — même commit — carte radar adaptée à la nouvelle API (LibreWXR, frames de prévision
  `is_forecast`) : ouverture sur « maintenant » au lieu de la dernière frame, repère « maintenant », zone
  prévision et mention observé/prévision, nuages (instantanés) suspendus pendant l'animation et sur
  la prévision — §4 `WeatherRadarMap`.
- **2026-10-31** — `30704d2` — création de ce document et de `CLAUDE.md`. `docs/` est retiré de
  `.gitignore` pour être versionné. Règle : documenter ici tout changement d'agent approuvé et commité —
  §8, `CLAUDE.md`.
- **2026-10-31** — `8527e2f` — rendu 3D de la Lune :
  - libration, inclinaison de l'axe et direction du bord éclairé calculées (`orientation.ts`) ;
  - caméra orthographique, rotation selon le ciel de l'observateur (`observer`, `skyOrientationTime`) ;
  - éclairage de Lommel-Seeliger ;
  - performances : textures 1K, une seule image par rendu, `MeshLambertMaterial` ;
  - suppression du log `pixelStorei` ;
  - sections §5.1 à §5.9.
