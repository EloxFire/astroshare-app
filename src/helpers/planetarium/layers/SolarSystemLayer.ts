import * as THREE from 'three';
import * as ExpoTHREE from 'expo-three';
import {
  convertEquatorialToHorizontal,
  EquatorialCoordinate,
  GeographicCoordinate,
  getLunarEquatorialCoordinate,
  getLunarPhase,
  getPlanetaryPositions,
  HorizontalCoordinate,
} from '@observerly/astrometry';
import { Dayjs } from 'dayjs';
import { GlobalPlanet } from '../../types/GlobalPlanet';
import { ComputedSunInfos } from '../../types/objects/ComputedSunInfos';
import { getSunData } from '../../scripts/astro/solar/sunData';
import { raDecToVec3 } from '../utils/coordinates';
import { planetTextures } from '../../constants';
import { moonIcons } from '../../scripts/loadImages';
import { LAYER_NAMES, RENDER_ORDER } from '../utils/renderOrders';
import { PlanetariumLoadingReporter } from '../utils/loadingReporter';

export type MoonDetails = EquatorialCoordinate & HorizontalCoordinate & { phase: string; currentIconUrl?: string };

export type SolarSystemSnapshot = {
  planets: GlobalPlanet[];
  moon: MoonDetails;
  sunData: ComputedSunInfos;
};

type SetObjectFn = (obj: any) => void;

// ─── Planets ─────────────────────────────────────────────────────────────────

function createPlanetMeshes(
  planets: GlobalPlanet[],
  setSelectedObject: SetObjectFn,
): THREE.Group {
  const group = new THREE.Group();
  group.name = LAYER_NAMES.planets;

  planets.forEach((planet) => {
    const pos = raDecToVec3(planet.ra, planet.dec, 9.9);
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const texture = new ExpoTHREE.TextureLoader().load(planetTextures[planet.name.toUpperCase()]);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(pos);
    mesh.name = planet.name;
    mesh.geometry.computeBoundingSphere();
    if (mesh.geometry.boundingSphere) {
      mesh.geometry.boundingSphere.radius *= 2; // increase tap tolerance
    }
    mesh.userData = {
      type: 'planet',
      index: planet.name,
      onTap: () => setSelectedObject(planet),
    };
    mesh.renderOrder = RENDER_ORDER.planets;
    group.add(mesh);
  });

  return group;
}

// ─── Moon ────────────────────────────────────────────────────────────────────

function createMoonMesh(
  moon: MoonDetails,
  setSelectedObject: SetObjectFn,
): THREE.Mesh {
  const pos = raDecToVec3(moon.ra, moon.dec, 9.8);
  const geometry = new THREE.SphereGeometry(0.12, 32, 32);
  const moonTexture = new ExpoTHREE.TextureLoader().load(planetTextures.MOON);
  const moonNormal  = new ExpoTHREE.TextureLoader().load(planetTextures.MOON_NORMAL);
  const material = new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: moonNormal });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(pos);
  mesh.renderOrder = RENDER_ORDER.moon;
  mesh.name = LAYER_NAMES.moon;
  mesh.userData = {
    type: 'moon',
    onTap: () => setSelectedObject({
      family: 'Moon',
      name: 'Moon',
      ra: moon.ra,
      dec: moon.dec,
      icon: moon.currentIconUrl ? { uri: moon.currentIconUrl } : (moonIcons[moon.phase] ?? moonIcons['Full']),
      phase: moon.phase,
    }),
  };
  return mesh;
}

// ─── Sun ─────────────────────────────────────────────────────────────────────

