import * as satellite from 'satellite.js';
import { radToDeg } from 'three/src/math/MathUtils';

export type IssPass = {
  startTime: Date;
  endTime: Date;
  duration: number;
  maxElevation: number;
  latitude: number;
  longitude: number;
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
    const step = 60;  // Intervalle de 60 secondes pour les prédictions

    const passes: IssPass[] = [];
    let passInProgress = false;
    let passStartTime = null;
    let maxElevation = 0;

    for (let time = currentDate; time <= endDate; time = new Date(time.getTime() + step * 1000)) {
      const positionAndVelocity = satellite.propagate(satrec, time);
      const positionEci = positionAndVelocity.position;

      if (positionEci) {
        const gmst = satellite.gstime(time);
        if (!positionAndVelocity) return [];
        if (!positionAndVelocity.position) return [];
        if (typeof positionAndVelocity.position === 'boolean') return [];

        const positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
        const { longitude: passLon, latitude: passLat } = positionGd;

        // Vérifier si l'ISS est visible (élévation > 0)
        const lookAngles = satellite.ecfToLookAngles(observerGd, satellite.eciToEcf(positionAndVelocity.position, gmst));

        if (lookAngles.elevation > 0) {
          if (!passInProgress) {
            // Début d'un nouveau passage
            passInProgress = true;
            passStartTime = time;
            maxElevation = lookAngles.elevation;
          } else {
            // Passage en cours, vérifier si l'élévation est la plus élevée observée
            if (lookAngles.elevation > maxElevation) {
              maxElevation = lookAngles.elevation;
            }
          }
        } else if (passInProgress) {
          // Fin d'un passage
          passInProgress = false;
          const passEndTime = time;
          const duration = (passEndTime.getTime() - passStartTime!.getTime()) / 1000; // Durée en secondes

          passes.push({
            startTime: passStartTime!,
            endTime: passEndTime,
            duration: duration,  // Durée en secondes
            maxElevation: radToDeg(maxElevation),  // Élévation maximale en degrés
            latitude: satellite.degreesToRadians(passLat),
            longitude: satellite.degreesToRadians(passLon),
          });
        }
      }
    }

    return passes;
  } catch (error) {
    console.error("Erreur lors de la récupération des prochains passages : ", error);
    return [];
  }
};
