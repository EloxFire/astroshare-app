import * as THREE from 'three';
import { ComputedSunInfos } from '../../types/objects/ComputedSunInfos';
import { raDecToVec3 } from '../utils/coordinates';
import { LAYER_NAMES, RENDER_ORDER } from '../utils/renderOrders';

export function createAtmosphereLayer(
  sunData: ComputedSunInfos,
): THREE.Mesh {
  const sunDir = raDecToVec3(sunData.base.ra, sunData.base.dec, 1).normalize();
  const sunAlt = sunData.base.alt ?? -90;
  const initialDayMix = THREE.MathUtils.clamp((sunAlt + 10) / 16, 0, 1);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      // Slightly lifted dark navy instead of near-black — gives the sky
      // a realistic tint even at midnight and lets the atmosphere read
      // as "sky" rather than "void".
      uColorNight:    { value: new THREE.Color(0x0d1626) },
      // Horizon airglow seen every night (natural airglow + light pollution).
      // Contributes only at the horizon band during night.
      uColorNightGlow:{ value: new THREE.Color(0x1a2d45) },
      uColorDay:      { value: new THREE.Color(0x4a8fd4) },
      uColorTwilight: { value: new THREE.Color(0x1e5c99) },
      uSunDirection:  { value: sunDir.clone() },
      // Local zenith direction in world space — set every frame from the observer
      // coordinates so that "horizon" and "altitude" are physically correct.
      // Default (0,0,1) = NCP, overwritten on the first updateAtmosphere call.
      uZenith:        { value: new THREE.Vector3(0, 0, 1) },
      uMixDay:        { value: initialDayMix },
      uTwilight:      { value: 0 },
      uBaseOpacity:   { value: 0.62 },
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
      uniform vec3  uSunDirection;
      uniform vec3  uColorNight;
      uniform vec3  uColorNightGlow;
      uniform vec3  uColorDay;
      uniform vec3  uColorTwilight;
      uniform vec3  uZenith;       // local up direction (observer vertical)
      uniform float uMixDay;
      uniform float uTwilight;
      uniform float uBaseOpacity;

      void main() {
        vec3 dir    = normalize(vWorldDir);
        vec3 sunDir = normalize(uSunDirection);
        vec3 up     = normalize(uZenith);

        // altitude = sine of the elevation above the local horizon.
        // dot(dir, up) = 1 directly overhead, 0 at horizon, -1 underfoot.
        float altitude = dot(dir, up);

        float sunFacing = clamp(dot(sunDir, dir), 0.0, 1.0);

        // Horizon band: peaks at altitude=0, falls off above and below.
        // Exponent 1.2 gives a wide, diffuse glow — realistic for airglow / light pollution.
        float horizonBand = pow(clamp(1.0 - abs(altitude), 0.0, 1.0), 1.2);

        // Zenith fade: bright at horizon, subtle darkening overhead.
        float zenithFade = pow(clamp(altitude * 0.5 + 0.5, 0.0, 1.0), 0.7);

        // How "night" is it? 0 = daytime or twilight, 1 = fully dark.
        float nightFactor = clamp(1.0 - max(uMixDay, uTwilight), 0.0, 1.0);

        // ── Sky colour ──────────────────────────────────────────────────────
        // Day/night base colour
        vec3 sky = mix(uColorNight, uColorDay, uMixDay);
        // Twilight orange/blue band near the horizon when the sun is near it
        sky = mix(sky, uColorTwilight, uTwilight * horizonBand * 0.8);
        // Mild solar glow toward the sun and along the horizon in daylight
        sky += uColorDay * (0.25 * sunFacing * uMixDay + 0.15 * horizonBand * uMixDay);
        // Zenith darkening for daytime realism
        sky = mix(sky * 0.80, sky, zenithFade);
        // Natural airglow / light-pollution band along the horizon at night.
        // 0.85 weight makes it clearly visible even at modest opacity.
        sky += uColorNightGlow * (nightFactor * horizonBand * 0.85);

        // ── Opacity ─────────────────────────────────────────────────────────
        // Day   → uBaseOpacity drives full coverage (0.72 at noon).
        // Night → gradient: ~0.12 at zenith, ~0.42 at horizon so stars and
        //         Milky Way show through overhead while the atmosphere still
        //         reads as "sky" near the ground.
        float dayOp   = uBaseOpacity * (0.35 + 0.65 * max(uMixDay, uTwilight * 0.5));
        float nightOp = 0.40 * nightFactor * (0.20 + 0.80 * pow(horizonBand, 0.5));
        float opacity = clamp(dayOp + nightOp, 0.0, 0.85);

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

/**
 * Call every frame (or whenever sun position / observer changes) to keep the
 * atmosphere shader and dependent layers in sync.
 *
 * @param zenithVec  Local zenith direction in world-space equatorial coords.
 *                   Pass `zenithVecRef.current` from the Planetarium RAF loop.
 *                   If omitted the shader keeps the previous value (fine for
 *                   the very first frame before it is computed).
 */
export function updateAtmosphere(
  atmosphere: THREE.Mesh,
  sunData: ComputedSunInfos,
  enabled: boolean,
  starsCloud: THREE.Points | null,
  backgroundMesh: THREE.Mesh | null,
  dsoGroup: THREE.Group | null,
  zenithVec?: THREE.Vector3 | null,
): void {
  const sunAlt = sunData.base.alt ?? -90;
  const dayMix  = THREE.MathUtils.clamp((sunAlt + 10) / 16, 0, 1);
  const twilight = THREE.MathUtils.clamp(1 - Math.abs(sunAlt) / 8, 0, 1);
  const nightFactor = THREE.MathUtils.clamp(-sunAlt / 15, 0, 1);
  const dsoVisibility = THREE.MathUtils.clamp((nightFactor - 0.35) / 0.65, 0, 1);

  if (!enabled) {
    // Atmosphere hidden — full visibility everywhere; stars always shown.
    _applyStarSunAlt(starsCloud, -100);
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
  if (zenithVec && mat.uniforms.uZenith) {
    (mat.uniforms.uZenith.value as THREE.Vector3).copy(zenithVec).normalize();
  }

  // Pass the actual sun altitude so each star can compute its own twilight
  // threshold: brightest stars appear right at sunset, faint stars wait until
  // astronomical twilight (-18°).
  _applyStarSunAlt(starsCloud, sunAlt);
  _applyBgOpacity(backgroundMesh, nightFactor);
  _applyDsoVisibility(dsoGroup, dsoVisibility);
}

// ── Private helpers ───────────────────────────────────────────────────────────

/**
 * Set the sun altitude uniform on the star shader.
 * Pass -100 to always show all stars (atmosphere disabled mode).
 */
function _applyStarSunAlt(cloud: THREE.Points | null, sunAlt: number) {
  if (!cloud) return;
  const mat = cloud.material as THREE.ShaderMaterial;
  if (mat.uniforms?.uSunAlt) mat.uniforms.uSunAlt.value = sunAlt;
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
