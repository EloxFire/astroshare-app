import * as THREE from 'three';
import {getGlobePosition} from "./utils/getGlobePosition";
import {LocationObject} from "../../types/LocationObject";
import {planetariumRenderOrders} from "./utils/renderOrders";

export const createGround = (currentUserLocation: LocationObject) => {
  console.log("[GLView] Creating ground...");
  const vertexShader = `
    varying vec4 vPos;
    void main() {
        vPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        gl_Position = vPos;
    }
  `
  const fragmentShader = `
    void main() {
        vec4 col = vec4(0.,0.,0.,1.);  
        gl_FragColor = col;
    }`;

  const groundGeometry = new THREE.SphereGeometry(1, 64, 64, Math.PI, Math.PI, 0, Math.PI);
  const groundShader = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    blending: THREE.NormalBlending,
    opacity:1,
  });

  groundShader.side = THREE.BackSide;

  const ground = new THREE.Mesh(groundGeometry, groundShader);
  const lookAtVec = getGlobePosition(currentUserLocation.lat, currentUserLocation.lon);
  ground.lookAt(lookAtVec);

  // On récupère l'orientation calculée et on la stocke dans une propriété custom
  ground.userData.baseQuaternion = ground.quaternion.clone();
  ground.renderOrder = planetariumRenderOrders.ground;

  return ground;
}