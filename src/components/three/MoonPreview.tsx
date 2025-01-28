import React, { useRef } from "react";
import { View } from "react-native";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { Asset } from "expo-asset";
import * as ExpoTHREE from "expo-three";
import { degToRad } from "three/src/math/MathUtils";
import * as FileSystem from "expo-file-system";

interface MoonPreviewProps {
  size: number; // Taille du carré pour la scène (en pixels)
}

const MoonPreview: React.FC<MoonPreviewProps> = ({ size }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<ExpoTHREE.Renderer | null>(null);
  const moonMeshRef = useRef<THREE.Mesh | null>(null);

  const moonRadius = 1737; // Rayon de la Lune en km

  const loadAndProcessAsset = async () => {
    try {
      const texture = Asset.fromModule(require("../../../assets/images/textures/moon/2k_moon.jpg"));
      const normalMap = Asset.fromModule(require("../../../assets/images/textures/moon/2k_moon_normal.jpg"));

      if (!texture.localUri) {
        await texture.downloadAsync();
      }
      if (!normalMap.localUri) {
        await normalMap.downloadAsync();
      }

      const textureNewLocalUri = `${FileSystem.cacheDirectory}copied_texture.png`;
      const normalMapNewLocalUri = `${FileSystem.cacheDirectory}copied_normal_map.png`;

      let textureFileInfo = await FileSystem.getInfoAsync(textureNewLocalUri);
      let normalMapFileInfo = await FileSystem.getInfoAsync(normalMapNewLocalUri);

      if (!textureFileInfo.exists) {
        await FileSystem.copyAsync({ from: texture.localUri!, to: textureNewLocalUri });
      }
      if (!normalMapFileInfo.exists) {
        await FileSystem.copyAsync({ from: normalMap.localUri!, to: normalMapNewLocalUri });
        normalMapFileInfo = await FileSystem.getInfoAsync(normalMapNewLocalUri);
      }

      const textureCopiedAsset = Asset.fromURI(textureNewLocalUri);
      const normalMapCopiedAsset = Asset.fromURI(normalMapNewLocalUri);

      const finalTexture = await ExpoTHREE.loadAsync(textureCopiedAsset);
      const finalNormalMap = await ExpoTHREE.loadAsync(normalMapCopiedAsset);

      return {
        texture: finalTexture,
        normalMap: finalNormalMap,
      };
    } catch (error) {
      console.error("Erreur lors du chargement de l'asset :", error);
    }
  };

  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth, drawingBufferHeight } = gl;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, drawingBufferWidth / drawingBufferHeight, 0.1, 500000);
    const renderer = new ExpoTHREE.Renderer({ gl });
    renderer.setSize(drawingBufferWidth, drawingBufferHeight);

    camera.position.set(0, 0, moonRadius * 2);
    camera.lookAt(0, 0, 0);

    cameraRef.current = camera;
    sceneRef.current = scene;
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 10);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
    directionalLight.position.set(10, 10, 10).normalize();
    scene.add(directionalLight);

    const moonTexture = await loadAndProcessAsset();
    if (moonTexture) {
      const moonGeometry = new THREE.SphereGeometry(moonRadius, 128, 128);
      const moonMaterial = new THREE.MeshStandardMaterial({
        map: moonTexture.texture,
        normalMap: moonTexture.normalMap,
        roughness: 1,
        metalness: 0,
      });

      moonTexture.texture.encoding = THREE.sRGBEncoding as number; // Appliquer l'encodage SRGB
      moonTexture.normalMap.encoding = THREE.LinearEncoding as number;

      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.rotation.y = degToRad(-90);
      scene.add(moon);
      moonMeshRef.current = moon;
    }

    const animate = () => {
      requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        gl.endFrameEXP();
      }
    };

    animate();
  };

  return (
    <View style={{ width: size, height: size, alignSelf: "center" }}>
      <GLView style={{ flex: 1 }} onContextCreate={_onContextCreate} />
    </View>
  );
};

export default MoonPreview;
