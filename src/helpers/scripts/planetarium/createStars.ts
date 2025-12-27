import * as THREE from 'three';
import {convertSphericalToCartesian} from "./utils/convertSphericalToCartesian";
import {Star} from "../../types/Star";
import {getBrightStarName} from "../astro/objects/getBrightStarName";
import {meshGroupsNames, planetariumRenderOrders} from "./utils/planetariumSettings";
import {computeObject} from "../astro/objects/computeObject";
import {GeographicCoordinate} from "@observerly/astrometry";

interface createStarsProps {
  starsCatalog: Star[];
  setUiInfos: React.Dispatch<any>;
  observer: GeographicCoordinate;
}

export function createStars(starsCatalog: Star[], setUiInfos: React.Dispatch<any>) {
  console.log("[GLView] Creating stars...");


  const starCount = starsCatalog.length;
  const positions = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);
  const colors = new Float32Array(starCount * 4);

  for (let i: number = 0; i < starCount; i++) {
    const star: Star = starsCatalog[i];
    const { x, y, z } = convertSphericalToCartesian(10, star.ra, star.dec);

    const i3 = i * 3;
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    sizes[i] = Math.max(0.5, 6 - star.V) * 4;

    const [r, g, b] = getStarColorFromSpectralType(star.sp_type);
    colors[i3] = r;
    colors[i3 + 1] = g;
    colors[i3 + 2] = b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));

  const material = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float size;
      attribute vec4 color;
      varying vec4 vColor;
      
      void main() {
        vColor = color;
        gl_PointSize = size;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader:`
      precision mediump float;
      varying vec4 vColor;
      
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
      
        // Masque circulaire net
        if (dist > 0.5) {
          discard;
        }
      
        gl_FragColor = vColor;
      }
    `,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
});

  const starsCloud = new THREE.Points(geometry, material);
  starsCloud.frustumCulled = false;
  starsCloud.renderOrder = planetariumRenderOrders.stars;

  function onStarTap (star: Star) {
    console.log(`[GLView] Star tapped: ${getBrightStarName(star.ids)}`);
    const { x, y, z } = convertSphericalToCartesian(10, star.ra, star.dec);
    setUiInfos(star)
  }

  starsCloud.userData = {
    type: 'star',
    onTap: (index: number) => {
      if (onStarTap) {
        onStarTap(starsCatalog[index]);
      }
    }
  };
  starsCloud.name = meshGroupsNames.stars;

  console.log("[GLView] Stars created");
  return starsCloud;
}

// Renvoie une valeur entre 0 et 1 selon le type spectral
function getStarColorFromSpectralType(type: string | null): [number, number, number] {
  if (!type) return [1.0, 1.0, 1.0];

  const spectralColors: Record<string, [number, number, number]> = {
    O: [0.6, 0.8, 1.0],   // bleu pâle
    B: [0.7, 0.8, 1.0],   // bleu
    A: [0.8, 0.85, 1.0],  // blanc bleuté
    F: [0.9, 0.9, 1.0],   // blanc
    G: [1.0, 1.0, 0.8],   // jaune pâle
    K: [1.0, 0.9, 0.6],   // orange clair
    M: [1.0, 0.8, 0.6],   // rouge/orangé
  };

  const code: string = type[0];
  return [1.0, 1.0, 1.0]
  return spectralColors[code] || [1.0, 1.0, 1.0];
}