import * as THREE from 'three';
import { convertHorizontalToEquatorial, GeographicCoordinate } from '@observerly/astrometry';
import { raDecToVec3 } from '../utils/coordinates';
import { hex_colors } from '../../constants';
import { LAYER_NAMES, RENDER_ORDER } from '../utils/renderOrders';

const GRID_RADIUS = 1.4;

// ─── Circle drawing helper ────────────────────────────────────────────────────

function drawCircle(
  radius: THREE.Vector3,
  position: THREE.Vector3,
  rotAxis: THREE.Vector3,
  color: number,
): THREE.Line {
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 });
  const axis = rotAxis.clone().normalize();
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= Math.PI * 2; i += Math.PI / 64) {
    const c = Math.cos(i);
    const s = Math.sin(i);
    const x = axis.x, y = axis.y, z = axis.z;
    const m = [
      [(x)*(1-c)+c,     x*y*(1-c)-z*s, x*z*(1-c)+y*s],
      [x*y*(1-c)+z*s,   (y)*(1-c)+c,   y*z*(1-c)-x*s],
      [x*z*(1-c)-y*s,   y*z*(1-c)+x*s, (z)*(1-c)+c  ],
    ];
    points.push(new THREE.Vector3(
      m[0][0]*radius.x + m[0][1]*radius.y + m[0][2]*radius.z + position.x,
      m[1][0]*radius.x + m[1][1]*radius.y + m[1][2]*radius.z + position.y,
      m[2][0]*radius.x + m[2][1]*radius.y + m[2][2]*radius.z + position.z,
    ));
  }

  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
}

// ─── Equatorial grid (fixed in equatorial frame) ──────────────────────────────

function buildEquatorialGrid(): THREE.Group {
  const group = new THREE.Group();
  const step = Math.PI / 18; // 10° steps

  for (let lat = -Math.PI / 2 + step; lat < Math.PI / 2; lat += step) {
    group.add(drawCircle(
      new THREE.Vector3(GRID_RADIUS * Math.cos(lat), 0, 0),
      new THREE.Vector3(0, 0, GRID_RADIUS * Math.sin(lat)),
      new THREE.Vector3(0, 0, 1),
      hex_colors.blue,
    ));
  }

  for (let lon = -Math.PI / 2; lon < Math.PI / 2; lon += step) {
    group.add(drawCircle(
      new THREE.Vector3(0, 0, GRID_RADIUS),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.cos(lon), Math.sin(lon), 0),
      hex_colors.blue,
    ));
  }

  group.renderOrder = RENDER_ORDER.eqGrid;
  group.name = LAYER_NAMES.eqGrid;
  group.visible = false;
  return group;
}

// ─── Azimuthal grid (aligned to local horizon, updated when time changes) ────

function buildAzimuthalGrid(): THREE.Group {
  const group = new THREE.Group();
  const step = Math.PI / 18; // 10° steps

  for (let alt = -Math.PI / 2 + step; alt < Math.PI / 2; alt += step) {
    group.add(drawCircle(
      new THREE.Vector3(GRID_RADIUS * Math.cos(alt), 0, 0),
      new THREE.Vector3(0, 0, GRID_RADIUS * Math.sin(alt)),
      new THREE.Vector3(0, 0, 1),
      hex_colors.violet,
    ));
  }

  for (let az = -Math.PI / 2; az < Math.PI / 2; az += step) {
    group.add(drawCircle(
      new THREE.Vector3(0, 0, GRID_RADIUS),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.cos(az), Math.sin(az), 0),
      hex_colors.violet,
    ));
  }

  group.renderOrder = RENDER_ORDER.azGrid;
  group.name = LAYER_NAMES.azGrid;
  group.visible = false;
  return group;
}

export function orientAzGridToHorizon(
  azGrid: THREE.Group,
  location: { lat: number; lon: number },
  date: Date,
): void {
  const observer: GeographicCoordinate = { latitude: location.lat, longitude: location.lon };
  const zenithEq = convertHorizontalToEquatorial(date, observer, { alt: 90, az: 0 });
  const northEq  = convertHorizontalToEquatorial(date, observer, { alt: 0,  az: 0 });
  const zenithVec = raDecToVec3(zenithEq.ra, zenithEq.dec, 5);
  const northVec  = raDecToVec3(northEq.ra,  northEq.dec,  5).normalize();

  azGrid.up.copy(northVec);
  azGrid.lookAt(zenithVec);
}

export type GridLayerResult = {
  eqGrid: THREE.Group;
  azGrid: THREE.Group;
};

export function createGridLayer(
  location: { lat: number; lon: number },
  date: Date,
): GridLayerResult {
  const eqGrid = buildEquatorialGrid();
  const azGrid = buildAzimuthalGrid();
  orientAzGridToHorizon(azGrid, location, date);
  return { eqGrid, azGrid };
}
