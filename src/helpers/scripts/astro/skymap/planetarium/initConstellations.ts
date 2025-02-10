import {THREE} from "expo-three";
import {constellationsAsterisms} from "../../constellationsAsterisms";
import {convertSphericalToCartesian} from "../convertSphericalToCartesian";

export const initConstellations = (scene: THREE.Scene) => {
  let group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({
    color: 'white'
  });
  constellationsAsterisms.map((constellation: any, constellationIndex: number) => {
    // @ts-ignore
    constellation.feature.features[0].geometry.coordinates.map((segment: any, segmentIndex: any) => {
      if (segment.length < 2) return null;
      let points = [];
      const start = segment[0];
      const end = segment[1];
      points.push(convertSphericalToCartesian(8, start[0], start[1]));
      points.push(convertSphericalToCartesian(8, end[0], end[1]));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      group.add(line);
    });
  });
  scene.add(group);


  return group;
}