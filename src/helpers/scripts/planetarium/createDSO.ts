import * as THREE from 'three';
import * as ExpoTHREE from "expo-three";
import planetariumImages from '../../planetarium_images.json';
import { convertSphericalToCartesian } from "./utils/convertSphericalToCartesian";
import {planetariumRenderOrders} from "./utils/renderOrders";

export const createDSO = () => {
  console.log("[GLView] Creating Deep Sky Objects...");

  const dsoMeshes: THREE.Mesh[] = [];

  planetariumImages.images.forEach((image) => {
    const verticesBuffer: number[] = [];
    const uvBuffer: number[] = [];
    const geometry = new THREE.BufferGeometry();
    const corners: THREE.Vector3[] = [];

    const indices = [
      0, 1, 2,
      2, 3, 0
    ];

    image.worldCoords[0].forEach((imageVertex, index) => {
      const { x, y, z } = convertSphericalToCartesian(9.7, imageVertex[0], imageVertex[1]);
      verticesBuffer.push(x, y, z);
      corners.push(new THREE.Vector3(x, y, z));

      const u = image.textureCoords[0][index][0];
      const v = image.textureCoords[0][index][1];
      uvBuffer.push(u, v);
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(verticesBuffer, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvBuffer, 2));
    geometry.setIndex(indices);

    const textureLoader = new ExpoTHREE.TextureLoader();
    const texture = textureLoader.load(image.imageUrl);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D map;
      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(map, vUv);

        float alpha = 1.0;
        float border = 0.1;
        if (vUv.x < border || vUv.x > (1.0 - border) || vUv.y < border || vUv.y > (1.0 - border)) {
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
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
    });

    const nebulae = new THREE.Mesh(geometry, nebulaeMaterial);

    // Ajout des coins et du onTap
    nebulae.userData = {
      type: 'dso',
      index: image.imageUrl.split('/').pop()!.split('.')[0],
      corners,
      onTap: () => {
        console.log(`[GLView] DSO tapped: ${image.imageUrl.split('/').pop()!.split('.')[0]}`);
      }
    };

    nebulae.renderOrder = planetariumRenderOrders.dso

    dsoMeshes.push(nebulae);
  });

  console.log("[GLView] Deep Sky Objects created");
  return dsoMeshes;
}