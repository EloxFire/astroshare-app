import * as THREE from 'three';
import * as ExpoTHREE from 'expo-three';
import {convertEquatorialToHorizontal, convertHorizontalToEquatorial} from '@observerly/astrometry';
import {LocationObject} from '../../types/LocationObject';
import {convertSphericalToCartesian} from './utils/convertSphericalToCartesian';
import {meshGroupsNames, planetariumRenderOrders} from './utils/planetariumSettings';
import {Polaris} from '../../constants';

type CardinalLetter = 'N' | 'E' | 'S' | 'W';

const CARDINAL_LABELS: { letter: CardinalLetter; file: any }[] = [
  { letter: 'N', file: require('../../../../assets/images/planetarium/compass/N.png') },
  { letter: 'E', file: require('../../../../assets/images/planetarium/compass/E.png') },
  { letter: 'S', file: require('../../../../assets/images/planetarium/compass/S.png') },
  { letter: 'W', file: require('../../../../assets/images/planetarium/compass/W.png') },
];

const normalizeDegrees = (deg: number) => {
  const wrapped = deg % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
};

const getCardinalAzimuths = (location: LocationObject, date: Date) => {
  const polarisHorizontal = convertEquatorialToHorizontal(
    date,
    { latitude: location.lat, longitude: location.lon },
    { ra: Polaris.ra, dec: Polaris.dec }
  );

  const northAz = Number.isFinite(polarisHorizontal.az) ? normalizeDegrees(polarisHorizontal.az) : 0;

  return {
    N: northAz,
    E: normalizeDegrees(northAz + 90),
    S: normalizeDegrees(northAz + 180),
    W: normalizeDegrees(northAz + 270),
  } as const;
};

const positionCompassLetter = (
  sprite: THREE.Object3D,
  azimuth: number,
  location: LocationObject,
  date: Date,
  radius: number
) => {
  const horizontal = { alt: 0, az: azimuth };
  const equatorial = convertHorizontalToEquatorial(
    date,
    { latitude: location.lat, longitude: location.lon },
    horizontal
  );
  const position = convertSphericalToCartesian(radius, equatorial.ra, equatorial.dec);
  sprite.position.copy(position);
};

export function updateCompassLabels(
  group: THREE.Group | null,
  location: LocationObject,
  date: Date = new Date(),
  radius: number = 0.98
) {
  if (!group) return;

  const azimuths = getCardinalAzimuths(location, date);

  group.children.forEach((child) => {
    const letter = (child.userData?.letter || '') as CardinalLetter;
    const azimuth = azimuths[letter];
    if (azimuth === undefined) return;

    positionCompassLetter(child, azimuth, location, date, radius);
  });
}

export async function createCompassLabels(
  radius: number = 0.98,
  location: LocationObject,
  date: Date = new Date()
): Promise<THREE.Group> {
  const group = new THREE.Group();

  for (const { letter, file } of CARDINAL_LABELS) {
    const texture = await ExpoTHREE.loadAsync(file);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(material);
    sprite.userData.letter = letter;
    sprite.renderOrder = planetariumRenderOrders.labels;
    sprite.scale.set(0.05, 0.05, 0.05);
    group.add(sprite);
  }

  updateCompassLabels(group, location, date, radius);

  group.name = meshGroupsNames.compassLabels;
  return group;
}
