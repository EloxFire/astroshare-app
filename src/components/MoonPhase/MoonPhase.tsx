import { useEffect, useRef, useState } from "react";
import { PixelRatio, View, type StyleProp, type ViewStyle } from "react-native";
import { GLView, type ExpoWebGLRenderingContext } from "expo-gl";
import { Asset } from "expo-asset";
import { Renderer, TextureLoader } from "expo-three";
import * as THREE from "three";
import type { GeographicCoordinate } from "@observerly/astrometry";
import { getLunarOrientation, getLunarSkyRotation, type LunarSkyOrientationTime } from "../../helpers/astrometry/moon/orientation";

interface MoonPhaseProps {
  date: Date;
  size?: number;
  style?: StyleProp<ViewStyle>;
  // Lieu d'observation : si renseigné, la Lune est montrée telle qu'on la voit dans son ciel, zénith
  // en haut (sinon : nord céleste en haut, comme les images de la NASA).
  observer?: GeographicCoordinate;
  // Avec `observer` : orientation à la date exacte ("instant", défaut — le disque tourne au fil de
  // la nuit) ou à son passage au plus haut dans le ciel ("meridian" — pour une vue qui représente un
  // jour ou une phase plutôt qu'un moment d'observation). Voir getLunarSkyRotation.
  skyOrientationTime?: LunarSkyOrientationTime;
}

interface MoonOrientationInputs {
  date: Date;
  observer?: GeographicCoordinate;
  skyOrientationTime: LunarSkyOrientationTime;
}

interface MoonTextures {
  colorMap: THREE.Texture;
  normalMap: THREE.Texture;
}

// Résout un require() d'asset en texture three.js en passant par l'URI locale (Asset.downloadAsync)
// plutôt que de laisser expo-three résoudre le module require() lui-même — pattern repris de
// l'ancienne implémentation (loadBundledTextureAsync, branche main), plus fiable sur ce couple
// expo-asset/expo-three que la résolution automatique.
const loadTexture = async (moduleId: number): Promise<THREE.Texture> => {
  const asset = Asset.fromModule(moduleId);
  await asset.downloadAsync();
  const uri = asset.localUri ?? asset.uri;
  return new Promise((resolve, reject) => {
    new TextureLoader().load(uri, resolve, undefined, reject);
  });
};

// Chargées une seule fois pour toute l'app et partagées entre toutes les instances montées en même
// temps — la promesse est mise en cache au niveau du module : un deuxième montage réutilise
// directement le résultat déjà résolu plutôt que de recharger les textures depuis les assets.
// Versions 1024×512 (générées depuis les 2k_*, gardés comme sources) : même la plus grande lune
// affichée (150 de large) n'occupe qu'environ 450 pixels réels, et elle ne montre que la moitié de
// la texture. En 2K, chaque JPEG était décodé ~20× plus lentement — et une fois par instance, car
// chaque GLView a son propre contexte GL, sans partage des textures entre contextes.
let texturesPromise: Promise<MoonTextures> | null = null;
const loadMoonTextures = (): Promise<MoonTextures> => {
  if (!texturesPromise) {
    texturesPromise = Promise.all([
      loadTexture(require("../../../assets/images/textures/1k_moon.jpg")),
      loadTexture(require("../../../assets/images/textures/1k_moon_normal.jpg")),
    ]).then(([colorMap, normalMap]) => ({ colorMap, normalMap }));
  }
  return texturesPromise;
};

// expo-gl ne gère que deux paramètres de gl.pixelStorei (UNPACK_FLIP_Y_WEBGL, UNPACK_ALIGNMENT —
// voir EXWebGLMethods.cpp) : pour tous les autres, que three.js envoie à l'init et à chaque envoi
// de texture, il ne fait rien d'autre que logger "EXGL: gl.pixelStorei() doesn't support this
// parameter yet!" (un console.log natif, impossible à filtrer via LogBox). On ne lui transmet donc
// que ceux-là : même rendu, sans le log. Même procédé que les wrappers de log d'expo-gl (GLUtils) :
// une fonction posée sur l'instance, qui appelle la méthode d'origine avec gl en `this` (le natif
// retrouve son contexte grâce à lui).
const filterUnsupportedPixelStorei = (gl: ExpoWebGLRenderingContext) => {
  const pixelStorei = gl.pixelStorei;
  gl.pixelStorei = (pname, param) => {
    if (pname === gl.UNPACK_FLIP_Y_WEBGL || pname === gl.UNPACK_ALIGNMENT) {
      pixelStorei.call(gl, pname, param);
    }
  };
};

