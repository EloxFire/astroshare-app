import * as THREE from 'three';
import { ComputedSunInfos } from '../../types/objects/ComputedSunInfos';
import { raDecToVec3 } from '../utils/coordinates';
import { LAYER_NAMES, RENDER_ORDER } from '../utils/renderOrders';

export function createAtmosphereLayer(
  sunData: ComputedSunInfos,
): THREE.Mesh {
  const sunDir = raDecToVec3(sunData.base.ra, sunData.base.dec, 1).normalize();
  const sunAlt = sunData.base.alt ?? -90;
  const initialDayMix = THREE.MathUtils.clamp((sunAlt + 6) / 12, 0, 1);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColorNight:   { value: new THREE.Color(0x060c18) },
      uColorDay:     { value: new THREE.Color(0x4a8fd4) },
      uColorTwilight:{ value: new THREE.Color(0x1e5c99) },
      uSunDirection: { value: sunDir.clone() },
      uMixDay:       { value: initialDayMix },
      uTwilight:     { value: 0 },
      uBaseOpacity:  { value: 0.62 },
    },
    vertexShader: `
      varying vec3 vWorldDir;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldDir = normalize(wp.xyz);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying vec3 vWorldDir;
      uniform vec3 uSunDirection;
      uniform vec3 uColorNight;
      uniform vec3 uColorDay;
      uniform vec3 uColorTwilight;
      uniform float uMixDay;
      uniform float uTwilight;
      uniform float uBaseOpacity;

      void main() {
        vec3 dir = normalize(vWorldDir);
        vec3 sunDir = normalize(uSunDirection);

        float sunFacing   = clamp(dot(sunDir, dir), 0.0, 1.0);
        float horizonBand = pow(clamp(1.0 - abs(dir.z), 0.0, 1.0), 2.0);
        float zenithFade  = pow(clamp(dir.z * 0.5 + 0.5, 0.0, 1.0), 0.7);

        // Day/night base
        vec3 sky = mix(uColorNight, uColorDay, uMixDay);
        // Twilight orange band near horizon when sun is close to it
        sky = mix(sky, uColorTwilight, uTwilight * horizonBand * 0.8);
        // Mild glow toward sun during daytime
        sky += uColorDay * (0.25 * sunFacing * uMixDay + 0.15 * horizonBand * uMixDay);
        // Zenith darkening for realism
        sky = mix(sky * 0.80, sky, zenithFade);

        float opacity = clamp(uBaseOpacity * (0.35 + 0.65 * max(uMixDay, uTwilight)), 0.10, 0.85);
        gl_FragColor = vec4(sky, opacity);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(70, 64, 64), material);
  mesh.renderOrder = RENDER_ORDER.atmosphere;
  mesh.name = LAYER_NAMES.atmosphere;
  return mesh;
}

export function updateAtmosphere(
  atmosphere: THREE.Mesh,
  sunData: ComputedSunInfos,
  enabled: boolean,
  starsCloud: THREE.Points | null,
  backgroundMesh: THREE.Mesh | null,
  dsoGroup: THREE.Group | null,
): void {
  const sunAlt = sunData.base.alt ?? -90;
  const dayMix  = THREE.MathUtils.clamp((sunAlt + 6) / 12, 0, 1);
  const twilight = THREE.MathUtils.clamp(1 - Math.abs(sunAlt) / 8, 0, 1);
  const nightFactor = THREE.MathUtils.clamp(-sunAlt / 15, 0, 1);
  const dsoVisibility = THREE.MathUtils.clamp((nightFactor - 0.35) / 0.65, 0, 1);

  if (!enabled) {
    // Atmosphere hidden — full visibility everywhere
    _applyStarNightFactor(starsCloud, 1);
    _applyBgOpacity(backgroundMesh, 1);
    _applyDsoVisibility(dsoGroup, 1);
    return;
  }

  const mat = atmosphere.material as THREE.ShaderMaterial;
  const sunDir = raDecToVec3(sunData.base.ra, sunData.base.dec, 1).normalize();
  if (mat.uniforms.uSunDirection) (mat.uniforms.uSunDirection.value as THREE.Vector3).copy(sunDir);
  if (mat.uniforms.uMixDay)    mat.uniforms.uMixDay.value    = dayMix;
  if (mat.uniforms.uTwilight)  mat.uniforms.uTwilight.value  = twilight;
  if (mat.uniforms.uBaseOpacity) {
    mat.uniforms.uBaseOpacity.value = THREE.MathUtils.lerp(0.20, 0.72, Math.max(dayMix, twilight * 0.5));
  }

  _applyStarNightFactor(starsCloud, nightFactor);
  _applyBgOpacity(backgroundMesh, nightFactor);
  _applyDsoVisibility(dsoGroup, dsoVisibility);
}

function _applyStarNightFactor(cloud: THREE.Points | null, value: number) {
  if (!cloud) return;
  const mat = cloud.material as THREE.ShaderMaterial;
  if (mat.uniforms?.uNightFactor) mat.uniforms.uNightFactor.value = value;
}

function _applyBgOpacity(mesh: THREE.Mesh | null, value: number) {
  if (!mesh) return;
  const mat = mesh.material as THREE.MeshBasicMaterial;
  if (mat) { mat.opacity = value; mat.transparent = true; }
}

function _applyDsoVisibility(group: THREE.Group | null, value: number) {
  if (!group) return;
  group.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.material) return;
    const apply = (m: THREE.Material) => {
      const sm = m as THREE.ShaderMaterial;
      if (sm.uniforms?.uVisibility) {
        sm.uniforms.uVisibility.value = value;
      } else {
        (m as any).opacity = value;
      }
      m.transparent = true;
      m.needsUpdate = true;
    };
    if (Array.isArray(mesh.material)) mesh.material.forEach(apply);
    else apply(mesh.material);
  });
}
