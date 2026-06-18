import * as THREE from 'three';
import * as ExpoTHREE from 'expo-three';
import planetariumImages from '../../planetarium_images.json';
import { raDecToVec3 } from '../utils/coordinates';
import { LAYER_NAMES, RENDER_ORDER } from '../utils/renderOrders';
import { DSO } from '../../types/DSO';
import { PlanetariumLoadingReporter } from '../utils/loadingReporter';

const normalizeKey = (value: string) => value.toLowerCase().replace(/\s+/g, '');

export function createDSOLayer(
  getDsoCatalog: () => DSO[],
  setSelectedObject: (dso: DSO | null) => void,
  reporter?: PlanetariumLoadingReporter,
): THREE.Group {
  const total = (planetariumImages as any).images.length;
  reporter?.({ stepId: 'dso', title: 'Deep-sky objects', detail: `Building ${total} DSO billboards`, status: 'active' });

  const group = new THREE.Group();
  group.name = LAYER_NAMES.dso;

  (planetariumImages as any).images.forEach((image: any, index: number) => {
    if (index === 0 || index === total - 1 || (index + 1) % 25 === 0) {
      const key = image.imageUrl.split('/').pop()!.split('.')[0];
      reporter?.({ stepId: 'dso', title: 'Deep-sky objects', detail: `Queuing DSO ${index + 1}/${total} (${key})`, status: 'active' });
    }

    const vertices: number[] = [];
    const uvCoords: number[] = [];
    const corners: THREE.Vector3[] = [];

    image.worldCoords[0].forEach((vertex: [number, number], vi: number) => {
      const pos = raDecToVec3(vertex[0], vertex[1], 9.7);
      vertices.push(pos.x, pos.y, pos.z);
      corners.push(pos.clone());
      uvCoords.push(image.textureCoords[0][vi][0], image.textureCoords[0][vi][1]);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvCoords, 2));
    geometry.setIndex([0, 1, 2, 2, 3, 0]);

    const texture = new ExpoTHREE.TextureLoader().load(image.imageUrl);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        map:         { value: texture },
        uVisibility: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform float uVisibility;
        varying vec2 vUv;

        void main() {
          vec4 color = texture2D(map, vUv);

          // ── Content-aware alpha ─────────────────────────────────────────
          // Derive transparency from the pixel's own luminance so that dark
          // (space-background) pixels become transparent without any
          // hand-drawn mask.  Faint outer halos stay semi-transparent;
          // bright nebula cores become fully opaque.
          float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));

          // smoothstep range: [0.025 → 0.40] covers black background up to
          // moderate nebula brightness.  pow(0.6) biases mid-tones toward
          // opacity so faint halos still read clearly on the dark sky.
          float lumaAlpha = pow(smoothstep(0.025, 0.40, luma), 0.6);

          // ── UV-space vignette (safety net for edge artefacts) ───────────
          // Wider zone (15 %) with a concave pow-curve: the interior stays
          // fully opaque while only the last few percent near each edge fade.
          float d        = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
          float edgeFade = pow(smoothstep(0.0, 0.15, d), 0.5);

          // ── Highlight compression ───────────────────────────────────────
          // Gently roll off the very brightest regions so the core of a
          // nebula doesn't burn out when composited over a lit star field.
          // Pixels at luma ≤ 0.65 are untouched; luma 1.0 is reduced ~18 %.
          float squeeze    = 1.0 / (1.0 + max(0.0, luma - 0.65) * 0.6);
          vec3  rgb        = color.rgb * squeeze;

          // Combine: texture alpha (1 for opaque PNGs), luma mask, edge vignette.
          float alpha = color.a * lumaAlpha * edgeFade * uVisibility;

          if (alpha < 0.005) discard;
          gl_FragColor = vec4(rgb, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest:  true,
      // NormalBlending (standard over-compositing) prevents additive
      // accumulation: nebulae no longer blow out the star field, and two
      // overlapping DSOs composite correctly instead of summing.
      blending: THREE.NormalBlending,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const dsoKey = image.imageUrl.split('/').pop()!.split('.')[0];

    mesh.userData = {
      type: 'dso',
      index: dsoKey,
      corners,
      onTap: () => {
        const catalog = getDsoCatalog();
        const normalizedKey = normalizeKey(dsoKey);
        const parsed = normalizedKey.match(/^(ic|m|n)(\d+)/);
        const prefix = parsed?.[1];
        const numeric = parsed?.[2] ?? '';
        const digits = (v: any) => `${v ?? ''}`.toLowerCase().replace(/\D/g, '');

        const match =
          catalog.find((dso) => {
            if (!numeric) return false;
            if (prefix === 'ic') return digits(dso.ic) === numeric;
            if (prefix === 'm')  return digits(dso.m)  === numeric;
            if (prefix === 'n')  return digits(dso.ngc) === numeric;
            return false;
          }) ??
          catalog.find((dso) =>
            normalizeKey(dso.name) === normalizedKey ||
            normalizeKey(dso.identifiers ?? '').includes(normalizedKey),
          );

        setSelectedObject(match ?? null);
      },
    };

    mesh.renderOrder = RENDER_ORDER.dso;
    group.add(mesh);
  });

  reporter?.({ stepId: 'dso', title: 'Deep-sky objects', detail: `DSO group ready (${total} objects)`, status: 'done' });
  return group;
}
