import * as THREE from 'three';
import {getStarColor, getStarMaterial} from "../createStarMaterial";
import {Star} from "../../../../types/Star";
import {convertSphericalToCartesian} from "../convertSphericalToCartesian";

export const initStars = (scene: THREE.Scene, catalog: Star[]) => {
  console.log('[Planetarium] Initializing stars...');
  const stars: number[] = [];
  const starSize: number[] = [];
  const starColor: number[] = [];
  const geometry = new THREE.BufferGeometry();
  const material: THREE.ShaderMaterial = getStarMaterial();

  catalog.forEach((star: Star) => {
    const { x, y, z } = convertSphericalToCartesian(10, star.ra, star.dec);
    stars.push(x, y, z);
    starSize.push(300 * Math.exp(-star.V / 3));
    const indice = getStarColor(star.sp_type);
    starColor.push(2 * indice ** 2, 0.5 / (100 * (indice - 0.5) ** 2 + 1), 2 * (indice - 1) ** 2, 1.0);
  });

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(starSize, 1));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(starColor, 4));

  const starsCloud = new THREE.Points(geometry, material);
  starsCloud.frustumCulled = false;
  starsCloud.renderOrder = 0;

  scene.add(starsCloud);
  console.log('[Planetarium] Stars initialized.');
  return starsCloud;
}