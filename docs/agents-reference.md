# Astroshare — référence pour agents de code

Point d'entrée pour un agent qui intervient sur ce dépôt : état du projet, conventions, pièges connus
et, en détail, le rendu 3D de la Lune (`MoonPhase`) et les calculs astronomiques associés.

- **État décrit** : fin octobre 2026, branche `ASTROSHARE_V3`, commit `8527e2f`. Vérifie toujours le code
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
| 3D | `three` r185 + `expo-three` 8 + `expo-gl` (voir §5) |
| Graphismes | `react-native-svg` (aussi pour les dégradés), `lucide-react-native` pour les icônes |
| Auth | Firebase |

### Arborescence

| Dossier | Rôle |
|---|---|
| `app/` | Routes `expo-router`, fichiers fins qui rendent un écran de `src/screens/` |
| `src/screens/` | Écrans, avec leurs sous-composants propres (`components/`) |
| `src/components/` | Composants réutilisables, un dossier par composant (`X.tsx` + `X.styles.ts`) |
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
  - `unstable_enablePackageExports = false` : les paquets sont résolus via leur champ `main`. Pour `three`, c'est `build/three.cjs`, et c'est ce fichier que le patch modifie.
  - Les `.svg` sont importés comme composants (`react-native-svg-transformer`).

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
- **`<Image>` chargée par `require()` :** elle reçoit d'office la taille du fichier en `width`/`height`, qui l'emporte sur les bords à 0. Mets-la à `100%` dans un conteneur absolu sans padding. Voir `imageContainer` dans `src/components/ScreenHeader/ScreenHeader.styles.ts`.
- **Bord d'un dessin SVG :** il est lissé (anti-aliasing). Si un dégradé SVG doit se raccorder à un aplat de même couleur, fais recouvrir sa dernière rangée de pixels par une vue opaque. Voir `FADE_SEAM_COVER` dans `ImageHeaderScrollView.styles.ts`.
- **Dégradés :** ne fais jamais varier un dégradé vers `"transparent"`, qui est du noir à 0 % d'opacité et salit le milieu du dégradé. Garde une seule couleur et ne fais varier que l'opacité. Pour une transition douce, utilise `easedGradientStops` (`src/helpers/gradients.ts`, courbe smoothstep), avec `<LinearGradient>` de `react-native-svg`.

---

## 3. Internationalisation

- **Où sont les traductions :** `src/i18n/resources.ts` est la source unique, partagée par l'init (`src/i18n/index.ts`) et par le calcul de complétude (`src/i18n/translationCompleteness.ts`, écran Langue).
- **Nom d'un namespace :** c'est le chemin du fichier depuis `locales/<langue>/`, sans extension. Exemple : `useTranslation("settings/addObservatory")` correspond à `locales/<langue>/settings/addObservatory.json`. Le `/` dans un nom de namespace fonctionne avec i18next, et la syntaxe `ns:clé` aussi (`t("settings/addObservatory:stepTwo.title")`).
- **Ajouter un namespace :** crée le JSON dans chaque langue, puis ajoute l'import et l'entrée dans les trois blocs de `resources.ts`.
- **Clés :** une clé ne répète pas le nom de son namespace (`t("recap.sessions")`, pas `t("profile.recap.sessions")`).
- **Langues :** `fr` est la langue de référence et de repli. `en` et `it` peuvent être partielles : les clés absentes retombent sur le français.
- **Ne pas traduire au chargement d'un module :** un `i18next.t()` exécuté à l'import, comme les `label` de `src/helpers/observatories/observatories.ts`, est figé dans la langue du démarrage. Traduis dans le composant avec `t()`. Exemple : les options de type de lieu dans `StepTwo.tsx`.

---

## 4. Composants d'interface notables

### `ScreenHeader` (`src/components/ScreenHeader/`)

