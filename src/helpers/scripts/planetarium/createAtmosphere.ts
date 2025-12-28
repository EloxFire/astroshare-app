import * as THREE from "three";
import {meshGroupsNames, planetariumRenderOrders} from "./utils/planetariumSettings";

export const createAtmosphere = (sunDirection?: THREE.Vector3, sunAltitude?: number) => {
  const initialAltitude = typeof sunAltitude === 'number' ? sunAltitude : -90;
  const initialDayMix = THREE.MathUtils.clamp((initialAltitude + 6) / 12, 0, 1);
  const initialTwilight = THREE.MathUtils.clamp(1 - Math.abs(initialAltitude) / 8, 0, 1);

  const atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColorNight: { value: new THREE.Color(0x0a1224) },
      uColorDay: { value: new THREE.Color(0x72a5ff) },
      uColorHorizonWarm: { value: new THREE.Color(0xff6b3d) },
      uColorHorizonCool: { value: new THREE.Color(0xc367ff) },
      uSunDirection: { value: sunDirection ? sunDirection.clone().normalize() : new THREE.Vector3(0, 0, 1) },
      uMixDay: { value: initialDayMix },
      uTwilight: { value: initialTwilight },
      uBaseOpacity: { value: 0.55 },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = normalize(worldPosition.xyz);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying vec3 vWorldPosition;
      uniform vec3 uSunDirection;
      uniform vec3 uColorNight;
      uniform vec3 uColorDay;
      uniform vec3 uColorHorizonWarm;
      uniform vec3 uColorHorizonCool;
      uniform float uMixDay;
      uniform float uTwilight;
      uniform float uBaseOpacity;

      void main() {
        float sunFacing = max(0.0, dot(normalize(uSunDirection), normalize(vWorldPosition)));
        float glow = pow(sunFacing, 2.5);

        vec3 twilight = mix(uColorHorizonWarm, uColorHorizonCool, sunFacing);
        vec3 sky = mix(uColorNight, uColorDay, clamp(uMixDay, 0.0, 1.0));
        sky = mix(sky, twilight, clamp(uTwilight, 0.0, 1.0) * glow);

        float opacity = clamp(uBaseOpacity * (0.4 + 0.8 * max(uMixDay, uTwilight)), 0.12, 0.88);
        gl_FragColor = vec4(sky, opacity);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  });

  const geometry = new THREE.SphereGeometry(70, 128, 128);
  const atmosphere = new THREE.Mesh(geometry, atmosphereMaterial);
  atmosphere.renderOrder = planetariumRenderOrders.atmosphere;
  atmosphere.name = meshGroupsNames.atmosphere;

  return atmosphere;
};
