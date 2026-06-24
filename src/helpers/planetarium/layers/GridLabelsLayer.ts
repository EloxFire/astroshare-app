import * as THREE from 'three';
import { convertEquatorialToHorizontal } from '@observerly/astrometry';
import { BitmapFont, buildTextMesh } from '../utils/BitmapText';
import { vec3ToRaDec } from '../utils/coordinates';
import { RENDER_ORDER } from '../utils/renderOrders';

// Must match GridLayer.ts
const GRID_RADIUS  = 1.4;
// Labels sit slightly inside the grid sphere so they don't z-fight the lines.
const LABEL_RADIUS = 1.35;
// Size tuned to roughly half of star labels (STAR ratio = 0.004/9.72 ≈ 0.000412)
const PIXEL_SCALE  = 0.00056;
// Points per circle; 64 = 5.6° per step — fine enough for 10° grid lines
const SAMPLE_N     = 64;
const TWO_PI       = Math.PI * 2;
const REF_FOV      = 75;
// Margin from the screen edge expressed as a fraction of the NDC half-extent.
// This is resolution-independent (works identically on 1x and 2x Retina screens).
// 0.08 ≈ 8% of the half-screen width/height → label centre sits far enough from
// the edge that even the widest labels ("0h40m", ~5 chars) are fully visible.
const EDGE_MARGIN_NDC = 0.08;

type Observer = { latitude: number; longitude: number };

function fovLabelScale(camera: THREE.PerspectiveCamera): number {
  return (
    Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) /
    Math.tan(THREE.MathUtils.degToRad(REF_FOV * 0.5))
  );
}

