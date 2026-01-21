import * as THREE from 'three';
import {convertSphericalToCartesian} from "./utils/convertSphericalToCartesian";
import {meshGroupsNames, planetariumRenderOrders} from "./utils/planetariumSettings";
import {ComputedSunInfos} from "../../types/objects/ComputedSunInfos";

export const createSun = (
  sunData: ComputedSunInfos,
  setUiInfos: React.Dispatch<any>,
) => {
  console.log("[GLView] Creating sun...");

  const { x, y, z } = convertSphericalToCartesian(9.6, sunData.base.ra, sunData.base.dec);
  const geometry = new THREE.SphereGeometry(0.14, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffd27f,
    emissive: 0xffd27f,
    emissiveIntensity: 1.2,
  });
  const sunMesh = new THREE.Mesh(geometry, material);
  sunMesh.position.set(x, y, z);

  // Altitude-aware glow: large, orange near horizon; tighter, yellow higher up
  const sunAltitude = sunData.base.alt ?? 0;
  const altitudeFactor = THREE.MathUtils.clamp((sunAltitude + 6) / 55, 0, 1); // 0 at horizon-ish, 1 by mid-sky
  const glowScale = THREE.MathUtils.lerp(4.2, 1.2, altitudeFactor);
  const glowStrength = THREE.MathUtils.lerp(2.2, 0.9, altitudeFactor);
  const glowColor = new THREE.Color(0xf6b86a).lerp(new THREE.Color(0xfff4c1), altitudeFactor);

  // Add a soft billboarded glow around the sun mesh
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: glowColor },
      uStrength: { value: glowStrength },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying vec2 vUv;
      uniform vec3 uColor;
      uniform float uStrength;
      void main() {
        vec2 d = vUv - 0.5;
        float r = length(d) * 2.0;
        float falloff = pow(1.0 - clamp(r, 0.0, 1.0), 1.6);
        float alpha = falloff * 1.15 * uStrength;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const glowPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowMaterial);
  glowPlane.name = `${meshGroupsNames.sun}-glow`;
  glowPlane.renderOrder = planetariumRenderOrders.planets - 1.5;
  glowPlane.scale.setScalar(glowScale);
  glowPlane.position.set(0, 0, 0);
  glowPlane.onBeforeRender = (_renderer, _scene, camera) => {
    glowPlane.quaternion.copy(camera.quaternion);
  };
  sunMesh.add(glowPlane);

  sunMesh.userData = {
    type: 'sun',
    index: 'sun',
    onTap: () => {
      console.log("[GLView] Sun tapped");
      setUiInfos({
        family: 'Sun',
        name: sunData.base.name,
        ra: sunData.base.ra,
        dec: sunData.base.dec,
        icon: sunData.base.icon,
        v_mag: -26,
      });
    }
  };

  sunMesh.renderOrder = planetariumRenderOrders.planets - 1;
  sunMesh.name = meshGroupsNames.sun;

  console.log("[GLView] Sun created");
  return sunMesh;
}
