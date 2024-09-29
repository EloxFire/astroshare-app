import * as satellite from 'satellite.js';
import { radToDeg } from 'three/src/math/MathUtils';

export type IssPass = {
  startTime: Date;
  endTime: Date;
  duration: number;
  maxElevation: number;
  startElevation: number;
  endElevation: number;
  startAzimuth: number; // Direction d'arrivée en degrés
  startDirectionCardinal: string; // Direction cardinale d'arrivée
  endAzimuth: number; // Direction de fin en degrés
  endDirectionCardinal: string; // Direction cardinale de fin
  trajectory: { latitude: number; longitude: number; }[]; // Trajectoire durant le passage visible
  magnitude: number; // Magnitude estimée du passage
}

export const getNextIssPasses = (latitude: number, longitude: number, altitude: number, tle: string[]): IssPass[] => {
  try {
    console.log(tle[0]);

    // Créer l'objet satellite à partir des TLE
    const satrec = satellite.twoline2satrec(tle[0], tle[1]);

    const observerGd = {
      latitude: satellite.degreesToRadians(latitude),
      longitude: satellite.degreesToRadians(longitude),
      height: altitude / 1000,  // Altitude en km
    };

    const currentDate = new Date();
    const endDate = new Date(currentDate.getTime() + 48 * 60 * 60 * 1000);  // 48 heures plus tard
    const step = 10;  // Intervalle réduit à 10 secondes pour plus de précision

    const passes: IssPass[] = [];
    let passInProgress = false;
    let passStartTime = null;
    let maxElevation = 0;
    let startElevation = 0;
    let endElevation = 0;
    let startAzimuth = 0;
    let endAzimuth = 0;
    const trajectory: { latitude: number; longitude: number }[] = [];

    for (let time = currentDate; time <= endDate; time = new Date(time.getTime() + step * 1000)) {
      const positionAndVelocity = satellite.propagate(satrec, time);
      const positionEci = positionAndVelocity.position;

      if (positionEci) {
        const gmst = satellite.gstime(time);
        const positionGd = satellite.eciToGeodetic(positionEci, gmst);
        const { longitude: passLon, latitude: passLat } = positionGd;

        // Vérifier si l'ISS est visible (élévation > 0)
        const lookAngles = satellite.ecfToLookAngles(observerGd, satellite.eciToEcf(positionEci, gmst));

        if (lookAngles.elevation > 0) {
          if (!passInProgress) {
            // Début d'un nouveau passage
            passInProgress = true;
            passStartTime = time;
            maxElevation = lookAngles.elevation;
            startElevation = lookAngles.elevation;
            startAzimuth = radToDeg(lookAngles.azimuth);
          } else {
            // Passage en cours, vérifier si l'élévation est la plus élevée observée
            if (lookAngles.elevation > maxElevation) {
              maxElevation = lookAngles.elevation;
            }
          }
          // Ajouter la position courante à la trajectoire visible
          trajectory.push({
            latitude: radToDeg(passLat),
            longitude: radToDeg(passLon),
          });
        } else if (passInProgress) {
          // Fin d'un passage
          passInProgress = false;
          endElevation = lookAngles.elevation;  // À la fin du passage, l'élévation est proche de 0
          endAzimuth = radToDeg(lookAngles.azimuth);
          const passEndTime = time;
          const duration = (passEndTime.getTime() - passStartTime!.getTime()) / 1000; // Durée en secondes

          // Calcul approximatif de la magnitude
          const magnitude = calculateIssMagnitude(maxElevation);

          passes.push({
            startTime: passStartTime!,
            endTime: passEndTime,
            duration: duration,  // Durée en secondes
            maxElevation: radToDeg(maxElevation),  // Élévation maximale en degrés
            startElevation: radToDeg(startElevation),
            endElevation: radToDeg(endElevation),
            startAzimuth,
            startDirectionCardinal: getCardinalDirection(startAzimuth),
            endAzimuth,
            endDirectionCardinal: getCardinalDirection(endAzimuth),
            trajectory: [...trajectory],
            magnitude,
          });

          // Réinitialiser les valeurs pour le prochain passage
          trajectory.length = 0;
        }
      }
    }

    return passes;
  } catch (error) {
    console.error("Erreur lors de la récupération des prochains passages : ", error);
    return [];
  }
};

// Fonction pour convertir l'azimut en direction cardinale plus détaillée
const getCardinalDirection = (azimuth: number): string => {
  if (azimuth >= 0 && azimuth < 11.25) return 'Nord';
  if (azimuth >= 11.25 && azimuth < 33.75) return 'Nord-Nord-Est';
  if (azimuth >= 33.75 && azimuth < 56.25) return 'Nord-Est';
  if (azimuth >= 56.25 && azimuth < 78.75) return 'Est-Nord-Est';
  if (azimuth >= 78.75 && azimuth < 101.25) return 'Est';
  if (azimuth >= 101.25 && azimuth < 123.75) return 'Est-Sud-Est';
  if (azimuth >= 123.75 && azimuth < 146.25) return 'Sud-Est';
  if (azimuth >= 146.25 && azimuth < 168.75) return 'Sud-Sud-Est';
  if (azimuth >= 168.75 && azimuth < 191.25) return 'Sud';
  if (azimuth >= 191.25 && azimuth < 213.75) return 'Sud-Sud-Ouest';
  if (azimuth >= 213.75 && azimuth < 236.25) return 'Sud-Ouest';
  if (azimuth >= 236.25 && azimuth < 258.75) return 'Ouest-Sud-Ouest';
  if (azimuth >= 258.75 && azimuth < 281.25) return 'Ouest';
  if (azimuth >= 281.25 && azimuth < 303.75) return 'Ouest-Nord-Ouest';
  if (azimuth >= 303.75 && azimuth < 326.25) return 'Nord-Ouest';
  if (azimuth >= 326.25 && azimuth < 348.75) return 'Nord-Nord-Ouest';
  return 'Nord';
};

// Fonction pour calculer une estimation de la magnitude
const calculateIssMagnitude = (maxElevation: number): number => {
  // La magnitude dépend de l'éclairage du soleil et de l'altitude de l'ISS.
  // Ici, on donne une estimation simplifiée en fonction de l'élévation maximale.
  if (maxElevation >= 80) return -3.0; // Très lumineux, comme Vénus
  if (maxElevation >= 60) return -2.5; // Très visible
  if (maxElevation >= 40) return -2.0; // Lumineux
  if (maxElevation >= 20) return -1.5; // Modérément lumineux
  return -1.0; // Faiblement lumineux
};
