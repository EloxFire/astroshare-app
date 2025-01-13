import { showToast } from "../showToast";

export const convertDMSToDegreeFromString = (decString: string): number => {
  // Expression régulière pour extraire les parties de la chaîne
  const regex = /([+-]?\d+):(\d+):([\d.]+)/;
  const match = decString.match(regex);

  if (!match) {
    showToast({ message: 'Format D:M:S invalide', type: 'error' });
    return 0;
  }

  // Extraction des degrés, minutes et secondes à partir de la chaîne
  const degrees = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseFloat(match[3]);

  // Conversion des minutes et secondes en degrés décimaux
  const decimalDegree = Math.abs(degrees) + minutes / 60 + seconds / 3600;

  // Retourner la valeur positive ou négative en fonction de l'input
  return degrees < 0 ? -decimalDegree : decimalDegree;
};