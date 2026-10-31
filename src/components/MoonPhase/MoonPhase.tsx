import { useEffect, useRef, useState } from "react";
import { PixelRatio, View, type StyleProp, type ViewStyle } from "react-native";
import { GLView, type ExpoWebGLRenderingContext } from "expo-gl";
import { Asset } from "expo-asset";
import { Renderer, TextureLoader } from "expo-three";
import * as THREE from "three";
import { getLunarAge, getLunarPhaseAngle } from "@observerly/astrometry";

interface MoonPhaseProps {
  date: Date;
  size?: number;
  style?: StyleProp<ViewStyle>;
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
let texturesPromise: Promise<MoonTextures> | null = null;
const loadMoonTextures = (): Promise<MoonTextures> => {
  if (!texturesPromise) {
    texturesPromise = Promise.all([
      loadTexture(require("../../../assets/images/textures/2k_moon.jpg")),
      loadTexture(require("../../../assets/images/textures/2k_moon_normal.jpg")),
    ]).then(([colorMap, normalMap]) => ({ colorMap, normalMap }));
  }
  return texturesPromise;
};

// Distance "lumière" arbitraire (seule sa direction compte pour une DirectionalLight) et seuil
// croissante/décroissante : 14.7653 jours = LUNAR_SYNODIC_MONTH / 2 (Premier Quartier).
const LIGHT_DISTANCE = 5;
const WAXING_WANING_THRESHOLD_DAYS = 14.7653;

// Offset de rotation pour aligner le méridien de la texture (2k_moon.jpg) avec la face visible par
// la caméra — le mapping équirectangulaire par défaut de SphereGeometry ne tombe pas forcément au
// bon endroit selon la convention de la texture source. Valeur de départ non vérifiée visuellement,
// à ajuster par incréments de Math.PI / 2 jusqu'à ce que l'orientation soit correcte à l'écran.
const TEXTURE_ROTATION_Y = -Math.PI / 2;

// Position de la lumière pour une date donnée — i=0° (pleine lune) : lumière alignée avec la
// caméra. i=180° (nouvelle lune) : lumière derrière la sphère, face visible dans l'ombre. Le sens
// (gauche/droite du croissant éclairé) dépend de croissante/décroissante (hémisphère Nord par
// défaut, voir la limite documentée plus bas).
const getLightPosition = (date: Date): [number, number, number] => {
  const phaseAngleRad = (getLunarPhaseAngle(date) * Math.PI) / 180;
  const { age } = getLunarAge(date);
  const sign = age < WAXING_WANING_THRESHOLD_DAYS ? 1 : -1;
  return [sign * Math.sin(phaseAngleRad) * LIGHT_DISTANCE, 0, Math.cos(phaseAngleRad) * LIGHT_DISTANCE];
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
 * Limites assumées : pas de libration (face visible fixe, seul l'éclairage tourne avec la date),
 * pas de rotation idle (désynchroniserait la texture de l'angle d'éclairage calculé), orientation
 * hémisphère Nord par défaut (le sens du croissant serait inversé pour un observateur hémisphère
 * Sud — non géré ici).
 */
const MoonPhase = ({ date, size = 100, style }: MoonPhaseProps) => {
  const mountedRef = useRef(true);
  const lightRef = useRef<THREE.DirectionalLight | null>(null);
  // Le GLView ne monte qu'une fois cette mesure confirmée (onLayout) — monté trop tôt dans un
  // parent flex encore en cours de calcul (ex: une rangée avec un texte voisin en flex:1), sa
  // surface GL native capte une taille transitoire plus petite et ne se redimensionne jamais après.
  const [isLaidOut, setIsLaidOut] = useState(false);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );

  // Repositionne juste la lumière si `date` change pendant que l'instance reste montée (ex:
  // comparer deux dates successives sur la même instance) — pas de recréation de scène.
  useEffect(() => {
    lightRef.current?.position.set(...getLightPosition(date));
  }, [date]);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { colorMap, normalMap } = await loadMoonTextures();
    if (!mountedRef.current) return;

    // expo-three.TextureLoader ne tague pas colorSpace automatiquement : sans ça, three.js traite
    // la texture couleur comme des données linéaires (pas de décodage sRGB), ce qui la rend bien
    // plus sombre/terne que prévu. La normal map reste en espace linéaire (ce n'est pas une couleur).
    colorMap.colorSpace = THREE.SRGBColorSpace;

    const renderer = new Renderer({ gl, width: size, height: size, pixelRatio: PixelRatio.get() });

    const scene = new THREE.Scene();
    // fov=45, distance=3 pour un rayon de 1 : la sphère occupe ~80% du cadre avec de la marge (voir
    // ThreeSphereTest.tsx — l'ancien réglage, distance=2.5/fov=30, faisait déborder la sphère hors
    // du cadre, invisible en tant que sphère).
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 3);

    // Ambiante basse + directionnelle forte : on veut un fort contraste entre partie éclairée et
    // partie dans l'ombre (pas une moyenne plus lumineuse partout — monter l'ambiante aplatirait
    // justement ce contraste en relevant le plancher des zones sombres).
    scene.add(new THREE.AmbientLight(0xffffff, 0.06));

    const directionalLight = new THREE.DirectionalLight(0xffffff, 6);
    directionalLight.position.set(...getLightPosition(date));
    lightRef.current = directionalLight;
    scene.add(directionalLight);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), new THREE.MeshStandardMaterial({ map: colorMap, normalMap }));
    sphere.rotation.y = TEXTURE_ROTATION_Y;
    scene.add(sphere);

    const renderLoop = () => {
      if (!mountedRef.current) return;
      requestAnimationFrame(renderLoop);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    renderLoop();
  };

  return (
    <View style={[{ width: size, height: size }, style]} onLayout={() => setIsLaidOut(true)}>
      {isLaidOut && <GLView style={{ width: size, height: size }} onContextCreate={onContextCreate} />}
    </View>
  );
};

export default MoonPhase;
