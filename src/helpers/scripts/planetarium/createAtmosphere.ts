import * as THREE from "three";
import {meshGroupsNames, planetariumRenderOrders} from "./utils/planetariumSettings";

export const createAtmosphere = (sunDirection?: THREE.Vector3, sunAltitude?: number) => {
  const initialAltitude = typeof sunAltitude === 'number' ? sunAltitude : -90;
  const initialDayMix = THREE.MathUtils.clamp((initialAltitude + 6) / 12, 0, 1);

  const atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColorNight: { value: new THREE.Color(0x060c18) },
      uColorDay: { value: new THREE.Color(0x6fa0e4) },
      uSunDirection: { value: sunDirection ? sunDirection.clone().normalize() : new THREE.Vector3(0, 0, 1) },
      uMixDay: { value: initialDayMix },
      uBaseOpacity: { value: 0.62 },
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
      uniform float uMixDay;
      uniform float uBaseOpacity;

      void main() {
        vec3 dir = normalize(vWorldPosition);
        vec3 sunDir = normalize(uSunDirection);
        float sunFacing = clamp(dot(sunDir, dir), 0.0, 1.0);
        float horizonBand = pow(clamp(1.0 - abs(dir.y), 0.0, 1.0), 1.7);

        float dayFactor = clamp(uMixDay, 0.0, 1.0);
        vec3 baseSky = mix(uColorNight, uColorDay, dayFactor);

        // Subtle brightening toward sun and horizon for daytime, without warm sunset tint
        float sunBoost = sunFacing * dayFactor;
        float horizonLift = horizonBand * dayFactor;
        vec3 sky = baseSky + uColorDay * (0.35 * sunBoost + 0.22 * horizonLift);
        sky = mix(baseSky, sky, clamp(dayFactor + sunBoost, 0.0, 1.0));

        // Slightly deepen zenith for a more realistic dome gradient
        float zenithFactor = pow(clamp(dir.y * 0.5 + 0.5, 0.0, 1.0), 0.8);
        sky = mix(baseSky * 0.85, sky, zenithFactor);

        float opacity = clamp(uBaseOpacity * (0.4 + 0.6 * dayFactor), 0.14, 0.82);
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
