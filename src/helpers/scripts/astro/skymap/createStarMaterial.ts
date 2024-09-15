import ExpoTHREE from "expo-three";
import * as THREE from "three";
import { Star } from "../../../types/Star";

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}

export const createStarMaterial = (star: Star) => {
  const coeff_profondeur = 0.71; //coefficient appliqué au calcul de la distance des étoiles en fonction de leur magnitude (très sensible!!)
  const distance = 1000; //distance d'affichage d'une étoile de magnitude 0 dans l'environement 3D
  const star_size = 25; //taille des étoiles, ajusté pour que le rendu soit le plus réaliste possible realtif à la vision humaine

  const star_type = star.sp_type ? star.sp_type[0] : 'A'; //récupération de la première lettre du type spectral de l'étoile
  

  switch (star_type) {
    case 'M':
      return new THREE.PointsMaterial({
        //creation du matériau pour les étoiles cat M (rouge)
        map: new ExpoTHREE.TextureLoader().load(require("../../../../../assets/images/planetarium/stars/M.png")), //texture des étoiles rouges (cat M)
        color: "white", //blanc = 100%% visible
        vertexColors: false, //si on passe sur true les étoiles deviennent noir!
        size: star_size, //la taille du point, taille effective des étoiles
        sizeAttenuation: true, //la taille de l'étoile dépend du FOV (les étoiles sont quasi invisible sinon)
        transparent: true, //permet à la couche alpha de la texture de fonctionner
        blending: THREE.NormalBlending, //méthode de calcul des couleurs et de la couche alpha pour le rendu, par défaut=normal (les autres à tester?)
        depthTest: false, // ????? J'y touche pas ça marche Insh
        opacity: mapRange(star.V, -2, 6 ,1 , 0.1),
      });
      case 'K':
        return new THREE.PointsMaterial({
          map: new ExpoTHREE.TextureLoader().load(require("../../../../../assets/images/planetarium/stars/K.png")),
          color: "white",
          vertexColors: false,
          size: star_size,
          sizeAttenuation: true,
          transparent: true,
          blending: THREE.NormalBlending,
          depthTest: false,
          opacity: mapRange(star.V, -2, 6 ,1 , 0.1),
        });
      case 'G':
        return new THREE.PointsMaterial({
          map: new ExpoTHREE.TextureLoader().load(require("../../../../../assets/images/planetarium/stars/G.png")),
          color: "white",
          vertexColors: false,
          size: star_size,
          sizeAttenuation: true,
          transparent: true,
          blending: THREE.NormalBlending,
          depthTest: false,
          opacity: mapRange(star.V, -2, 6 ,1 , 0.1),
        });
      case 'F':
        return new THREE.PointsMaterial({
          map: new ExpoTHREE.TextureLoader().load(require("../../../../../assets/images/planetarium/stars/F.png")),
          color: "white",
          vertexColors: false,
          size: star_size,
          sizeAttenuation: true,
          transparent: true,
          blending: THREE.NormalBlending,
          depthTest: false,
          opacity: mapRange(star.V, -2, 6 ,1 , 0.1),
        });
      case 'A':
        return new THREE.PointsMaterial({
          map: new ExpoTHREE.TextureLoader().load(require("../../../../../assets/images/planetarium/stars/A.png")),
          color: "white",
          vertexColors: false,
          size: star_size,
          sizeAttenuation: true,
          transparent: true,
          blending: THREE.NormalBlending,
          depthTest: false,
          opacity: mapRange(star.V, -2, 6 ,1 , 0.1),
        });
      case 'B':
        return new THREE.PointsMaterial({
          map: new ExpoTHREE.TextureLoader().load(require("../../../../../assets/images/planetarium/stars/B.png")),
          color: "white",
          vertexColors: false,
          size: star_size,
          sizeAttenuation: true,
          transparent: true,
          blending: THREE.NormalBlending,
          depthTest: false,
          opacity: mapRange(star.V, -2, 6 ,1 , 0.1),
        });
      case 'O':
        return new THREE.PointsMaterial({
          map: new ExpoTHREE.TextureLoader().load(require("../../../../../assets/images/planetarium/stars/O.png")),
          color: "white",
          vertexColors: false,
          size: star_size,
          sizeAttenuation: true,
          transparent: true,
          blending: THREE.NormalBlending,
          depthTest: false,
          opacity: mapRange(star.V, -2, 6 ,1 , 0.1),
        });
        default:
          return new THREE.PointsMaterial({
            map: new ExpoTHREE.TextureLoader().load(require("../../../../../assets/images/planetarium/stars/A.png")),
            color: "white",
            vertexColors: false,
            size: star_size,
            sizeAttenuation: true,
            transparent: true,
            blending: THREE.NormalBlending,
            depthTest: false,
            opacity: mapRange(star.V, -2, 6 ,1 , 0.1),
          });
  }
}