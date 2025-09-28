// utils/createTextLabel.ts
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader';
import dmmono from '../../../../assets/fonts/DMMonoRegular.typeface.json'

const fontLoader = new FontLoader();
const font: Font = fontLoader.parse(dmmono as any);

export function createTextLabel(
  text: string,
  position: THREE.Vector3,
  groundQuaternion: THREE.Quaternion,
  camera: THREE.Camera,
  options?: {
    size?: number;
    height?: number;
    color?: THREE.ColorRepresentation;
    name?: string;
  }
): THREE.Group {
  const geometry = new TextGeometry(text, {
    font,
    size: options?.size ?? 0.25,
    depth: 0.01,
    curveSegments: 12,
    bevelEnabled: false,
  });

  const material = new THREE.MeshBasicMaterial({
    color: options?.color ?? 0xffffff,
    transparent: true,
    depthWrite: false,
  });

  const labelMesh = new THREE.Mesh(geometry, material);
  labelMesh.name = options?.name ?? 'label';

  // Crée un pivot pour faire le lookAt vers la caméra
  const billboard = new THREE.Group();
  billboard.position.copy(position.clone().add(new THREE.Vector3(0, -0.4, 0)));

  billboard.add(labelMesh);

  // Le groupe principal est tourné selon la rotation astronomique
  const finalGroup = new THREE.Group();
  finalGroup.applyQuaternion(groundQuaternion.clone());
  finalGroup.add(billboard);

  // Applique un lookAt vers la caméra dans le référentiel du pivot
  billboard.lookAt(camera.position);

  return finalGroup;
}
