import { THREE } from "expo-three";
import { drawCircle } from "./drawCircle";

export const createGrid = (r: number,color:number) => {
    const radius = 20;
    let group = new THREE.Group();
    for (let i = -Math.PI / 2 + Math.PI / 18; i < Math.PI / 2; i = i + Math.PI / 18) {
        let radiusVec = new THREE.Vector3(radius * Math.cos(i), 0, 0);
        let positionVec = new THREE.Vector3(0, 0, radius * Math.sin(i));
        let axisVec = new THREE.Vector3(0, 0, 1);
        group.add(drawCircle(radiusVec, positionVec, axisVec,color));
    }

    for (let j = -Math.PI / 2; j < Math.PI / 2; j = j + Math.PI / 12) {
        let radiusVec = new THREE.Vector3(0, 0, radius);
        let positionVec = new THREE.Vector3(0, 0, 0);
        let axisVec = new THREE.Vector3(Math.cos(j), Math.sin(j), 0);
        group.add(drawCircle(radiusVec, positionVec, axisVec,color));
    }

    return group;
}