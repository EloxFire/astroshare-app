import * as THREE from "three";
import { raDecToVec3 } from "../utils/coordinates";
import { LAYER_NAMES, RENDER_ORDER } from "../utils/renderOrders";

export type SunSkyPosition = { ra: number; dec: number; altitudeDeg: number };

export const createAtmosphereLayer = (sun: SunSkyPosition): THREE.Mesh => {
  const sunDir = raDecToVec3(sun.ra, sun.dec, 1).normalize();
  const initialDayMix = THREE.MathUtils.clamp((sun.altitudeDeg + 10) / 16, 0, 1);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      // Bleu marine légèrement relevé plutôt que noir pur : garde un ciel crédible même à minuit.
      uColorNight: { value: new THREE.Color(0x0d1626) },
      // Lueur d'horizon visible toute la nuit (airglow naturel + pollution lumineuse) : ne contribue
      // qu'à l'horizon, la nuit.
      uColorNightGlow: { value: new THREE.Color(0x1a2d45) },
      uColorDay: { value: new THREE.Color(0x4a8fd4) },
      uColorTwilight: { value: new THREE.Color(0x1e5c99) },
      uSunDirection: { value: sunDir.clone() },
      // Direction du zénith local, monde — mise à jour chaque frame depuis l'observateur, pour que
      // "horizon"/"altitude" soient physiquement corrects. (0,0,1) par défaut = pôle céleste nord,
      // écrasé dès le premier appel à updateAtmosphere.
      uZenith: { value: new THREE.Vector3(0, 0, 1) },
      uMixDay: { value: initialDayMix },
      uTwilight: { value: 0 },
      uBaseOpacity: { value: 0.62 },
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
      uniform vec3  uZenith;
      uniform float uMixDay;
      uniform float uTwilight;
      uniform float uBaseOpacity;

      void main() {
        vec3 dir    = normalize(vWorldDir);
        vec3 sunDir = normalize(uSunDirection);
        vec3 up     = normalize(uZenith);

        // altitude = sinus de l'élévation au-dessus de l'horizon local : 1 au zénith, 0 à
        // l'horizon, -1 sous les pieds.
        float altitude = dot(dir, up);
        float sunFacing = clamp(dot(sunDir, dir), 0.0, 1.0);

        // Bande d'horizon : maximale à altitude=0, décroît au-dessus comme en dessous.
        float horizonBand = pow(clamp(1.0 - abs(altitude), 0.0, 1.0), 1.2);
        float zenithFade = pow(clamp(altitude * 0.5 + 0.5, 0.0, 1.0), 0.7);
        float nightFactor = clamp(1.0 - max(uMixDay, uTwilight), 0.0, 1.0);

        vec3 sky = mix(uColorNight, uColorDay, uMixDay);
        sky = mix(sky, uColorTwilight, uTwilight * horizonBand * 0.8);
        sky += uColorDay * (0.25 * sunFacing * uMixDay + 0.15 * horizonBand * uMixDay);
        sky = mix(sky * 0.80, sky, zenithFade);
        sky += uColorNightGlow * (nightFactor * horizonBand * 0.85);

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
};

// À appeler à chaque frame (ou throttlé, voir ExploreScreen) pour garder le shader d'atmosphère et
// les couches dépendantes (étoiles, pour l'instant) synchronisées avec la position réelle du Soleil.
export const updateAtmosphere = (
  atmosphere: THREE.Mesh,
  sun: SunSkyPosition,
  starsCloud: THREE.Points | null,
  zenithVec: THREE.Vector3
): void => {
  const dayMix = THREE.MathUtils.clamp((sun.altitudeDeg + 10) / 16, 0, 1);
  const twilight = THREE.MathUtils.clamp(1 - Math.abs(sun.altitudeDeg) / 8, 0, 1);

  const material = atmosphere.material as THREE.ShaderMaterial;
  const sunDir = raDecToVec3(sun.ra, sun.dec, 1).normalize();
  if (material.uniforms.uSunDirection) (material.uniforms.uSunDirection.value as THREE.Vector3).copy(sunDir);
  if (material.uniforms.uMixDay) material.uniforms.uMixDay.value = dayMix;
  if (material.uniforms.uTwilight) material.uniforms.uTwilight.value = twilight;
  if (material.uniforms.uBaseOpacity) {
    material.uniforms.uBaseOpacity.value = THREE.MathUtils.lerp(0.2, 0.72, Math.max(dayMix, twilight * 0.5));
  }
  if (material.uniforms.uZenith) (material.uniforms.uZenith.value as THREE.Vector3).copy(zenithVec).normalize();

  // Chaque étoile calcule son propre seuil de crépuscule à partir de l'altitude réelle du Soleil
  // (voir StarsLayer) : les plus brillantes apparaissent dès le coucher, les plus faibles attendent
  // le crépuscule astronomique (-18°).
  if (starsCloud) {
    const starMaterial = starsCloud.material as THREE.ShaderMaterial;
    if (starMaterial.uniforms?.uSunAlt) starMaterial.uniforms.uSunAlt.value = sun.altitudeDeg;
  }
};
