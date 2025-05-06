import * as THREE from 'three';
import {planetariumRenderOrders} from "./utils/renderOrders";

/**
 * Crée un cercle de sélection visible autour d’un objet cliqué.
 * Utilise RingGeometry pour éviter le remplissage central.
 * @param radius Rayon initial (sera redimensionné dynamiquement)
 * @param color Couleur du cercle (par défaut rouge)
 * @returns Un objet THREE.Line prêt à ajouter à la scène
 */
export function createSelectionCircle(radius: number = 1, color: number = 0xff0000): THREE.Line {
  // Utilise RingGeometry pour faire uniquement un contour de cercle
  const ringGeometry = new THREE.RingGeometry(radius * 0.98, radius, 64);

  // Transforme les triangles en contour de ligne
  const edgeGeometry = new THREE.EdgesGeometry(ringGeometry);

  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.9,
    depthTest: false,
  });

  const circle = new THREE.LineSegments(edgeGeometry, material);
  circle.visible = false;

  circle.renderOrder = planetariumRenderOrders.selectionCircle;

  return circle;
}