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

// IAU rotation elements: W0 = prime meridian at J2000, d = deg/day, obliquity = axial tilt deg
const PLANET_ROTATION: Record<string, { w0: number; d: number; obliquity: number }> = {
  Mercury: { w0: 329.5988,  d:    6.1385025,   obliquity:   0.034 },
  Venus:   { w0: 160.20,    d:   -1.4813688,   obliquity: 177.36  },
  Mars:    { w0: 176.630,   d:  350.89198226,  obliquity:  25.19  },
  Jupiter: { w0: 284.95,    d:  870.5360000,   obliquity:   3.13  },
  Saturn:  { w0:  38.90,    d:  810.7939024,   obliquity:  26.73  },
  Uranus:  { w0: 203.81,    d: -501.1600928,   obliquity:  97.77  },
  Neptune: { w0: 253.18,    d:  536.3128492,   obliquity:  28.32  },
};

// Days elapsed since J2000.0 (2000-Jan-1.5 TT)
function daysSinceJ2000(date: Date): number {
  return date.getTime() / 86400000 - 10957.5;
}

// Apply IAU rotation to a planet mesh
function applyPlanetRotation(mesh: THREE.Object3D, date: Date): void {
  const rot = PLANET_ROTATION[mesh.name];
  if (!rot) return;
  const d = daysSinceJ2000(date);
  const w = THREE.MathUtils.degToRad(((rot.w0 + rot.d * d) % 360 + 360) % 360);
  const tilt = THREE.MathUtils.degToRad(rot.obliquity);
  // Apply axial tilt (X) then self-rotation (Y), in ZYX order
  mesh.rotation.set(tilt, w, 0, 'ZYX');
}

// Orient moon so the near side (texture center, +X in SphereGeometry) faces Earth at origin
// and the texture north pole aligns with the North Celestial Pole.
// Coordinate system: X=vernal equinox, Y=RA 6h, Z=NCP (Dec +90°) — see raDecToVec3.
function orientMoonToEarth(mesh: THREE.Mesh): void {
  // +X in SphereGeometry UV space = U=0.5 = center of texture = 0° lunar longitude (near side)
  const xAxis = mesh.position.clone().normalize().negate(); // toward Earth

  // NCP is +Z in this coordinate system (not +Y)
  const ncp = new THREE.Vector3(0, 0, 1);
  // Gram-Schmidt: project NCP perpendicular to xAxis
  const yAxis = ncp.clone().sub(xAxis.clone().multiplyScalar(ncp.dot(xAxis))).normalize();
  if (yAxis.lengthSq() < 0.001) {
    // Moon is at the celestial pole — use +X world as fallback
    const fallback = new THREE.Vector3(1, 0, 0);
    yAxis.copy(fallback.sub(xAxis.clone().multiplyScalar(fallback.dot(xAxis)))).normalize();
  }
  const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis);

  mesh.setRotationFromMatrix(new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis));
}

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
  date: Date,
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
    applyPlanetRotation(mesh, date);
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
  const loader = new ExpoTHREE.TextureLoader();
  const moonTexture = loader.load(planetTextures.MOON);
  const moonNormal  = loader.load(planetTextures.MOON_NORMAL);
  const material = new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: moonNormal,
    normalScale: new THREE.Vector2(0.6, 0.6),
    roughness: 0.95,
    metalness: 0.0,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(pos);
  orientMoonToEarth(mesh);
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

  // Phase lighting: directional light from the sun, faint ambient for earthshine
  readonly sunLight: THREE.DirectionalLight;
  readonly ambientLight: THREE.AmbientLight;

  private setSelectedObject: SetObjectFn;

  constructor(
    snapshot: SolarSystemSnapshot,
    date: Date,
    setSelectedObject: SetObjectFn,
    reporter?: PlanetariumLoadingReporter,
  ) {
    this.setSelectedObject = setSelectedObject;

    // Sun light illuminates the moon (and planets) to show correct phase
    this.sunLight = new THREE.DirectionalLight(0xfff5e0, 1.8);
    this.sunLight.position.copy(raDecToVec3(snapshot.sunData.base.ra, snapshot.sunData.base.dec, 1).normalize());

    // Faint ambient: earthshine + zodiacal light approximation
    this.ambientLight = new THREE.AmbientLight(0x222233, 0.08);

    reporter?.({ stepId: 'planets', title: 'Planets', detail: 'Creating planet meshes', status: 'active' });
    this.planetsGroup = createPlanetMeshes(snapshot.planets, setSelectedObject, date);
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

    // Update sun light direction for correct moon phase
    this.sunLight.position.copy(raDecToVec3(sunData.base.ra, sunData.base.dec, 1).normalize());

    // Reposition planets and apply IAU rotation
    this.planetsGroup.children.forEach((child) => {
      const pd = planets.find((p) => p.name === child.name);
      if (!pd) return;
      child.position.copy(raDecToVec3(pd.ra, pd.dec, 9.9));
      applyPlanetRotation(child, dateObj);
      child.userData.onTap = () => this.setSelectedObject(pd);
    });

    // Reposition moon and re-orient near side toward Earth
    this.moonMesh.position.copy(raDecToVec3(moon.ra, moon.dec, 9.8));
    orientMoonToEarth(this.moonMesh);
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
    scene.add(this.sunLight, this.ambientLight, this.planetsGroup, this.moonMesh, this.sunMesh);
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
