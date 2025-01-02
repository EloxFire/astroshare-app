import { THREE } from "expo-three";

export const createGround = () => {
    // Creation du sol
    const Groundgeometry = new THREE.SphereGeometry(1, 64, 64, Math.PI, Math.PI, 0, Math.PI);
    let material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3 });
    material.side = THREE.BackSide;
    let ground = new THREE.Mesh(Groundgeometry, material);
    // let vec = getGlobePosition(currentUserLocation.lat, currentUserLocation.lon);
    return (ground);
}