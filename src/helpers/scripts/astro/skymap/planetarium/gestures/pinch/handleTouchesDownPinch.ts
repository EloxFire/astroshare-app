import * as THREE from 'three';
import {getEuclideanDistance} from "../../../getEuclideanDistance";
import {getEffectiveAngularResolution} from "../../../getEffectiveAngularResolution";
import {GestureTouchEvent} from "react-native-gesture-handler";

export const handleTouchesDownPinch = (event: GestureTouchEvent,camera: THREE.PerspectiveCamera | null, cameraWidth: number) => {
  if(!camera){
    console.log('[handleTouchesDownPinch] Camera is not defined.')
    return;
  }

  if(event.allTouches.length !== 2){
    return;
  }

  let startDistance: number = getEuclideanDistance(event.allTouches[0].x, event.allTouches[0].y, event.allTouches[1].x, event.allTouches[1].y); //distance initiale en pixel entre les deux doigts
  const angle: number = startDistance * getEffectiveAngularResolution(camera.getEffectiveFOV(), cameraWidth); //angle entre les deux point celeste pointé par les doigts

  return angle;
}
