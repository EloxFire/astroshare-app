import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, PixelRatio, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import { GLView, type ExpoWebGLRenderingContext } from "expo-gl";
import { Directory, File, Paths } from "expo-file-system";
import { Renderer, TextureLoader } from "expo-three";
import * as THREE from "three";
import { GLTFLoader, type GLTFParser } from "three/examples/jsm/loaders/GLTFLoader.js";
import { app_colors } from "../../helpers/variables";
import { filterUnsupportedPixelStorei } from "../../helpers/expoGL";
import { model3DViewerStyles } from "./Model3DViewer.styles";

// Bornes de l'angle polaire (radians, ~75°) : empêche la caméra de passer au-dessus/dessous du
// modèle (perte de repère, effet de gimbal). La vitesse de rotation elle-même est calculée dans
// handlePanUpdate (résolution-indépendante + compensée par le zoom courant).
const MAX_POLAR_ANGLE = 1.3;
// Bornes de zoom, relatives à la distance de cadrage initiale (voir son calcul dans onContextCreate).
const MIN_ZOOM_FACTOR = 0.4;
const MAX_ZOOM_FACTOR = 1;

interface Model3DViewerProps {
  // URI locale d'un fichier .glb déjà téléchargé (voir useRemoteFile) — pas d'URL distante ici,
  // ce composant ne télécharge rien lui-même.
  uri: string;
  style?: StyleProp<ViewStyle>;
  // Correction d'orientation (radians) propre à cet asset — voir ThreeDModel.rotationY. 0 par
  // défaut : ce composant générique ne doit pas supposer qu'un modèle a besoin d'être pivoté.
  rotationY?: number;
}

// Dispose récursivement géométries/matériaux/textures d'une scène chargée : contrairement à
// MoonPhase (textures partagées entre instances, jamais disposées), chaque modèle ici est propre
// à son instance — sans ça, démonter/remonter ce composant (ex: en changeant de fiche modèle)
// accumulerait des ressources GPU jamais libérées.
const disposeObject3D = (object: THREE.Object3D) => {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    child.geometry?.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value instanceof THREE.Texture) value.dispose();
      });
      material.dispose();
    });
  });
};

// Dossier de travail pour les images extraites d'un .glb pendant leur chargement (voir
// loadEmbeddedTexture ci-dessous) — un sous-dossier du cache, purgeable par l'OS sans conséquence.
const GLTF_TEXTURES_CACHE_DIR = new Directory(Paths.cache, "gltf-textures");

// Charge une texture depuis une uri locale avec le TextureLoader d'expo-three (même mécanisme que
// MoonPhase.tsx) : contrairement à THREE.TextureLoader, il ne dépend pas d'API DOM (document,
// Image web, createImageBitmap...) absentes de Hermes/React Native.
const loadTextureFromUri = (uri: string): Promise<THREE.Texture> =>
  new Promise((resolve, reject) => {
    new TextureLoader().load(uri, resolve, undefined, reject);
  });

// Remplace la méthode de GLTFLoader qui charge les images d'un modèle (voir son utilisation dans
// onContextCreate, via loader.register). Pour une image embarquée dans le binaire — le cas des
// .glb autonomes comme nos modèles téléchargés —, la version par défaut construit un `Blob` puis
// un `URL.createObjectURL`, deux API absentes de React Native (Blob n'accepte pas d'ArrayBuffer :
// "Creating blobs from 'ArrayBuffer' ... are not supported"). On écrit donc ces octets dans un
// fichier temporaire et on le charge avec loadTextureFromUri à la place.
const loadEmbeddedTexture = (parser: GLTFParser, sourceIndex: number): Promise<THREE.Texture> => {
  const sourceCache = (parser as unknown as { sourceCache: Record<number, Promise<THREE.Texture>> }).sourceCache;
  if (sourceCache[sourceIndex] !== undefined) {
    return sourceCache[sourceIndex].then((texture) => texture.clone());
  }

  const sourceDef = parser.json.images[sourceIndex];

  const promise = (async () => {
    if (sourceDef.bufferView === undefined) {
      // Image référencée par une URI classique (externe ou data:) : rien à extraire du binaire.
      return loadTextureFromUri(sourceDef.uri);
    }

    const bufferView = (await parser.getDependency("bufferView", sourceDef.bufferView)) as ArrayBuffer;
    const extension = sourceDef.mimeType === "image/png" ? "png" : "jpg";
    const tmpFile = new File(GLTF_TEXTURES_CACHE_DIR, `texture-${sourceIndex}.${extension}`);
    tmpFile.create({ intermediates: true, overwrite: true });
    tmpFile.write(new Uint8Array(bufferView));

    return loadTextureFromUri(tmpFile.uri);
  })();

  sourceCache[sourceIndex] = promise;
  return promise;
};

