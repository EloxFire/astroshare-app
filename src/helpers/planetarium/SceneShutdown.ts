import * as THREE from 'three';

function disposeNode(node: THREE.Object3D): void {
  const mesh = node as any;

  if (mesh.geometry) {
    mesh.geometry.dispose();
  }

  if (mesh.material) {
    const materials: THREE.Material[] = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of materials) {
      const m = mat as any;
      // Dispose textures on every known slot
      const texSlots = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'alphaMap', 'envMap'];
      for (const slot of texSlots) {
        if (m[slot] instanceof THREE.Texture) {
          m[slot].dispose();
        }
      }
      // Dispose shader uniforms that hold textures
      if (m.uniforms) {
        for (const key of Object.keys(m.uniforms)) {
          const u = m.uniforms[key];
          if (u?.value instanceof THREE.Texture) {
            u.value.dispose();
          }
        }
      }
      mat.dispose();
    }
  }
}

export function shutdownScene(scene: THREE.Scene, renderer?: { dispose?: () => void }): void {
  scene.traverse(disposeNode);

  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }

  if (renderer?.dispose) {
    renderer.dispose();
  }
}
