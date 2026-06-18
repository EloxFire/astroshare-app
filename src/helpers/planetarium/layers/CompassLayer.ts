import * as THREE from 'three';
import { convertEquatorialToHorizontal, convertHorizontalToEquatorial } from '@observerly/astrometry';
import { Polaris } from '../../constants';
import { LocationObject } from '../../types/LocationObject';
import { raDecToVec3 } from '../utils/coordinates';
import { loadBundledTextureAsync } from '../utils/loadBundledTextureAsync';
import { LAYER_NAMES, RENDER_ORDER } from '../utils/renderOrders';
import { PlanetariumLoadingReporter } from '../utils/loadingReporter';

type Cardinal = 'N' | 'E' | 'S' | 'W';

const CARDINALS: { letter: Cardinal; file: any }[] = [
  { letter: 'N', file: require('../../../../assets/images/planetarium/compass/N.png') },
  { letter: 'E', file: require('../../../../assets/images/planetarium/compass/E.png') },
  { letter: 'S', file: require('../../../../assets/images/planetarium/compass/S.png') },
  { letter: 'W', file: require('../../../../assets/images/planetarium/compass/W.png') },
];

function wrapDeg(deg: number): number {
  const w = deg % 360;
  return w < 0 ? w + 360 : w;
}

function getCardinalAzimuths(location: LocationObject, date: Date): Record<Cardinal, number> {
  const hz = convertEquatorialToHorizontal(
    date,
    { latitude: location.lat, longitude: location.lon },
    { ra: Polaris.ra, dec: Polaris.dec },
  );
  const northAz = Number.isFinite(hz.az) ? wrapDeg(hz.az) : 0;
  return {
    N: northAz,
    E: wrapDeg(northAz + 90),
    S: wrapDeg(northAz + 180),
    W: wrapDeg(northAz + 270),
  };
}

export function updateCompassLabels(
  group: THREE.Group,
  location: LocationObject,
  date: Date,
  radius = 0.98,
): void {
  const azimuths = getCardinalAzimuths(location, date);
  const observer = { latitude: location.lat, longitude: location.lon };

  group.children.forEach((child) => {
    const letter = child.userData?.letter as Cardinal | undefined;
    const az = letter ? azimuths[letter] : undefined;
    if (az === undefined) return;

    const eq = convertHorizontalToEquatorial(date, observer, { alt: 0, az });
    child.position.copy(raDecToVec3(eq.ra, eq.dec, radius));
  });
}

export async function createCompassLayer(
  location: LocationObject,
  date: Date,
  radius = 0.98,
  reporter?: PlanetariumLoadingReporter,
): Promise<THREE.Group> {
  const group = new THREE.Group();
  group.name = LAYER_NAMES.compassLabels;

  reporter?.({ stepId: 'compass', title: 'Compass labels', detail: 'Loading cardinal sprites', status: 'active' });

  for (const { letter, file } of CARDINALS) {
    reporter?.({ stepId: 'compass', title: 'Compass labels', detail: `Loading ${letter}`, status: 'active' });
    const texture = await loadBundledTextureAsync(file);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    }));
    sprite.userData.letter = letter;
    sprite.renderOrder = RENDER_ORDER.labels;
    sprite.scale.set(0.05, 0.05, 0.05);
    group.add(sprite);
  }

  updateCompassLabels(group, location, date, radius);

  reporter?.({ stepId: 'compass', title: 'Compass labels', detail: 'Compass labels ready', status: 'done' });
  return group;
}
