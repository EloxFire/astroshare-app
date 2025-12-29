import * as THREE from 'three';
import {LocationObject} from "../../types/LocationObject";
import {meshGroupsNames, planetariumRenderOrders} from "./utils/planetariumSettings";
import {convertHorizontalToEquatorial} from "@observerly/astrometry";
import {convertSphericalToCartesian} from "./utils/convertSphericalToCartesian";

export const createGround = (currentUserLocation: LocationObject, date: Date = new Date()) => {
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

  const zenithEq = convertHorizontalToEquatorial(date, { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { alt: 90, az: 0 });
  const northEq = convertHorizontalToEquatorial(date, { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { alt: 0, az: 0 });
  const zenithVec = convertSphericalToCartesian(5, zenithEq.ra, zenithEq.dec);
  const northVec = convertSphericalToCartesian(5, northEq.ra, northEq.dec).normalize();

  ground.up.copy(northVec);
  ground.lookAt(zenithVec);


  // On récupère l'orientation calculée et on la stocke dans une propriété custom
  ground.userData.baseQuaternion = ground.quaternion.clone();
  ground.renderOrder = planetariumRenderOrders.ground;
  ground.name = meshGroupsNames.ground;

  return ground;
}
