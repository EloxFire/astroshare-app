import * as THREE from 'three';
import { convertSphericalToCartesian } from './convertSphericalToCartesian';

export const goTo = (ra: number, dec: number, groundQ: THREE.Quaternion) => {
    let q = new THREE.Quaternion;
    let q1 = new THREE.Quaternion;
    let q2 = new THREE.Quaternion;
    const conjugate = groundQ.conjugate();
    let Z = new THREE.Vector3(0, 0, 1);
    let X = new THREE.Vector3(1, 0, 0);
    let object = convertSphericalToCartesian(1, ra, dec);
    let worldObject = object.applyQuaternion(conjugate);
    let Zangle = worldObject.angleTo(new THREE.Vector3(worldObject.x, worldObject.y, 0).normalize());
    let Xangle = new THREE.Vector3(worldObject.x, worldObject.y, 0).normalize().angleTo(new THREE.Vector3(0,1,0));
    q1.setFromAxisAngle(Z,Zangle);
    q2.setFromAxisAngle(X,Xangle);
    q=groundQ.multiply(q1).multiply(q2);
    return q;
}