/**
 * <Model3DViewer uri={localUri} style={{ width: "100%", height: 280 }} />
 *
 * Affiche n'importe quel modèle .glb local dans une scène three.js (expo-gl, scène gérée à la
 * main comme MoonPhase.tsx — @react-three/fiber plante encore à l'import avec React 19). Remplit
 * toujours 100% de son conteneur (mesuré via onLayout) plutôt qu'une taille fixe : c'est au
 * conteneur parent de définir la taille réellement affichée, qui peut donc varier avec l'écran.
 *
 * Caméra perspective cadrée automatiquement sur la bounding sphere du modèle chargé : contrairement
 * à MoonPhase (rayon de sphère fixe, caméra orthographique), un modèle arbitraire a une taille et
 * une origine inconnues à l'avance.
 *
 * Pan pour orbiter autour du modèle, pinch pour zoomer (voir applyCameraOrbit) : même pattern de
 * gestes que ZoomableImage.tsx (react-native-gesture-handler), mais sans Reanimated côté rendu —
 * la caméra et le rendu GL vivent sur le thread JS (comme MoonPhase), donc chaque mise à jour de
 * geste y est renvoyée via scheduleOnRN plutôt que pilotée par une valeur partagée/un style animé.
 */
const Model3DViewer = ({ uri, style, rotationY = 0 }: Model3DViewerProps) => {
  const mountedRef = useRef(true);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const renderFrameRef = useRef<(() => void) | null>(null);
  // Dimensions mesurées du conteneur (onLayout) : sert à la fois à ne monter le GLView qu'une fois
  // connu, et à dimensionner renderer/caméra/sensibilité des gestes sur la taille réelle à l'écran.
  const [layoutSize, setLayoutSize] = useState<{ width: number; height: number } | null>(null);
  // Reste à true tant que le modèle n'a pas fini de charger (texture incluse) — affiche le loader
  // par-dessus le GLView en attendant (voir le rendu plus bas).
  const [isModelReady, setIsModelReady] = useState(false);

  // Orientation/distance courantes de la caméra, en coordonnées sphériques autour du modèle
  // (centré à l'origine) — mises à jour par les gestes, indépendamment des re-renders React.
  // Azimut/angle polaire à 0 = le cadrage initial calculé dans onContextCreate (caméra en +Z).
  const azimuthRef = useRef(0);
  const polarRef = useRef(0);
  const distanceRef = useRef(0);
  // Distance de cadrage initiale (zoom neutre) : référence pour compenser la sensibilité des
  // gestes selon le niveau de zoom courant (voir handlePanUpdate).
  const baseDistanceRef = useRef(0);
  const minDistanceRef = useRef(0);
  const maxDistanceRef = useRef(0);
  // Valeurs sauvegardées au début de chaque geste, pour raisonner en delta plutôt qu'en absolu
  // (même principe que savedScale/savedTranslateX dans ZoomableImage.tsx).
  const gestureStartRef = useRef({ azimuth: 0, polar: 0, distance: 0 });

  // Replace la caméra selon azimuthRef/polarRef/distanceRef et redessine — appelée à la fois après
  // le chargement du modèle (cadrage initial) et à chaque mise à jour d'un geste.
  const applyCameraOrbit = () => {
    const camera = cameraRef.current;
    if (!camera) return;

    const distance = distanceRef.current;
    const polar = polarRef.current;
    const azimuth = azimuthRef.current;

    camera.position.set(
      distance * Math.cos(polar) * Math.sin(azimuth),
      distance * Math.sin(polar),
      distance * Math.cos(polar) * Math.cos(azimuth)
    );
    camera.lookAt(0, 0, 0);
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();

    renderFrameRef.current?.();
  };

  const handlePanStart = () => {
    gestureStartRef.current.azimuth = azimuthRef.current;
    gestureStartRef.current.polar = polarRef.current;
  };

  // Glisser vers la droite fait tourner le modèle vers la droite (sous le doigt), donc la caméra
  // orbite dans l'autre sens — d'où le signe moins sur l'azimut.
  //
  // Vitesse résolution-indépendante (glisser sur toute la largeur/hauteur du visualiseur ≈ un
  // demi-tour), et compensée par le zoom courant : à distance égale en pixels glissés, une caméra
  // plus proche fait balayer le même angle sur une portion bien plus grande de l'écran — sans cette
  // compensation, la rotation semblait beaucoup trop rapide une fois zoomé.
  const handlePanUpdate = (translationX: number, translationY: number) => {
    if (!layoutSize) return;

    const zoomFactor = distanceRef.current / baseDistanceRef.current;
    const rotateSpeedX = (Math.PI / layoutSize.width) * zoomFactor;
    const rotateSpeedY = (Math.PI / layoutSize.height) * zoomFactor;

    azimuthRef.current = gestureStartRef.current.azimuth - translationX * rotateSpeedX;
    polarRef.current = Math.min(
      Math.max(gestureStartRef.current.polar + translationY * rotateSpeedY, -MAX_POLAR_ANGLE),
      MAX_POLAR_ANGLE
    );
    applyCameraOrbit();
  };

  const handlePinchStart = () => {
    gestureStartRef.current.distance = distanceRef.current;
  };

  const handlePinchUpdate = (scale: number) => {
    distanceRef.current = Math.min(
      Math.max(gestureStartRef.current.distance / scale, minDistanceRef.current),
      maxDistanceRef.current
    );
    applyCameraOrbit();
  };

  const panGesture = Gesture.Pan()
    .onStart(() => scheduleOnRN(handlePanStart))
    .onUpdate((event) => scheduleOnRN(handlePanUpdate, event.translationX, event.translationY));

  const pinchGesture = Gesture.Pinch()
    .onStart(() => scheduleOnRN(handlePinchStart))
    .onUpdate((event) => scheduleOnRN(handlePinchUpdate, event.scale));

  // Pan et pinch doivent pouvoir se combiner (zoomer tout en orbitant) : Simultaneous plutôt que
  // Race (voir ZoomableImage.tsx, qui lui a besoin de Race pour exclure le double-tap).
  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (sceneRef.current) disposeObject3D(sceneRef.current);
      rendererRef.current?.dispose();
    };
  }, []);

  const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    // Garde-fou TypeScript : le GLView n'est monté que lorsque layoutSize est connu (voir le rendu).
    if (!layoutSize) return;
    const { width, height } = layoutSize;

    filterUnsupportedPixelStorei(gl);

    const renderer = new Renderer({ gl, width, height, pixelRatio: PixelRatio.get() });
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 1000);

    // Éclairage neutre à trois points, pensé pour un modèle quelconque (pas de direction "soleil"
    // particulière comme pour la Lune) : une lumière principale, une lumière d'appoint plus faible
    // de l'autre côté pour ne pas laisser de face totalement noire, une ambiante pour le plancher.
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-3, -1, -2);
    scene.add(fillLight);

    const renderFrame = () => {
      if (!mountedRef.current) return;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    const onLoadError = (error: unknown) => {
      if (__DEV__) console.warn("[Model3DViewer] Échec du chargement du modèle :", error);
    };

    // GLTFLoader.load(uri, ...) passe par FileLoader, qui s'appuie sur fetch() + lecture en flux
    // et construit un ProgressEvent — une API navigateur absente de Hermes/React Native
    // ("ReferenceError: Property 'ProgressEvent' doesn't exist"). On lit donc le fichier local
    // nous-mêmes (déjà téléchargé par useRemoteFile) et on passe les octets à GLTFLoader.parse(),
    // qui n'a besoin d'aucune de ces API web.
    new File(uri).arrayBuffer()
      .then((arrayBuffer) => {
        if (!mountedRef.current) return;

        const loader = new GLTFLoader();
        // Voir loadEmbeddedTexture : remplace le chargement des images du modèle par une version
        // compatible React Native.
        loader.register((parser) => {
          parser.loadImageSource = (sourceIndex) => loadEmbeddedTexture(parser, sourceIndex);
          return { name: "AstroshareGLTFTextureLoader" };
        });

        loader.parse(
          arrayBuffer,
          "", // pas de ressources externes à résoudre : un .glb embarque tout
          (gltf) => {
            if (!mountedRef.current) return;

            const model = gltf.scene;

            // Appliquée avant le calcul de la bounding sphere, pour que le cadrage caméra se base
            // sur l'orientation finale présentée.
            model.rotation.y = rotationY;

            // Centre le modèle à l'origine et recule la caméra selon sa bounding sphere, puisque
            // sa taille/origine ne sont pas connues à l'avance.
            const boundingSphere = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere());
            model.position.sub(boundingSphere.center);

            const fovRadians = (camera.fov * Math.PI) / 180;
            // 1 = la bounding sphere touche juste les bords du cadre (le plus près possible sans
            // jamais rogner le modèle, quelle que soit son orientation).
            const margin = 0.65;
            const distance = (boundingSphere.radius / Math.sin(fovRadians / 2)) * margin;

            cameraRef.current = camera;
            renderFrameRef.current = renderFrame;
            azimuthRef.current = 0;
            polarRef.current = 0;
            distanceRef.current = distance;
            baseDistanceRef.current = distance;
            minDistanceRef.current = distance * MIN_ZOOM_FACTOR;
            maxDistanceRef.current = distance * MAX_ZOOM_FACTOR;

            scene.add(model);
            setIsModelReady(true);
            applyCameraOrbit();
          },
          onLoadError
        );
      })
      .catch(onLoadError);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayoutSize({ width, height });
  };

  return (
    <GestureDetector gesture={composedGesture}>
      <View style={[{ width: "100%", height: "100%" }, style]} onLayout={onLayout}>
        {layoutSize && (
          <GLView style={{ width: layoutSize.width, height: layoutSize.height }} onContextCreate={onContextCreate} />
        )}
        {!isModelReady && (
          <View style={model3DViewerStyles.loaderOverlay}>
            <ActivityIndicator color={app_colors.white} />
          </View>
        )}
      </View>
    </GestureDetector>
  );
};

export default Model3DViewer;
