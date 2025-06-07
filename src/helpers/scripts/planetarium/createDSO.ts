import * as THREE from 'three';
import * as ExpoTHREE from "expo-three";
import planetariumImages from '../../planetarium_images.json';
import { convertSphericalToCartesian } from "./utils/convertSphericalToCartesian";
import {meshGroupsNames, planetariumRenderOrders} from "./utils/planetariumSettings";

export const createDSO = (setUiInfos: React.Dispatch<any>) => {
  console.log("[GLView] Creating Deep Sky Objects...");

  const dsoMeshes: THREE.Group = new THREE.Group();

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
        const selectedImage = image.imageUrl.split('/').pop()!.split('.')[0]
        console.log(`[GLView] DSO tapped: ${selectedImage}`);
        const { x, y, z } = convertSphericalToCartesian(9.7, image.worldCoords[0][0][0], image.worldCoords[0][0][1]);

        // Fetch Astroshare api to get object data
        fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/dso/${selectedImage}`)
          .then(response => response.json())
          .then(data => {
            console.log("[GLView] DSO data fetched:", data.dsoObject);
            if (!data) {
              console.error("[GLView] No data found for DSO:", selectedImage);
              setUiInfos(null);
              return;
            }else{
              setUiInfos({
                object: data.dsoObject,
                meshPosition: new THREE.Vector3(x, y, z),
              });
            }
          })
          .catch(error => {
            console.error("[GLView] Error fetching DSO data:", error);
          });
      }
    };

    nebulae.renderOrder = planetariumRenderOrders.dso

    dsoMeshes.add(nebulae);
  });

  dsoMeshes.name = meshGroupsNames.dso;

  console.log("[GLView] Deep Sky Objects created");
  return dsoMeshes;
}