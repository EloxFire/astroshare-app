import * as THREE from 'three';
import { constellationsAsterisms } from '../../scripts/astro/constellationsAsterisms';
import { raDecToVec3 } from '../utils/coordinates';
import { buildTextMesh, BitmapFont } from '../utils/BitmapText';
import { LAYER_NAMES, RENDER_ORDER } from '../utils/renderOrders';

const ASTERISM_RADIUS   = 9.70;
const BOUNDARY_RADIUS   = 9.68;
const LABEL_RADIUS      = 9.65;
// Base size at REF_FOV (75°). tick() applies tan(fov/2) scaling for zoom-invariance.
const LABEL_PIXEL_SCALE = 0.006;
const REF_FOV           = 75;

type Entry = {
  abbr: string;
  name: string;
  data: any;
  vec:  THREE.Vector3; // unit vector toward the centrum, pre-computed
};

// Computed once at module load — avoids rebuilding every frame.
const ENTRIES: Entry[] = (constellationsAsterisms as any[]).reduce(
  (acc: Entry[], c) => {
    const centrum = c?.feature?.features?.[0]?.properties?.centrum;
    if (typeof centrum?.ra !== 'number' || typeof centrum?.dec !== 'number') return acc;
    acc.push({
      abbr: c.abbreviation ?? '',
      name: c.name ?? c.abbreviation ?? '',
      data: c,
      vec:  raDecToVec3(centrum.ra, centrum.dec, 1).normalize(),
    });
    return acc;
  },
  [],
);

// Pure function — safe to call every RAF frame.
export function findFocusedConstellation(lookRa: number, lookDec: number): Entry | null {
  if (ENTRIES.length === 0) return null;
  const lookVec = raDecToVec3(lookRa, lookDec, 1).normalize();
  let best    = ENTRIES[0];
  let bestDot = lookVec.dot(best.vec);
  for (let i = 1; i < ENTRIES.length; i++) {
    const dot = lookVec.dot(ENTRIES[i].vec);
    if (dot > bestDot) { bestDot = dot; best = ENTRIES[i]; }
  }
  return best;
}

export class FocusedConstellationLayer {
  readonly group: THREE.Group;
  private currentAbbr: string | null = null;
  private labelMesh:   THREE.Mesh | null = null;
  private materials:   THREE.Material[] = [];
  private font: BitmapFont;

  constructor(font: BitmapFont) {
    this.font  = font;
    this.group = new THREE.Group();
    this.group.name    = LAYER_NAMES.focusedConstellation;
    this.group.visible = false;
  }

  /**
   * Call every RAF frame while the focused-constellation mode is active.
   * Rotates the label billboard to face the camera and rebuilds geometry
   * only when the most-centred constellation changes.
   */
  tick(lookRa: number, lookDec: number, camera: THREE.PerspectiveCamera): void {
    if (this.labelMesh) {
      this.labelMesh.quaternion.copy(camera.quaternion);
      // Zoom-invariant scaling: shrink the label as the user zooms in
      const fovScale =
        Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) /
        Math.tan(THREE.MathUtils.degToRad(REF_FOV * 0.5));
      this.labelMesh.scale.setScalar(fovScale);
    }

    const closest = findFocusedConstellation(lookRa, lookDec);
    if (!closest || closest.abbr === this.currentAbbr) return;

