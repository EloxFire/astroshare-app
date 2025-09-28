import {THREE} from "expo-three";
import {drawCircle} from "./utils/drawCircle";

export const createEqGrid = () => {
  console.log("[GLView] Creating equatorial grid...");

  const color = 0x00ff00;
  const radius = 1.2;

  let grid1 = new THREE.Group();
  let grid2 = new THREE.Group();
  let grid3 = new THREE.Group();
  //grid1
  for (let i = -Math.PI / 2 + Math.PI / 18; i < Math.PI / 2; i = i + Math.PI / 18) {
    let radiusVec = new THREE.Vector3(radius * Math.cos(i), 0, 0);
    let positionVec = new THREE.Vector3(0, 0, radius * Math.sin(i));
    let axisVec = new THREE.Vector3(0, 0, 1);
    grid1.add(drawCircle(radiusVec, positionVec, axisVec, color));
  }

  for (let j = -Math.PI / 2; j < Math.PI / 2; j = j + Math.PI / 12) {
    let radiusVec = new THREE.Vector3(0, 0, radius);
    let positionVec = new THREE.Vector3(0, 0, 0);
    let axisVec = new THREE.Vector3(Math.cos(j), Math.sin(j), 0);
    grid1.add(drawCircle(radiusVec, positionVec, axisVec, color));
  }
  //grid2
  for (let i = -Math.PI / 2 + Math.PI / 36; i < Math.PI / 2; i = i + Math.PI / 36) {
    let radiusVec = new THREE.Vector3(radius * Math.cos(i), 0, 0);
    let positionVec = new THREE.Vector3(0, 0, radius * Math.sin(i));
    let axisVec = new THREE.Vector3(0, 0, 1);
    grid2.add(drawCircle(radiusVec, positionVec, axisVec, color));
  }

  for (let j = -Math.PI / 2; j < Math.PI / 2; j = j + Math.PI / 24) {
    let radiusVec = new THREE.Vector3(0, 0, radius);
    let positionVec = new THREE.Vector3(0, 0, 0);
    let axisVec = new THREE.Vector3(Math.cos(j), Math.sin(j), 0);
    grid2.add(drawCircle(radiusVec, positionVec, axisVec, color));
  }
  //grid3
  for (let i = -Math.PI / 2 + Math.PI / 180; i < Math.PI / 2; i = i + Math.PI / 180) {
    let radiusVec = new THREE.Vector3(radius * Math.cos(i), 0, 0);
    let positionVec = new THREE.Vector3(0, 0, radius * Math.sin(i));
    let axisVec = new THREE.Vector3(0, 0, 1);
    grid3.add(drawCircle(radiusVec, positionVec, axisVec, color));
  }

  for (let j = -Math.PI / 2; j < Math.PI / 2; j = j + Math.PI / (12 * 6)) {
    let radiusVec = new THREE.Vector3(0, 0, radius);
    let positionVec = new THREE.Vector3(0, 0, 0);
    let axisVec = new THREE.Vector3(Math.cos(j), Math.sin(j), 0);
    grid3.add(drawCircle(radiusVec, positionVec, axisVec, color));
  }

  return { grid1, grid2, grid3 };
}