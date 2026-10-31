import { useEffect, useMemo, useState } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { Canvas } from "@react-three/fiber";
import { TextureLoader } from "expo-three";
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

// Chargées une seule fois pour toute l'app (pas par <MoonPhase>) et partagées entre toutes les
// instances montées en même temps — la promesse est mise en cache au niveau du module : un
// deuxième montage réutilise directement le résultat déjà résolu plutôt que de recharger les
// textures depuis les assets.
let texturesPromise: Promise<MoonTextures> | null = null;
const loadMoonTextures = (): Promise<MoonTextures> => {
  if (!texturesPromise) {
    const loader = new TextureLoader();
    texturesPromise = Promise.all([
      loader.loadAsync(require("../../../assets/images/textures/2k_moon.jpg")),
      loader.loadAsync(require("../../../assets/images/textures/2k_moon_normal.jpg")),
    ]).then(([colorMap, normalMap]) => ({ colorMap, normalMap }));
  }
  return texturesPromise;
};

// Distance "lumière" arbitraire (seule sa direction compte pour une DirectionalLight) et seuil
// croissante/décroissante : 14.7653 jours = LUNAR_SYNODIC_MONTH / 2 (Premier Quartier).
const LIGHT_DISTANCE = 5;
const WAXING_WANING_THRESHOLD_DAYS = 14.7653;

interface MoonMeshProps extends MoonTextures {
  date: Date;
}

// Scène interne : une sphère + une seule lumière directionnelle positionnée selon l'angle de
// phase. Pas de libration (face visible fixe, seul l'éclairage tourne) et pas de rotation idle de
// la sphère : une rotation du mesh désynchroniserait la texture de l'angle d'éclairage calculé
// ci-dessous, ce qu'on veut justement éviter.
const MoonMesh = ({ date, colorMap, normalMap }: MoonMeshProps) => {
  const lightPosition = useMemo((): [number, number, number] => {
    const phaseAngleRad = (getLunarPhaseAngle(date) * Math.PI) / 180; // 0° = pleine lune, 180° = nouvelle lune
    const { age } = getLunarAge(date);
    const sign = age < WAXING_WANING_THRESHOLD_DAYS ? 1 : -1; // sens du croissant éclairé (hémisphère Nord)

    return [sign * Math.sin(phaseAngleRad) * LIGHT_DISTANCE, 0, Math.cos(phaseAngleRad) * LIGHT_DISTANCE];
  }, [date]);

  return (
    <>
      <ambientLight intensity={0.02} />
      <directionalLight position={lightPosition} intensity={1.2} />
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={colorMap} normalMap={normalMap} />
      </mesh>
    </>
  );
};

/**
 * <MoonPhase date={new Date()} size={120} />
 *
 * Rendu 3D de la Lune pour une date donnée, entièrement local (three.js via expo-gl +
 * @react-three/fiber, aucun appel réseau) — remplace l'illustration récupérée via l'API.
 *
 * Limites assumées (voir MoonMesh) : pas de libration, orientation hémisphère Nord par défaut
 * (le sens du croissant serait inversé pour un observateur hémisphère Sud — non géré ici).
 */
const MoonPhase = ({ date, size = 100, style }: MoonPhaseProps) => {
  const [textures, setTextures] = useState<MoonTextures | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadMoonTextures().then((loaded) => {
      if (!cancelled) setTextures(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={[{ width: size, height: size }, style]}>
      {textures && (
        <Canvas style={{ width: size, height: size }} camera={{ position: [0, 0, 2.5], fov: 30 }}>
          <MoonMesh date={date} colorMap={textures.colorMap} normalMap={textures.normalMap} />
        </Canvas>
      )}
    </View>
  );
};

export default MoonPhase;
