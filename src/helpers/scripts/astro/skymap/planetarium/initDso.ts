import * as THREE from 'three';
import planetariumImages from '../../../../planetarium_images.json'
import {convertSphericalToCartesian} from "../convertSphericalToCartesian";
import * as ExpoTHREE from "expo-three";

export const initDso = (scene: THREE.Scene) => {
  console.log('[Planetarium] Initializing Deep Sky Objects images...');
  const allDsoMeshes: THREE.Mesh[] = [];
  planetariumImages.images.forEach((image) => {
    const verticesBuffer: number[] = [];
    const uvBuffer: number[] = [];
    const geometry = new THREE.BufferGeometry();

    const indices: number[] = [
      0, 1, 2, // first triangle
      2, 3, 0  // second triangle
    ];

    image.worldCoords[0].forEach((imageVertex: number[], index: number) => {
      const { x, y, z } = convertSphericalToCartesian(11, imageVertex[0], imageVertex[1]);
      verticesBuffer.push(x, y, z);

      // Ajoutez les coordonnées UV correspondantes
      const u = image.textureCoords[0][index][0];
      const v = image.textureCoords[0][index][1];
      uvBuffer.push(u, v);
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(verticesBuffer, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvBuffer, 2));
    geometry.setIndex(indices);

    const textureLoader = new ExpoTHREE.TextureLoader();
    const texture: THREE.Texture = textureLoader.load(image.imageUrl);

    // Définir le vertex shader
    const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

    // Définir le fragment shader avec effet de fondu rectangulaire
    const fragmentShader = `
        uniform sampler2D map;
        varying vec2 vUv;
    
        void main() {
          vec4 color = texture2D(map, vUv);
    
          // Calculer la distance par rapport aux bords
          float alpha = 1.0;
          float border = 0.1; // Largeur de la bordure de fondu
    
          if (vUv.x < border || vUv.x > (1.0 - border) || vUv.y < border || vUv.y > (1.0 - border)) {
            // Appliquer un effet de fondu basé sur la distance par rapport aux bords
            float dist = min(vUv.x, 1.0 - vUv.x);
            dist = min(dist, min(vUv.y, 1.0 - vUv.y));
            alpha = smoothstep(0.0, border, dist);
          }
    
          gl_FragColor = vec4(color.rgb, color.a * alpha);
        }
      `;

    const nebulaeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending, // Utiliser un mode de fusion normal pour un effet naturel
    });

    const nebulae = new THREE.Mesh(geometry, nebulaeMaterial);
    allDsoMeshes.push(nebulae);
    scene.add(nebulae);
  });

  console.log(`[Planetarium] Deep Sky Objects images initialized (${allDsoMeshes.length} objects).`);
  return allDsoMeshes;
}