// Distance "lumière" arbitraire : seule sa direction compte pour une DirectionalLight.
const LIGHT_DISTANCE = 5;
// Intensité calée sur les images Dial-A-Moon de la NASA avec l'éclairage Lommel-Seeliger (même
// luminosité moyenne du disque à la pleine lune, sans zones saturées).
const LIGHT_INTENSITY = 5;

// Éclairage de la surface : la Lune ne se comporte pas comme une surface "lambertienne" (qui
// s'assombrit progressivement du point sous le Soleil jusqu'au terminateur, et vers les bords à la
// pleine lune). Son régolithe suit plutôt la loi de Lommel-Seeliger, modèle de référence pour les
// surfaces planétaires sombres : ~2·cos(i) / (cos(i) + cos(e)), i = incidence, e = émergence. Le
// disque reste uniformément lumineux à la pleine lune et la partie éclairée reste brillante presque
// jusqu'au terminateur, qui est donc net — comme sur les photos et les images de la NASA.
// Remplace uniquement le calcul d'éclairage direct de MeshLambertMaterial (le reste : texture,
// normal map, lumière ambiante, est inchangé). Au point sous le Soleil, à la pleine lune, les deux
// modèles donnent la même valeur.
const LAMBERT_DIRECT_IRRADIANCE = "vec3 irradiance = dotNL * directLight.color;";
const LOMMEL_SEELIGER_DIRECT_IRRADIANCE = `float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
	vec3 irradiance = ( 2.0 * dotNL / max( dotNL + dotNV, 1e-4 ) ) * directLight.color;`;

// MeshLambertMaterial plutôt que MeshStandardMaterial (PBR) : bien plus rapide à compiler — et la
// compilation est refaite pour chaque instance, une par contexte GL. Il gère aussi la normal map
// (depuis three r151). Son éclairage direct est remplacé par Lommel-Seeliger (voir plus haut).
const createMoonMaterial = (map: THREE.Texture, normalMap: THREE.Texture): THREE.MeshLambertMaterial => {
  const material = new THREE.MeshLambertMaterial({ map, normalMap });
  material.onBeforeCompile = (shader) => {
    const lambertChunk = THREE.ShaderChunk.lights_lambert_pars_fragment;
    // Garde-fou si une future version de three.js change ce bout de shader : on garde alors
    // l'éclairage de Lambert plutôt qu'un shader cassé.
    if (!lambertChunk.includes(LAMBERT_DIRECT_IRRADIANCE)) {
      if (__DEV__) console.warn("[MoonPhase] Éclairage Lommel-Seeliger non appliqué : shader Lambert de three.js inattendu.");
      return;
    }
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <lights_lambert_pars_fragment>",
      lambertChunk.replace(LAMBERT_DIRECT_IRRADIANCE, LOMMEL_SEELIGER_DIRECT_IRRADIANCE)
    );
  };
  return material;
};

// Demi-largeur du cadre de la caméra orthographique, en rayons lunaires : le disque (rayon 1)
// occupe ~87% du cadre, comme avec l'ancienne caméra perspective.
const CAMERA_FRAME_HALF_SIZE = 1.15;

// Offset de rotation qui met face à la caméra (placée en +Z) le centre de la texture (1k_moon.jpg,
// longitude sélénographique 0°) : SphereGeometry plaque le milieu de la texture (u = 0,5) sur l'axe
// +X, qu'une rotation de -π/2 autour de Y amène en +Z. Avec ce placement, l'est sélénographique
// part vers la droite de l'écran et le nord vers le haut (voir applyOrientation).
const TEXTURE_ROTATION_Y = -Math.PI / 2;

const DEG_TO_RAD = Math.PI / 180;