- **Variantes :** `main` (fond foncé, titre blanc) ou secondaire (`main={false}`, fond clair).
- **Prop `image` :** elle n'agit que sur un header secondaire. Le header passe à `IMAGE_HEADER_HEIGHT` (250), affiche l'image en fond avec un dégradé sombre léger, passe le texte et le chevron en blanc, et met la barre de statut en icônes claires tant que l'écran a le focus. L'utilisateur a demandé de ne pas modifier la mise en page du texte dans cette variante : seules les couleurs changent.

### `ImageHeaderScrollView` (`src/components/ImageHeaderScrollView/`)

- **Rôle :** un écran dont le header à image défile avec le contenu. Utilisé dans `ObservatoryDetails`.
- **Défilement :** l'image défile en parallaxe, deux fois moins vite que le contenu (`IMAGE_PARALLAX_SPEED`). Le contenu, opaque, glisse par-dessus.
- **Barre compacte :** le header secondaire classique apparaît en fondu, collé en haut, une fois l'image sortie. La barre de statut bascule aussi à ce moment.
- **Fondu de l'image :** il est attaché au haut du **contenu**, pas au header. Avec la parallaxe, un fondu fixé au header laisserait apparaître une ligne nette.
- **Chevauchement :** le contenu remonte de `CONTENT_OVERLAP` (40 px) sur la fin du fondu.
- **Pas de `FlatList` dans le contenu :** c'est un `ScrollView`. L'utilisateur s'engage à ne pas y mettre de `FlatList`.

### `SelectInput` (`src/components/SelectInput/`)

- **Composant contrôlé :** `options: { label, value }[]`, avec `value` et `onChange`. `multiple` sert de discriminant de type : `T | null` en choix simple, `T[]` en choix multiple. Les valeurs y restent dans l'ordre des options.
- **`NoInfer` sur `value`/`onChange` :** sans lui, l'inférence du type échoue en choix multiple. Il demande TypeScript 5.4 ou plus.
- **`presentation` :** `"dropdown"` (liste sous le champ) ou `"sheet"` (panneau `Modal` avec `FlatList`, recherche facultative via `searchable`). Par défaut, le panneau s'ouvre au-delà de `SHEET_OPTIONS_THRESHOLD` (8) options.
- **Options construites depuis une liste d'ids :** type les ids avec l'union attendue (exemple : `observatoriesTypes` typé `ObservatoryType`).

---

## 5. Rendu 3D de la Lune : `MoonPhase`

Fichier : `src/components/MoonPhase/MoonPhase.tsx`. Calculs : `src/helpers/astrometry/moon/orientation.ts`.

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

---

## 7. Problèmes connus, non corrigés

| Fichier | Problème |
|---|---|
| `src/screens/Settings/Observatories/AddNewObservatory/StepOne/StepOne.tsx` | `t("stepOne.lightPollution.noSource")` : la clé existe sous `stepOne.noSource` |
| `src/screens/Settings/Observatories/ObservatoryDetails/ObservatoryDetails.tsx` | `t('common.errors.unknown')` : la clé n'existe nulle part |
| `src/helpers/observatories/observatories.ts` | Libellés traduits à l'import, donc figés dans la langue du démarrage (§3) |
| `src/types/observatory.ts` | `ObservatoryEquipment` (`wifi`, `toilet`, `bedding`) ne correspond pas aux `id` de `observatoriesEquipments` (`internet`, `bathroom`, `kitchen`). Les données enregistrées utilisent les `id` de la liste |

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

- **2026-10-31** — même commit — création de ce document et de `CLAUDE.md`. `docs/` est retiré de
  `.gitignore` pour être versionné. Règle : documenter ici tout changement d'agent approuvé et commité —
  §8, `CLAUDE.md`.
- **2026-10-31** — `8527e2f` — rendu 3D de la Lune :
  - libration, inclinaison de l'axe et direction du bord éclairé calculées (`orientation.ts`) ;
  - caméra orthographique, rotation selon le ciel de l'observateur (`observer`, `skyOrientationTime`) ;
  - éclairage de Lommel-Seeliger ;
  - performances : textures 1K, une seule image par rendu, `MeshLambertMaterial` ;
  - suppression du log `pixelStorei` ;
  - sections §5.1 à §5.9.
