import {GestureTouchEvent} from "react-native-gesture-handler";
import * as THREE from "three";
import {getEuclideanDistance} from "../../../getEuclideanDistance";
import {getFovFromAngularResolution} from "../../../getFovFromAngularResolution";

export const handleToucheMovePinch = (
  event: GestureTouchEvent,
  camera: THREE.PerspectiveCamera | null,
  cameraWidth: number,
  startAngle: number,
) => {

  if(!camera){
    console.log('[handleToucheMovePinch]: Camera is not defined');
    return;
  }

  if(event.allTouches.length !== 2){
    return;
  }

  let currentDistance = getEuclideanDistance(event.allTouches[0].x, event.allTouches[0].y, event.allTouches[1].x, event.allTouches[1].y);
  let newAngularResolution = startAngle / currentDistance;
  let newFOV: number = getFovFromAngularResolution(newAngularResolution, cameraWidth);
  if (newFOV < 0.01) {
    newFOV = 0.01;
  } else if (newFOV > 120) {
    newFOV = 120;
  }
  // if (newFOV > 50) {
  //   EquatorialGrid.grid1.visible = true;
  //   EquatorialGrid.grid2.visible = false;
  //   EquatorialGrid.grid3.visible = false;
  //
  //   AzimuthalGrid.grid1.visible = true;
  //   AzimuthalGrid.grid2.visible = false;
  //   AzimuthalGrid.grid3.visible = false;
  // }
  // if (newFOV <= 50 && newFOV > 10) {
  //   EquatorialGrid.grid1.visible = false;
  //   EquatorialGrid.grid2.visible = true;
  //   EquatorialGrid.grid3.visible = false;
  //
  //   AzimuthalGrid.grid1.visible = false;
  //   AzimuthalGrid.grid2.visible = true;
  //   AzimuthalGrid.grid3.visible = false;
  // }
  // if (newFOV <= 10) {
  //   EquatorialGrid.grid1.visible = false;
  //   EquatorialGrid.grid2.visible = false;
  //   EquatorialGrid.grid3.visible = true;
  //
  //   AzimuthalGrid.grid1.visible = false;
  //   AzimuthalGrid.grid2.visible = false;
  //   AzimuthalGrid.grid3.visible = true;
  // }
  camera.fov = newFOV;
  camera.updateProjectionMatrix();

}