// Font atlas only has ASCII (no '°'). Use signed integers for Dec/Alt, h/m for RA.
function formatRA(degrees: number): string {
  const totalMin = Math.round(((degrees % 360 + 360) % 360) / 360 * 24 * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (m === 0) return `${h}h`;
  return `${h}h${m}m`;
}

function makeLabelMesh(text: string, font: BitmapFont, color: number): THREE.Mesh {
  const mesh = buildTextMesh(text, font.texture, font.metrics, {
    color,
    opacity: 0.9,
    pixelScale: PIXEL_SCALE,
  });
  mesh.renderOrder = RENDER_ORDER.labels;
  mesh.visible = false;
  return mesh;
}

function showMesh(mesh: THREE.Mesh, pos: THREE.Vector3, q: THREE.Quaternion, scale: number): void {
  mesh.visible = true;
  mesh.position.copy(pos);
  mesh.quaternion.copy(q);
  mesh.scale.setScalar(scale);
}

export class GridLabelsLayer {
  readonly eqLabelsGroup: THREE.Group;
  readonly azLabelsGroup: THREE.Group;

  // Dec parallels: 17 values (-80..+80 step 10), each can cross 2 screen edges → 2 slots
  private readonly decMeshes = new Map<number, [THREE.Mesh, THREE.Mesh]>();
  // RA meridians: 36 unique RA values (0..350 step 10), 1 slot each
  private readonly raMeshes  = new Map<number, THREE.Mesh>();
  // Alt parallels: same as Dec
  private readonly altMeshes = new Map<number, [THREE.Mesh, THREE.Mesh]>();
  // Az meridians: 36 unique Az values (0..350 step 10), 1 slot each
  private readonly azMeshes  = new Map<number, THREE.Mesh>();

  // ── Pre-allocated work buffers — zero heap allocations in the hot path ────────
  private readonly _pts        = Array.from({ length: SAMPLE_N }, () => new THREE.Vector3());
  private readonly _ndcPrev    = new THREE.Vector3();
  private readonly _ndcCurr    = new THREE.Vector3();
  private readonly _unprojectBuf = new THREE.Vector3();
  private readonly _crossBuf   = [new THREE.Vector3(), new THREE.Vector3()] as const;

  constructor(font: BitmapFont) {
    const eqColor = 0x9999ff; // light blue  – equatorial grid
    const azColor = 0xdd99ff; // light violet – azimuthal grid

    this.eqLabelsGroup = new THREE.Group();
    this.eqLabelsGroup.name = 'eqGridLabels';
    this.eqLabelsGroup.visible = false;

    this.azLabelsGroup = new THREE.Group();
    this.azLabelsGroup.name = 'azGridLabels';
    this.azLabelsGroup.visible = false;

    for (let dec = -80; dec <= 80; dec += 10) {
      const label = dec === 0 ? '0' : `${dec > 0 ? '+' : ''}${dec}`;
      const a = makeLabelMesh(label, font, eqColor);
      const b = makeLabelMesh(label, font, eqColor);
      this.decMeshes.set(dec, [a, b]);
      this.eqLabelsGroup.add(a, b);
    }

    for (let ra = 0; ra < 360; ra += 10) {
      const m = makeLabelMesh(formatRA(ra), font, eqColor);
      this.raMeshes.set(ra, m);
      this.eqLabelsGroup.add(m);
    }

    for (let alt = -80; alt <= 80; alt += 10) {
      const label = alt === 0 ? '0' : `${alt > 0 ? '+' : ''}${alt}`;
      const a = makeLabelMesh(label, font, azColor);
      const b = makeLabelMesh(label, font, azColor);
      this.altMeshes.set(alt, [a, b]);
      this.azLabelsGroup.add(a, b);
    }

    for (let az = 0; az < 360; az += 10) {
      const m = makeLabelMesh(`${az}`, font, azColor);
      this.azMeshes.set(az, m);
      this.azLabelsGroup.add(m);
    }
  }

  // ─── Per-frame update ───────────────────────────────────────────────────────

  update(
    camera: THREE.PerspectiveCamera,
    eqVisible: boolean,
    azVisible: boolean,
    azGrid: THREE.Group,
    observer: Observer | null,
    date: Date,
    zenithVec: THREE.Vector3 | null,
    groundVisible: boolean,
  ): void {
    this.eqLabelsGroup.visible = eqVisible;
    this.azLabelsGroup.visible = azVisible;

    // Hide all first
    this.decMeshes.forEach(([a, b]) => { a.visible = false; b.visible = false; });
    this.raMeshes.forEach(m => { m.visible = false; });
    this.altMeshes.forEach(([a, b]) => { a.visible = false; b.visible = false; });
    this.azMeshes.forEach(m => { m.visible = false; });

    if (!eqVisible && !azVisible) return;

    const scale     = fovLabelScale(camera);
    const q         = camera.quaternion;
    const step      = Math.PI / 18; // 10° grid step in radians
    const marginX   = EDGE_MARGIN_NDC;
    const marginY   = EDGE_MARGIN_NDC;

    if (eqVisible) {
      // Dec parallels
      for (let dec = -80; dec <= 80; dec += 10) {
        this._fillDecCircle(dec);
        const n = this._findEdgeCrossings(camera, marginX, marginY);
        const [a, b] = this.decMeshes.get(dec)!;
        if (n > 0 && this._aboveHorizon(0, zenithVec, groundVisible))
          showMesh(a, this._crossBuf[0], q, scale);
        if (n > 1 && this._aboveHorizon(1, zenithVec, groundVisible))
          showMesh(b, this._crossBuf[1], q, scale);
      }

      // RA meridians (18 great circles covering all 36 RA values)
      for (let lon = -Math.PI / 2; lon < Math.PI / 2; lon += step) {
        this._fillRaMeridian(lon);
        const n = this._findEdgeCrossings(camera, marginX, marginY);
        for (let k = 0; k < n; k++) {
          if (!this._aboveHorizon(k, zenithVec, groundVisible)) continue;
          const { ra } = vec3ToRaDec(this._crossBuf[k]);
          const raKey = (Math.round(((ra % 360) + 360) % 360 / 10) * 10) % 360;
          const m = this.raMeshes.get(raKey);
          if (m && !m.visible) showMesh(m, this._crossBuf[k], q, scale);
        }
      }
    }

    if (azVisible && observer) {
      // Az meridians need the grid's world matrix to be current
      azGrid.updateWorldMatrix(true, false);

      // Alt parallels
      for (let alt = -80; alt <= 80; alt += 10) {
        this._fillAltCircle(alt, azGrid);
        const n = this._findEdgeCrossings(camera, marginX, marginY);
        const [a, b] = this.altMeshes.get(alt)!;
        if (n > 0 && this._aboveHorizon(0, zenithVec, groundVisible))
          showMesh(a, this._crossBuf[0], q, scale);
        if (n > 1 && this._aboveHorizon(1, zenithVec, groundVisible))
          showMesh(b, this._crossBuf[1], q, scale);
      }

      // Az meridians (18 great circles)
      for (let lon = -Math.PI / 2; lon < Math.PI / 2; lon += step) {
        this._fillAzMeridian(lon, azGrid);
        const n = this._findEdgeCrossings(camera, marginX, marginY);
        for (let k = 0; k < n; k++) {
          if (!this._aboveHorizon(k, zenithVec, groundVisible)) continue;
          const { ra, dec } = vec3ToRaDec(this._crossBuf[k]);
          const horiz = convertEquatorialToHorizontal(date, observer, { ra, dec });
          if (!isFinite(horiz.az)) continue;
          const azKey = (Math.round(((horiz.az % 360) + 360) % 360 / 10) * 10) % 360;
          const m = this.azMeshes.get(azKey);
          if (m && !m.visible) showMesh(m, this._crossBuf[k], q, scale);
        }
      }
    }
  }

  // ─── Horizon cull ───────────────────────────────────────────────────────────

  private _aboveHorizon(
    crossBufIdx: number,
    zenithVec: THREE.Vector3 | null,
    groundVisible: boolean,
  ): boolean {
    if (!groundVisible || !zenithVec) return true;
    // crossBuf has length LABEL_RADIUS; dot with unit zenith gives LABEL_RADIUS * cos(angle).
    // Negative → below horizon.
    return this._crossBuf[crossBufIdx].dot(zenithVec) >= 0;
  }

  // ─── Circle samplers (write into _pts, zero allocations) ───────────────────

  private _fillDecCircle(dec: number): void {
    const dec_rad = dec * Math.PI / 180;
    const cosDec = Math.cos(dec_rad), sinDec = Math.sin(dec_rad);
    for (let i = 0; i < SAMPLE_N; i++) {
      const ra_rad = (i / SAMPLE_N) * TWO_PI;
      this._pts[i].set(
        GRID_RADIUS * Math.cos(ra_rad) * cosDec,
        GRID_RADIUS * Math.sin(ra_rad) * cosDec,
        GRID_RADIUS * sinDec,
      );
    }
  }

  // Rodrigues rotation of (0, 0, GRID_RADIUS) around (cos(lon), sin(lon), 0).
  // Simplified for kz=0: x = ky*sin(t)*R, y = -kx*sin(t)*R, z = cos(t)*R
  private _fillRaMeridian(lonRad: number): void {
    const kx = Math.cos(lonRad), ky = Math.sin(lonRad);
    for (let i = 0; i < SAMPLE_N; i++) {
      const t = (i / SAMPLE_N) * TWO_PI;
      const s = Math.sin(t), c = Math.cos(t);
      this._pts[i].set(ky * s * GRID_RADIUS, -kx * s * GRID_RADIUS, c * GRID_RADIUS);
    }
  }

  private _fillAltCircle(alt: number, azGrid: THREE.Group): void {
    const alt_rad = alt * Math.PI / 180;
    const cosA = Math.cos(alt_rad), sinA = Math.sin(alt_rad);
    for (let i = 0; i < SAMPLE_N; i++) {
      const theta = (i / SAMPLE_N) * TWO_PI;
      this._pts[i].set(
        GRID_RADIUS * cosA * Math.cos(theta),
        GRID_RADIUS * cosA * Math.sin(theta),
        GRID_RADIUS * sinA,
      );
      azGrid.localToWorld(this._pts[i]); // modifies in-place, no allocation
    }
  }

  private _fillAzMeridian(lonRad: number, azGrid: THREE.Group): void {
    const kx = Math.cos(lonRad), ky = Math.sin(lonRad);
    for (let i = 0; i < SAMPLE_N; i++) {
      const t = (i / SAMPLE_N) * TWO_PI;
      const s = Math.sin(t), c = Math.cos(t);
      this._pts[i].set(ky * s * GRID_RADIUS, -kx * s * GRID_RADIUS, c * GRID_RADIUS);
      azGrid.localToWorld(this._pts[i]);
    }
  }

  // ─── Edge-crossing finder ───────────────────────────────────────────────────

  /**
   * Detects where _pts[] transitions between inside and outside the screen frustum.
   * For each crossing, interpolates in NDC space to the exact boundary, then insets
   * by EDGE_MARGIN_PX and unprojects back to a world-space label position in _crossBuf.
   *
   * Returns the number of crossings found (0, 1 or 2).
   */
  private _findEdgeCrossings(
    camera: THREE.PerspectiveCamera,
    marginNdcX: number,
    marginNdcY: number,
  ): number {
    const N = SAMPLE_N;
    let count = 0;

    // Seed with the last point so wrap-around crossings (pts[N-1] → pts[0]) are detected.
    this._ndcPrev.copy(this._pts[N - 1]).project(camera);
    let prevBehind = this._ndcPrev.z >= 1;
    let prevIn     = !prevBehind && Math.abs(this._ndcPrev.x) <= 1 && Math.abs(this._ndcPrev.y) <= 1;

    for (let i = 0; i < N && count < 2; i++) {
      this._ndcCurr.copy(this._pts[i]).project(camera);
      const currBehind = this._ndcCurr.z >= 1;
      const currIn     = !currBehind && Math.abs(this._ndcCurr.x) <= 1 && Math.abs(this._ndcCurr.y) <= 1;

      if (!prevBehind && !currBehind && prevIn !== currIn) {
        // ndcA = inside side, ndcB = outside side
        const ndcAx = prevIn ? this._ndcPrev.x : this._ndcCurr.x;
        const ndcAy = prevIn ? this._ndcPrev.y : this._ndcCurr.y;
        const ndcBx = prevIn ? this._ndcCurr.x : this._ndcPrev.x;
        const ndcBy = prevIn ? this._ndcCurr.y : this._ndcPrev.y;

        // Linearly interpolate in NDC to find the fraction t where the segment
        // crosses the screen boundary (the rectangle |x|=1 or |y|=1).
        const dx = ndcBx - ndcAx;
        const dy = ndcBy - ndcAy;
        let t: number;
        if (Math.abs(dx) >= Math.abs(dy)) {
          // Segment crosses a vertical edge (left x=-1 or right x=+1)
          const edge = ndcBx > ndcAx ? 1.0 : -1.0;
          t = dx !== 0 ? (edge - ndcAx) / dx : 0.5;
        } else {
          // Segment crosses a horizontal edge (top y=+1 or bottom y=-1)
          const edge = ndcBy > ndcAy ? 1.0 : -1.0;
          t = dy !== 0 ? (edge - ndcAy) / dy : 0.5;
        }
        t = Math.max(0, Math.min(1, t));

        // Exact crossing NDC position
        const cx = ndcAx + t * dx;
        const cy = ndcAy + t * dy;

        // Inset EDGE_MARGIN_PX from whichever edge was crossed, slide the label
        // along the OTHER axis to follow the grid line through the crossing.
        let finalX: number, finalY: number;
        if (Math.abs(dx) >= Math.abs(dy)) {
          // Vertical edge: pin x at margin, let y slide freely with the grid line
          finalX = Math.sign(cx) * (1 - marginNdcX);
          finalY = Math.max(-(1 - marginNdcY), Math.min(1 - marginNdcY, cy));
        } else {
          // Horizontal edge: pin y at margin, let x slide freely
          finalX = Math.max(-(1 - marginNdcX), Math.min(1 - marginNdcX, cx));
          finalY = Math.sign(cy) * (1 - marginNdcY);
        }

        // Unproject NDC → world direction, then place at LABEL_RADIUS.
        // z=0.5 gives a point inside the frustum; normalize() strips depth.
        // Camera is at origin, so direction = normalize(unproject(ndc)).
        this._unprojectBuf.set(finalX, finalY, 0.5).unproject(camera);
        this._crossBuf[count].copy(this._unprojectBuf).normalize().multiplyScalar(LABEL_RADIUS);
        count++;
      }

      prevBehind = currBehind;
      prevIn     = currIn;
      // Advance prev NDC buffer for next iteration (in-place copy, no allocation)
      this._ndcPrev.copy(this._ndcCurr);
    }

    return count;
  }
}
