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

  sunMesh.renderOrder = planetariumRenderOrders.planets;
  sunMesh.name = meshGroupsNames.sun;

  console.log("[GLView] Sun created");
  return sunMesh;
}