function createSunMesh(
  sunData: ComputedSunInfos,
  setSelectedObject: SetObjectFn,
): THREE.Mesh {
  const pos = raDecToVec3(sunData.base.ra, sunData.base.dec, 9.6);
  const geometry = new THREE.SphereGeometry(0.14, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffd27f });
  const sunMesh = new THREE.Mesh(geometry, material);
  sunMesh.position.copy(pos);
  sunMesh.name = LAYER_NAMES.sun;
  sunMesh.renderOrder = RENDER_ORDER.planets - 1;

  // Altitude-aware glow
  const alt = sunData.base.alt ?? 0;
  const altFactor = THREE.MathUtils.clamp((alt + 6) / 55, 0, 1);
  const glowScale = THREE.MathUtils.lerp(4.2, 1.2, altFactor);
  const glowColor = new THREE.Color(0xf6b86a).lerp(new THREE.Color(0xfff4c1), altFactor);

  const glowMat = new THREE.ShaderMaterial({
    uniforms: {
      uColor:    { value: glowColor },
      uStrength: { value: THREE.MathUtils.lerp(2.2, 0.9, altFactor) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: `
      precision mediump float;
      varying vec2 vUv;
      uniform vec3 uColor;
      uniform float uStrength;
      void main() {
        vec2 d = vUv - 0.5;
        float r = length(d) * 2.0;
        float alpha = pow(1.0 - clamp(r, 0.0, 1.0), 1.6) * 1.15 * uStrength;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowMat);
  glow.renderOrder = RENDER_ORDER.planets - 1.5;
  glow.scale.setScalar(glowScale);
  glow.onBeforeRender = (_r, _s, camera) => { glow.quaternion.copy(camera.quaternion); };
  sunMesh.add(glow);

  sunMesh.userData = {
    type: 'sun',
    onTap: () => setSelectedObject({
      family: 'Sun',
      name: sunData.base.name,
      ra: sunData.base.ra,
      dec: sunData.base.dec,
      icon: sunData.base.icon,
      v_mag: -26,
    }),
  };

  return sunMesh;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export class SolarSystemLayer {
  readonly planetsGroup: THREE.Group;
  readonly moonMesh: THREE.Mesh;
  readonly sunMesh: THREE.Mesh;

  private setSelectedObject: SetObjectFn;

  constructor(
    snapshot: SolarSystemSnapshot,
    setSelectedObject: SetObjectFn,
    reporter?: PlanetariumLoadingReporter,
  ) {
    this.setSelectedObject = setSelectedObject;

    reporter?.({ stepId: 'planets', title: 'Planets', detail: 'Creating planet meshes', status: 'active' });
    this.planetsGroup = createPlanetMeshes(snapshot.planets, setSelectedObject);
    reporter?.({ stepId: 'planets', title: 'Planets', detail: 'Planet meshes ready', status: 'done' });

    reporter?.({ stepId: 'moon', title: 'Moon', detail: `Creating moon mesh (${snapshot.moon.phase})`, status: 'active' });
    this.moonMesh = createMoonMesh(snapshot.moon, setSelectedObject);
    reporter?.({ stepId: 'moon', title: 'Moon', detail: 'Moon mesh ready', status: 'done' });

    reporter?.({ stepId: 'sun', title: 'Sun', detail: 'Creating sun mesh', status: 'active' });
    this.sunMesh = createSunMesh(snapshot.sunData, setSelectedObject);
    reporter?.({ stepId: 'sun', title: 'Sun', detail: 'Sun mesh ready', status: 'done' });
  }

  update(
    date: Dayjs,
    observer: GeographicCoordinate,
    currentMoonIconUrl?: string,
  ): SolarSystemSnapshot {
    const dateObj = date.toDate();
    const planets = getPlanetaryPositions(dateObj, observer);
    const moonEq  = getLunarEquatorialCoordinate(dateObj);
    const moonHz  = convertEquatorialToHorizontal(dateObj, observer, { ra: moonEq.ra, dec: moonEq.dec });
    const phase   = getLunarPhase(dateObj);
    const sunData = getSunData(date, observer);

    const moon: MoonDetails = {
      ra: moonEq.ra,
      dec: moonEq.dec,
      alt: moonHz.alt,
      az: moonHz.az,
      phase,
      currentIconUrl: currentMoonIconUrl,
    };

    // Reposition planets
    this.planetsGroup.children.forEach((child) => {
      const pd = planets.find((p) => p.name === child.name);
      if (!pd) return;
      child.position.copy(raDecToVec3(pd.ra, pd.dec, 9.9));
      child.userData.onTap = () => this.setSelectedObject(pd);
    });

    // Reposition moon
    this.moonMesh.position.copy(raDecToVec3(moon.ra, moon.dec, 9.8));
    this.moonMesh.userData.onTap = () => this.setSelectedObject({
      family: 'Moon',
      name: 'Moon',
      ra: moon.ra,
      dec: moon.dec,
      icon: moon.currentIconUrl ? { uri: moon.currentIconUrl } : (moonIcons[moon.phase] ?? moonIcons['Full']),
      phase: moon.phase,
    });

    // Reposition sun
    this.sunMesh.position.copy(raDecToVec3(sunData.base.ra, sunData.base.dec, 9.6));
    this.sunMesh.userData.onTap = () => this.setSelectedObject({
      family: 'Sun',
      name: sunData.base.name,
      ra: sunData.base.ra,
      dec: sunData.base.dec,
      icon: sunData.base.icon,
      v_mag: -26,
    });

    return { planets, moon, sunData };
  }

  addToScene(scene: THREE.Scene): void {
    scene.add(this.planetsGroup, this.moonMesh, this.sunMesh);
  }
}

export async function computeSolarSystemSnapshot(
  date: Dayjs,
  observer: GeographicCoordinate,
  currentMoonIconUrl?: string,
): Promise<SolarSystemSnapshot> {
  const dateObj = date.toDate();
  const planets = getPlanetaryPositions(dateObj, observer);
  const moonEq  = getLunarEquatorialCoordinate(dateObj);
  const moonHz  = convertEquatorialToHorizontal(dateObj, observer, { ra: moonEq.ra, dec: moonEq.dec });
  const phase   = getLunarPhase(dateObj);

  return {
    planets,
    moon: {
      ra: moonEq.ra,
      dec: moonEq.dec,
      alt: moonHz.alt,
      az: moonHz.az,
      phase,
      currentIconUrl: currentMoonIconUrl,
    },
    sunData: getSunData(date, observer),
  };
}
