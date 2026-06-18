import * as THREE from 'three';
import { Star } from '../../types/Star';
import { raDecToVec3 } from '../utils/coordinates';
import { getSpectralColor } from '../utils/spectralColor';
import { LAYER_NAMES, RENDER_ORDER } from '../utils/renderOrders';
import { PlanetariumLoadingReporter } from '../utils/loadingReporter';
import { PixelRatio } from 'react-native';

export function createStarsLayer(
  catalog: Star[],
  setSelectedObject: (star: Star) => void,
  reporter?: PlanetariumLoadingReporter,
): THREE.Points {
  reporter?.({ stepId: 'stars', title: 'Star field', detail: `Projecting ${catalog.length} stars onto the sky dome`, status: 'active' });

  const count = catalog.length;
  const positions  = new Float32Array(count * 3);
  const sizes      = new Float32Array(count);
  const colors     = new Float32Array(count * 3);
  const brightness = new Float32Array(count);
  const magnitudes = new Float32Array(count);
  const pixelRatio = PixelRatio.get();

  for (let i = 0; i < count; i++) {
    const star = catalog[i];
    const pos = raDecToVec3(star.ra, star.dec, 10);
    const i3 = i * 3;
    positions[i3]     = pos.x;
    positions[i3 + 1] = pos.y;
    positions[i3 + 2] = pos.z;

    const mag = typeof star.V === 'number' ? star.V : 6;
    sizes[i] = Math.max(1.5, (6.5 - mag) * 2.8) * pixelRatio;

    const [r, g, b] = getSpectralColor(star.sp_type);
    colors[i3]     = r;
    colors[i3 + 1] = g;
    colors[i3 + 2] = b;

    brightness[i] = THREE.MathUtils.clamp((6.5 - mag) / 6.5, 0.05, 1.0);
    magnitudes[i] = mag; // raw visual magnitude for twilight threshold
  }

  reporter?.({ stepId: 'stars', title: 'Star field', detail: 'Uploading star buffers to GPU', status: 'active' });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position',   new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSize',      new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aColor',     new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aBrightness',new THREE.BufferAttribute(brightness, 1));
  geometry.setAttribute('aMagnitude', new THREE.BufferAttribute(magnitudes, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      // Sun altitude in degrees. Set to the real sun altitude when atmosphere
      // is enabled so stars fade in progressively at dusk/dawn. Set to -100
      // when atmosphere is disabled so all stars are always visible.
      uSunAlt:  { value: -100.0 },
      uFovScale:{ value: 1.0 },
    },
    vertexShader: `
      attribute float aSize;
      attribute vec3  aColor;
      attribute float aBrightness;
      attribute float aMagnitude;
      varying   vec3  vColor;
      varying   float vBrightness;
      varying   float vMagnitude;
      uniform   float uFovScale;

      void main() {
        vColor      = aColor;
        vBrightness = aBrightness;
        vMagnitude  = aMagnitude;
        gl_PointSize = aSize * uFovScale;
        gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying   vec3  vColor;
      varying   float vBrightness;
      varying   float vMagnitude;
      // uSunAlt: sun altitude in degrees.
      //   > 0  → full daylight, all stars hidden.
      //   0    → sunset/sunrise, only the very brightest start appearing.
      //   -10  → all stars fully visible.
      //   -100 → atmosphere off, always show every star.
      uniform   float uSunAlt;

      void main() {
        vec2  coord = gl_PointCoord - vec2(0.5);
        float d     = length(coord);

        // Sharp Airy-disk core + faint diffraction halo.
        // Core exponent 40 (vs old 14) makes stars genuinely point-like;
        // halo exponent 9 with low weight (0.12) adds just enough bloom for
        // bright stars without making dim ones look fuzzy.
        float core  = exp(-d * d * 40.0);
        float halo  = exp(-d * d * 9.0) * 0.12;
        float shape = core + halo;

        // Per-star twilight threshold — compressed so all stars finish
        // appearing by the time the sun reaches -10°:
        //   mag -1.5 (Sirius)  → threshold =   0°   → present at sunset
        //   mag  1.5           → threshold =  -3.2°
        //   mag  3.5           → threshold =  -5.3°
        //   mag  6.5 (limit)   → threshold =  -8.5° → fully bright at -10°
        //                                              (with ±1.5° fade window)
        float relMag    = clamp((vMagnitude + 1.5) / 8.0, 0.0, 1.0);
        float threshold = -relMag * 8.5;

        // Fade in over a ±1.5° window around the threshold so there is no
        // sudden pop, just a smooth emergence as the sky darkens.
        float appear = smoothstep(threshold + 1.5, threshold - 1.5, uSunAlt);

        float alpha = shape * appear * vBrightness;
        if (alpha < 0.01) discard;
        gl_FragColor = vec4(vColor * shape, alpha);
      }
    `,
    depthWrite:  false,
    depthTest:   true,
    transparent: true,
    blending:    THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = RENDER_ORDER.stars;
  points.name = LAYER_NAMES.stars;

  points.userData = {
    type: 'star',
    onTap: (index: number) => {
      if (catalog[index]) setSelectedObject(catalog[index]);
    },
  };

  reporter?.({ stepId: 'stars', title: 'Star field', detail: `Star cloud ready (${count} stars)`, status: 'done' });
  return points;
}

/**
 * Updates the uFovScale uniform so star sizes scale inversely with zoom.
 * Call this whenever the camera FOV changes.
 */
export function updateStarFovScale(cloud: THREE.Points, currentFov: number, baseFov = 75): void {
  const mat = cloud.material as THREE.ShaderMaterial;
  if (mat.uniforms?.uFovScale) {
    mat.uniforms.uFovScale.value = baseFov / Math.max(1, currentFov);
  }
}
