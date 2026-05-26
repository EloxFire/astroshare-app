import * as THREE from 'three';
import { loadBundledTextureAsync } from './loadBundledTextureAsync';

type CharMetrics = {
  u0: number; v0: number;
  u1: number; v1: number;
  width: number; height: number;
  advance: number;
};
type FontMetrics = {
  atlas: { width: number; height: number; fontSize: number };
  chars: Record<string, CharMetrics>;
};

let _atlasPromise: Promise<{ texture: THREE.Texture; metrics: FontMetrics }> | null = null;

export function loadBitmapFont(): Promise<{ texture: THREE.Texture; metrics: FontMetrics }> {
  if (_atlasPromise) return _atlasPromise;
  _atlasPromise = (async () => {
    const metricsModule = require('../../../../assets/data/font-metrics.json');
    const metrics: FontMetrics = metricsModule;

    const texture = await loadBundledTextureAsync(
      require('../../../../assets/images/textures/font-atlas.png'),
    );
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    return { texture, metrics };
  })();
  return _atlasPromise;
}

export type BitmapTextOptions = {
  color?: THREE.ColorRepresentation;
  opacity?: number;
  pixelScale?: number;
};

/**
 * Build a THREE.Mesh that renders `text` using the pre-generated bitmap font atlas.
 *
 * The mesh origin is the horizontal center / vertical center of the text.
 * Scale it like a sprite: set .scale and call .lookAt(camera.position) each frame.
 *
 * pixelScale maps atlas pixels → Three.js world units. Default: 0.002
 * (so a 48-px-tall font renders as 0.096 world units tall at scale 1).
 */
export function buildTextMesh(
  text: string,
  texture: THREE.Texture,
  metrics: FontMetrics,
  options: BitmapTextOptions = {},
): THREE.Mesh {
  const {
    color   = 0xffffff,
    opacity = 0.85,
    pixelScale = 0.002,
  } = options;

  const chars = metrics.chars;
  const fallback = chars[' '];

  // Measure total advance width & max height for centering
  let totalAdvance = 0;
  let maxH = 0;
  for (const ch of text) {
    const m = chars[ch] ?? fallback;
    if (!m) continue;
    totalAdvance += m.advance;
    if (m.height > maxH) maxH = m.height;
  }

  const positions: number[] = [];
  const uvs: number[]       = [];
  const indices: number[]   = [];

  let cursor = -totalAdvance * 0.5 * pixelScale;
  let vi = 0;

  for (const ch of text) {
    const m = chars[ch] ?? fallback;
    if (!m) continue;

    const w = m.width  * pixelScale;
    const h = m.height * pixelScale;
    const halfH = maxH * 0.5 * pixelScale;

    const x0 = cursor;
    const x1 = cursor + w;
    const y0 = -halfH;
    const y1 = -halfH + h;

    // Two triangles per character quad (z = 0, mesh faces +Z)
    positions.push(x0, y0, 0,  x1, y0, 0,  x1, y1, 0,  x0, y1, 0);

    // Atlas UVs — Three.js UV origin is bottom-left, atlas origin is top-left
    const { u0, v0, u1, v1 } = m;
    uvs.push(u0, 1 - v1,   u1, 1 - v1,   u1, 1 - v0,   u0, 1 - v0);

    indices.push(vi, vi + 1, vi + 2,  vi, vi + 2, vi + 3);
    vi += 4;

    cursor += m.advance * pixelScale;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeBoundingSphere();

  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    color,
    transparent: true,
    opacity,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  return new THREE.Mesh(geom, mat);
}
