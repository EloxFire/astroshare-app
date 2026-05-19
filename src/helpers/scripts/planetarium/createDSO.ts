import * as THREE from 'three';
import * as ExpoTHREE from "expo-three";
import planetariumImages from '../../planetarium_images.json';
import { convertSphericalToCartesian } from "./utils/convertSphericalToCartesian";
import {meshGroupsNames, planetariumRenderOrders} from "./utils/planetariumSettings";
import {DSO} from "../../types/DSO";
import {PlanetariumLoadingReporter} from "./utils/loadingReporter";

const normalizeKey = (value: string) => value.toLowerCase().replace(/\s+/g, '');

export const createDSO = (
  getDsoCatalog: () => DSO[],
  setUiInfos: React.Dispatch<any>,
  reportLoading?: PlanetariumLoadingReporter
) => {
  console.log("[GLView] Creating Deep Sky Objects...");
  const totalImages = planetariumImages.images.length;
  reportLoading?.({
    stepId: 'dso',
    title: 'Deep-sky objects',
    detail: `Building ${totalImages} DSO billboards and queueing remote textures`,
    status: 'active',
  });

  const dsoMeshes: THREE.Group = new THREE.Group();

  planetariumImages.images.forEach((image, index) => {
    if (index === 0 || index === totalImages - 1 || (index + 1) % 25 === 0) {
      const textureKey = image.imageUrl.split('/').pop()!.split('.')[0];
      reportLoading?.({
        stepId: 'dso',
        title: 'Deep-sky objects',
        detail: `Queueing DSO texture ${index + 1}/${totalImages} (${textureKey})`,
        status: 'active',
      });
    }

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
      uniform float uVisibility;
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

        gl_FragColor = vec4(color.rgb * uVisibility, color.a * alpha * uVisibility);
      }
    `;

    const nebulaeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        uVisibility: { value: 1.0 },
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
        const catalog = getDsoCatalog();
        const normalizedKey = normalizeKey(selectedImage);
        const parsedKey = normalizedKey.match(/^(ic|m|n)(\d+)/);
        const prefix = parsedKey?.[1];
        const numericKey = parsedKey?.[2] ?? '';

        console.log("[GLView] Searching DSO in catalog with key:", normalizedKey, "numeric part:", numericKey);

        const extractDigits = (value: string | number | null | undefined) => `${value ?? ''}`.toLowerCase().replace(/\D/g, '');

        const dsoFromCatalog =
          catalog.find((dso) => {
            if (!numericKey) return false;

            if (prefix === 'ic') {
              return extractDigits(dso.ic) === numericKey;
            }

            if (prefix === 'm') {
              return extractDigits(dso.m) === numericKey;
            }

            if (prefix === 'n') {
              return extractDigits(dso.ngc) === numericKey;
            }

            return false;
          }) ??
          catalog.find((dso) => {
            const nameMatch = normalizeKey(dso.name) === normalizedKey;
            const identifiersMatch = normalizeKey(dso.identifiers ?? '').includes(normalizedKey);
            console.log(`[GLView] Fallback DSO match check for ${selectedImage}: nameMatch=${nameMatch}, identifiersMatch=${identifiersMatch}`);
            
            return nameMatch || identifiersMatch;
          });

        if (!dsoFromCatalog) {
          console.warn("[GLView] No cached DSO found for:", selectedImage);
          setUiInfos(null);
          return;
        }

        setUiInfos(dsoFromCatalog);
      }
    };

    nebulae.renderOrder = planetariumRenderOrders.dso

    dsoMeshes.add(nebulae);
  });

  dsoMeshes.name = meshGroupsNames.dso;

  console.log("[GLView] Deep Sky Objects created");
  reportLoading?.({
    stepId: 'dso',
    title: 'Deep-sky objects',
    detail: `DSO mesh group ready (${totalImages} textured objects)`,
    status: 'done',
  });
  return dsoMeshes;
}