    this.currentAbbr = closest.abbr;
    this.rebuild(closest, camera);
  }

  /** Reset the current selection so the next tick() always rebuilds. */
  reset(): void {
    this.currentAbbr = null;
  }

  dispose(): void {
    this.disposeContents();
  }

  // ── private ─────────────────────────────────────────────────────────────────

  private disposeContents(): void {
    this.group.children.forEach((child) => {
      if (child instanceof THREE.Line || child instanceof THREE.Mesh) {
        child.geometry.dispose();
      }
    });
    const seen = new Set<THREE.Material>();
    this.materials.forEach((m) => { if (!seen.has(m)) { m.dispose(); seen.add(m); } });
    this.materials = [];
    this.group.clear();
    this.labelMesh = null;
  }

  private rebuild(entry: Entry, camera: THREE.PerspectiveCamera): void {
    this.disposeContents();

    const c       = entry.data;
    const centrum = c?.feature?.features?.[0]?.properties?.centrum;

    // ── Asterism lines ──────────────────────────────────────────────────────
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
    });
    this.materials.push(lineMat);

    // The GeoJSON coordinate nesting can vary (LineString vs MultiLineString).
    // We treat each element of `coordinates` as a segment with at least 2 points.
    // Each point must be a [number, number] array — numbers at this level mean the
    // format is LineString (single line), not MultiLineString (array of lines).
    const rawCoords: unknown[] =
      c?.feature?.features?.[0]?.geometry?.coordinates ?? [];

    rawCoords.forEach((seg) => {
      if (!Array.isArray(seg) || seg.length < 2) return;

      const p0 = seg[0];
      const p1 = seg[1];

      // Each point must be an array with two finite numbers.
      if (!Array.isArray(p0) || !Array.isArray(p1)) return;
      const [ra0, dec0] = p0 as number[];
      const [ra1, dec1] = p1 as number[];
      if (!isFinite(ra0) || !isFinite(dec0) || !isFinite(ra1) || !isFinite(dec1)) return;

      const v0 = raDecToVec3(ra0, dec0, ASTERISM_RADIUS);
      const v1 = raDecToVec3(ra1, dec1, ASTERISM_RADIUS);
      // Guard against raDecToVec3 producing NaN for edge-case coordinates.
      if (!isFinite(v0.x) || !isFinite(v0.y) || !isFinite(v0.z)) return;
      if (!isFinite(v1.x) || !isFinite(v1.y) || !isFinite(v1.z)) return;

      const geom = new THREE.BufferGeometry().setFromPoints([v0, v1]);
      // Pre-compute bounding sphere now (synchronous) so THREE.js never does it
      // lazily at render time on an unvalidated buffer.
      geom.computeBoundingSphere();

      const line = new THREE.Line(geom, lineMat);
      line.renderOrder = RENDER_ORDER.constellations;
      this.group.add(line);
    });

    // ── Boundary (dashed) ───────────────────────────────────────────────────
    const rawRing: unknown[] =
      c?.feature?.features?.[1]?.geometry?.coordinates?.[0] ?? [];

    // Filter to valid [ra, dec] pairs only — any malformed entry is dropped.
    const pts = (rawRing as any[])
      .filter((pt) => Array.isArray(pt) && isFinite(pt[0]) && isFinite(pt[1]))
      .map(([ra, dec]: number[]) => raDecToVec3(ra, dec, BOUNDARY_RADIUS))
      .filter((v) => isFinite(v.x) && isFinite(v.y) && isFinite(v.z));

    if (pts.length > 1) {
      const dashedMat = new THREE.LineDashedMaterial({
        color:       0xffffff,
        transparent: true,
        opacity:     0.35,
        dashSize:    0.12,
        gapSize:     0.07,
      });
      this.materials.push(dashedMat);

      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      // Pre-compute bounding sphere (same reason as above).
      geom.computeBoundingSphere();

      const line = new THREE.Line(geom, dashedMat);
      line.computeLineDistances(); // required for LineDashedMaterial
      line.renderOrder = RENDER_ORDER.focusedBoundary;
      this.group.add(line);
    }

    // ── Name label ──────────────────────────────────────────────────────────
    if (centrum) {
      const mesh = buildTextMesh(entry.name, this.font.texture, this.font.metrics, {
        opacity:    1.0,
        pixelScale: LABEL_PIXEL_SCALE,
      });
      mesh.position.copy(raDecToVec3(centrum.ra, centrum.dec, LABEL_RADIUS));
      mesh.quaternion.copy(camera.quaternion);
      mesh.renderOrder = RENDER_ORDER.labels;
      this.group.add(mesh);
      this.labelMesh = mesh;
    }
  }
}
