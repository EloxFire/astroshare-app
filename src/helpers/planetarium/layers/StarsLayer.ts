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
  const positions = new Float32Array(count * 3);
  const sizes     = new Float32Array(count);
  const colors    = new Float32Array(count * 3);
  const brightness = new Float32Array(count);
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
  }

  reporter?.({ stepId: 'stars', title: 'Star field', detail: 'Uploading star buffers to GPU', status: 'active' });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position',   new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSize',      new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aColor',     new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aBrightness',new THREE.BufferAttribute(brightness, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uNightFactor: { value: 1.0 },
      uFovScale:    { value: 1.0 },
    },
    vertexShader: `
      attribute float aSize;
      attribute vec3  aColor;
      attribute float aBrightness;
      varying   vec3  vColor;
      varying   float vBrightness;
      uniform   float uFovScale;

      void main() {
        vColor      = aColor;
        vBrightness = aBrightness;
        gl_PointSize = aSize * uFovScale;
        gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying   vec3  vColor;
      varying   float vBrightness;
      uniform   float uNightFactor;

      void main() {
        vec2  coord = gl_PointCoord - vec2(0.5);
        float d     = length(coord);
        // Gaussian soft disk — Stellarium-style
        float core  = exp(-d * d * 14.0);
        float halo  = exp(-d * d * 5.0) * 0.3;
        float alpha = (core + halo) * uNightFactor * vBrightness;
        if (alpha < 0.01) discard;
        gl_FragColor = vec4(vColor * (core + halo), alpha);
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