// Oriente la scène pour une date, nord céleste en haut (convention des images "Moon Phase and
// Libration" de la NASA, que servait l'ancienne API), dans le repère de la caméra : x vers la
// droite (ouest du ciel), y vers le haut (nord céleste), z vers l'observateur.
// - Sphère : d'abord la libration — autour de Y pour la longitude (une libration vers l'est, > 0,
//   amène au centre un point situé à droite, d'où le signe moins), puis autour de X pour la
//   latitude (vers le nord, > 0, le pôle Nord bascule vers la caméra) —, puis l'inclinaison de
//   l'axe P autour de Z (comptée vers l'est, donc vers la gauche). Ordre d'Euler "ZXY" : matrice
//   Rz·Rx·Ry, qui applique bien Y, puis X, puis Z.
// - Lumière : composante cos(i) vers l'observateur (i = angle de phase : 0 = pleine lune, Soleil
//   derrière l'observateur), et composante sin(i) dans le plan du ciel, orientée selon χ (compté
//   du nord vers l'est ; l'est est à gauche, d'où le -sin χ en x).
// - Caméra : avec un observateur, elle pivote autour de son axe de visée de l'angle
//   getLunarSkyRotation pour amener le zénith en haut de l'image. Lune et lumière tournent donc
//   ensemble à l'écran, sans toucher à leur orientation relative.
const applyOrientation = (
  sphere: THREE.Mesh,
  light: THREE.DirectionalLight,
  camera: THREE.Camera,
  { date, observer, skyOrientationTime }: MoonOrientationInputs
) => {
  const { libration, axisPositionAngle, brightLimbPositionAngle, phaseAngle } = getLunarOrientation(date);
  sphere.rotation.set(
    libration.latitude * DEG_TO_RAD,
    TEXTURE_ROTATION_Y - libration.longitude * DEG_TO_RAD,
    axisPositionAngle * DEG_TO_RAD,
    "ZXY"
  );

  const phase = phaseAngle * DEG_TO_RAD;
  const brightLimb = brightLimbPositionAngle * DEG_TO_RAD;
  light.position.set(
    -Math.sin(brightLimb) * Math.sin(phase) * LIGHT_DISTANCE,
    Math.cos(brightLimb) * Math.sin(phase) * LIGHT_DISTANCE,
    Math.cos(phase) * LIGHT_DISTANCE
  );

  // Faire pivoter la caméra d'un angle q fait tourner l'image de -q : le zénith, à l'angle de
  // position q, arrive en haut.
  camera.rotation.z = observer ? getLunarSkyRotation(date, observer, skyOrientationTime) * DEG_TO_RAD : 0;
};

/**
 * <MoonPhase date={new Date()} size={120} />
 *
 * Rendu 3D de la Lune pour une date donnée, entièrement local (three.js via expo-gl, aucun appel
 * réseau) — remplace l'illustration récupérée via l'API.
 *
 * Scène gérée à la main (GLView.onContextCreate + expo-three.Renderer), plutôt que via
 * @react-three/fiber : sa version native plante actuellement à l'import avec React 19 (son propre
 * code contient `// TODO: React 19 needs support from react-native`, support natif encore
 * instable côté lib). Pour une scène aussi simple (1 sphère, 2 lumières, caméra fixe), le chemin
 * direct documenté par Expo est de toute façon plus simple qu'une couche déclarative par-dessus.
 *
 * La Lune est dessinée telle que vue depuis le centre de la Terre, nord céleste en haut : face
 * visible selon la libration, axe incliné selon P, lumière selon χ et l'angle de phase (voir
 * applyOrientation et helpers/astrometry/moon/orientation.ts). Avec `observer`, l'image pivote pour
 * montrer la Lune telle qu'on la voit dans son ciel, zénith en haut (retournée vue de l'hémisphère
 * Sud). Caméra orthographique : depuis la Terre (~60 rayons lunaires), on voit la demi-sphère
 * jusqu'au bord, là où la libration se remarque — une caméra perspective proche n'en montrait
 * qu'une calotte de ~70°.
 *
 * Limites assumées : pas de libration diurne (~±1°, dépend du lieu d'observation), pas de lumière
 * cendrée sur la partie non éclairée, pas de rotation idle (désynchroniserait la texture de
 * l'éclairage calculé).
 */
