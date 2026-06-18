import * as THREE from 'three';
import { loadBundledTextureAsync } from './loadBundledTextureAsync';

type CharMetrics = {
  u0: number; v0: number;
  u1: number; v1: number;
  width: number; height: number;
  advance: number;
};
export type FontMetrics = {
  atlas: { width: number; height: number; fontSize: number };
  chars: Record<string, CharMetrics>;
};
export type BitmapFont = { texture: THREE.Texture; metrics: FontMetrics };

let _atlasPromise: Promise<BitmapFont> | null = null;

export function loadBitmapFont(): Promise<BitmapFont> {
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
// ── Typographic constants for this atlas ─────────────────────────────────────
// Derived from font-metrics.json: most caps are 46px, most x-height chars 37px.
const CAP_HEIGHT = 46; // px above baseline for capital letters
const X_HEIGHT   = 37; // px above baseline for x-height lowercase letters
// Centering: put the baseline at -CAP_HEIGHT/2 so caps straddle y=0 symmetrically.
const BASELINE_Y = -(CAP_HEIGHT / 2); // = -23 px (in atlas pixel units)

/**
 * How many pixels this glyph extends BELOW the typographic baseline.
 * Most characters sit entirely above the baseline; descenders dip below.
 */
function glyphDescenderDepth(ch: string, height: number): number {
  // Lowercase letters with descender loops / tails
  if ('gjpqy'.includes(ch))   return Math.max(0, height - X_HEIGHT);
  // 'f' has a slight hook below baseline; 'j' has both dot-above and hook-below
  if (ch === 'f' || ch === 'j') return Math.max(0, height - CAP_HEIGHT);
  // Uppercase Q has a prominent tail
  if (ch === 'Q')               return Math.max(0, height - CAP_HEIGHT);
  return 0;
}

export function buildTextMesh(
  text: string,
  texture: THREE.Texture,
  metrics: FontMetrics,
  options: BitmapTextOptions = {},
): THREE.Mesh {
  const {
    color      = 0xffffff,
    opacity    = 0.85,
    pixelScale = 0.002,
  } = options;

  // Shared material (created before early-return so both paths share the same mat)
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    color,
    transparent: true,
    opacity,
    depthTest:  false,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  // Guard: empty / invalid text → invisible mesh with valid bounding sphere.
  // This prevents "Computed radius is NaN" from an empty positions array.
  if (!text) {
    const g = new THREE.BufferGeometry();
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 0);
    return new THREE.Mesh(g, mat);
  }

  const chars = metrics.chars;
  // Fallback advance for characters not in the atlas (no visible quad, just spacing).
  const spaceAdvance = chars[' ']?.advance ?? 35;

  /**
   * Return the CharMetrics for `ch` only if it is explicitly in the atlas
   * and has fully finite dimensions. Unknown / malformed chars return null so
   * callers can skip them without emitting a quad.
   */
  const getMetrics = (ch: string) => {
    const m = chars[ch];
    if (!m) return null;
    if (!isFinite(m.width) || !isFinite(m.height) || !isFinite(m.advance)) return null;
    return m;
  };

  // ── Pass 1: measure total advance width for horizontal centering ──────────────
  // Only count chars that are actually in the atlas with valid metrics; unknown
  // chars use spaceAdvance so the centering still reflects the rendered width.
  let totalAdvance = 0;
  for (const ch of text) {
    const m = getMetrics(ch);
    totalAdvance += m ? m.advance : spaceAdvance;
  }

  const positions: number[] = [];
  const uvs: number[]       = [];
  const indices: number[]   = [];

  let cursor = -totalAdvance * 0.5 * pixelScale;
  let vi     = 0;

  // ── Pass 2: build baseline-aligned quads ─────────────────────────────────────
  // All non-descender characters share the same y0 (baseline), so letters like
  // 'J' and 'u' sit on the same line even though J is taller.  Descenders (g, p,
  // q, y, f, j, Q) extend below the baseline without pushing other letters up.
  for (const ch of text) {
    const m = getMetrics(ch);

    // Unknown / bad-metric char: advance pen without emitting geometry.
    if (!m) { cursor += spaceAdvance * pixelScale; continue; }

    // Whitespace: advance pen without emitting geometry.
    // (Space sits at atlas origin u0=0,v0=0 and can bleed into adjacent data.)
    if (ch.trim() === '') {
      cursor += m.advance * pixelScale;
      continue;
    }

    const w    = m.width  * pixelScale;
    const h    = m.height * pixelScale;
    const desc = glyphDescenderDepth(ch, m.height) * pixelScale; // below baseline

    const x0 = cursor;
    const x1 = cursor + w;
    // Baseline at BASELINE_Y * pixelScale.
    // Bottom = baseline − descender depth; Top = baseline + (height − descender).
    const y0 = (BASELINE_Y * pixelScale) - desc;
    const y1 = (BASELINE_Y * pixelScale) + (h - desc);

    // Two triangles per character quad (mesh faces +Z)
    positions.push(x0, y0, 0,  x1, y0, 0,  x1, y1, 0,  x0, y1, 0);

    // Atlas UVs: Three.js UV origin is bottom-left; atlas origin is top-left
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

  // Guard: empty buffer OR any NaN/Infinity leaked in → set a safe zero sphere.
  // The isFinite scan is O(n) on a tiny array — negligible cost for correctness.
  const isSafe = positions.length > 0 && positions.every(isFinite);
  if (isSafe) {
    geom.computeBoundingSphere();
  } else {
    geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 0);
  }

  return new THREE.Mesh(geom, mat);
}
