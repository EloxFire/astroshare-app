import * as satellite from 'satellite.js';
import { radToDeg } from 'three/src/math/MathUtils';

export type IssPass = {
  startTime: Date;
  endTime: Date;
  duration: number;
  maxElevation: number;
  startElevation: number;
  endElevation: number;
  startAzimuth: number;
  startDirectionCardinal: string;
  endAzimuth: number;
  endDirectionCardinal: string;
  trajectory: { latitude: number; longitude: number; }[];
}

export const getNextIssPasses = (latitude: number, longitude: number, altitude: number, tle: string[]): IssPass[] => {
  try {
    const satrec = satellite.twoline2satrec(tle[0], tle[1]);
    const observerGd = {
      latitude: satellite.degreesToRadians(latitude),
      longitude: satellite.degreesToRadians(longitude),
      height: altitude / 1000,
    };

    const currentDate = new Date();
    const endDate = new Date(currentDate.getTime() + 360 * 60 * 60 * 1000);
    const step = 1;  // Intervalle de 1 seconde pour améliorer la précision

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
      if (!positionAndVelocity.position) continue;

      const gmst = satellite.gstime(time);
      const positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
      const lookAngles = satellite.ecfToLookAngles(observerGd, satellite.eciToEcf(positionAndVelocity.position, gmst));

      const currentElevation = radToDeg(lookAngles.elevation);
      const currentAzimuth = radToDeg(lookAngles.azimuth);

      if (currentElevation > 0) {
        if (!passInProgress) {
          // Début d'un nouveau passage
          passInProgress = true;
          passStartTime = time;
          maxElevation = currentElevation;
          startElevation = currentElevation;
          startAzimuth = currentAzimuth;
        } else {
          // Passage en cours, mettre à jour l'élévation maximale
          if (currentElevation > maxElevation) {
            maxElevation = currentElevation;
          }
          endElevation = currentElevation;
        }

        // Ajouter la position courante à la trajectoire visible
        trajectory.push({
          latitude: radToDeg(positionGd.latitude),
          longitude: radToDeg(positionGd.longitude),
        });
      } else if (passInProgress) {
        // Fin d'un passage
        passInProgress = false;
        endAzimuth = currentAzimuth;
        const passEndTime = time;
        const duration = (passEndTime.getTime() - passStartTime!.getTime()) / 1000;

        passes.push({
          startTime: passStartTime!,
          endTime: passEndTime,
          duration: duration,
          maxElevation: maxElevation,
          startElevation: startElevation,
          endElevation: endElevation,
          startAzimuth: startAzimuth,
          startDirectionCardinal: getCardinalDirection(startAzimuth),
          endAzimuth: endAzimuth,
          endDirectionCardinal: getCardinalDirection(endAzimuth),
          trajectory: [...trajectory],
        });

        // Réinitialiser les valeurs pour le prochain passage
        trajectory.length = 0;
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