const MoonPhase = ({ date, size = 100, style, observer, skyOrientationTime = "instant" }: MoonPhaseProps) => {
  const mountedRef = useRef(true);
  const lightRef = useRef<THREE.DirectionalLight | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  // Dessine une image de la scène (posée par onContextCreate une fois la scène prête).
  const renderFrameRef = useRef<(() => void) | null>(null);
  // Valeurs les plus récentes : onContextCreate s'exécute après coup (asynchrone) et ne doit pas
  // orienter la scène avec celles du rendu où le GLView a été monté si elles ont changé entre-temps.
  const orientationInputsRef = useRef<MoonOrientationInputs>({ date, observer, skyOrientationTime });
  orientationInputsRef.current = { date, observer, skyOrientationTime };
  // Le GLView ne monte qu'une fois cette mesure confirmée (onLayout) — monté trop tôt dans un
  // parent flex encore en cours de calcul (ex: une rangée avec un texte voisin en flex:1), sa
  // surface GL native capte une taille transitoire plus petite et ne se redimensionne jamais après.
  const [isLaidOut, setIsLaidOut] = useState(false);

  useEffect(() => {
    // Lance le chargement des textures dès le montage, en parallèle de la mise en page et de la
    // création du contexte GL, au lieu d'attendre onContextCreate. Une éventuelle erreur remonte
    // aussi là-bas (même promesse en cache) : inutile de la signaler deux fois.
    loadMoonTextures().catch(() => {});
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Si la date, le lieu ou le mode d'orientation changent pendant que l'instance reste montée (ex:
  // comparer deux dates successives sur la même instance) : on réoriente juste la scène et on
  // redessine — pas de recréation. Latitude/longitude plutôt que l'objet `observer` en dépendance :
  // un nouvel objet aux mêmes coordonnées (recréé par le parent) ne doit pas déclencher de rendu.
  useEffect(() => {
    if (sphereRef.current && lightRef.current && cameraRef.current) {
      applyOrientation(sphereRef.current, lightRef.current, cameraRef.current, orientationInputsRef.current);
    }
    renderFrameRef.current?.();
  }, [date, observer?.latitude, observer?.longitude, skyOrientationTime]);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    filterUnsupportedPixelStorei(gl);

    const { colorMap, normalMap } = await loadMoonTextures();
    if (!mountedRef.current) return;

    // expo-three.TextureLoader ne tague pas colorSpace automatiquement : sans ça, three.js traite
    // la texture couleur comme des données linéaires (pas de décodage sRGB), ce qui la rend bien
    // plus sombre/terne que prévu. La normal map reste en espace linéaire (ce n'est pas une couleur).
    colorMap.colorSpace = THREE.SRGBColorSpace;

    const renderer = new Renderer({ gl, width: size, height: size, pixelRatio: PixelRatio.get() });

    const scene = new THREE.Scene();
    // Caméra orthographique (voir la doc du composant) : la Terre est assez loin pour que la Lune y
    // soit vue sans perspective. Placée en +Z, elle regarde l'origine (vers -Z par défaut).
    const camera = new THREE.OrthographicCamera(
      -CAMERA_FRAME_HALF_SIZE,
      CAMERA_FRAME_HALF_SIZE,
      CAMERA_FRAME_HALF_SIZE,
      -CAMERA_FRAME_HALF_SIZE,
      0.1,
      100
    );
    camera.position.set(0, 0, 3);
    cameraRef.current = camera;

    // Ambiante basse + directionnelle forte : on veut un fort contraste entre partie éclairée et
    // partie dans l'ombre (pas une moyenne plus lumineuse partout — monter l'ambiante aplatirait
    // justement ce contraste en relevant le plancher des zones sombres).
    scene.add(new THREE.AmbientLight(0xffffff, 0.06));

    const directionalLight = new THREE.DirectionalLight(0xffffff, LIGHT_INTENSITY);
    lightRef.current = directionalLight;
    scene.add(directionalLight);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), createMoonMaterial(colorMap, normalMap));
    sphereRef.current = sphere;
    scene.add(sphere);

    applyOrientation(sphere, directionalLight, camera, orientationInputsRef.current);

    // Scène statique : une seule image, redessinée uniquement quand la date change (voir l'effet
    // sur `date`), au lieu d'une boucle requestAnimationFrame qui la redessinait 60 fois par seconde
    // sur le thread JS, pour chaque instance, tant que l'écran restait ouvert.
    const renderFrame = () => {
      if (!mountedRef.current) return;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    renderFrameRef.current = renderFrame;
    renderFrame();
  };

  return (
    <View style={[{ width: size, height: size }, style]} onLayout={() => setIsLaidOut(true)}>
      {isLaidOut && <GLView style={{ width: size, height: size }} onContextCreate={onContextCreate} />}
    </View>
  );
};

export default MoonPhase;
