import { showToast } from "../showToast";

export const convertHMSToDegreeFromString = (decString: string | number): number => {
  if (typeof decString === 'number') {
    return decString;
  }

  const numericValue = Number(decString);
  if (Number.isFinite(numericValue)) {
    return numericValue;
  }

  // Expression régulière pour extraire les parties de la chaîne
  const regex = /(\d+)[h:\s]+(\d+)[m:\s]+([\d.]+)s?/i;
  const match = decString.match(regex);

  if (!match) {
    console.log(`[convertHMSToDegreeFromString] Format invalide pour la chaîne : ${decString}`);
    showToast({ message: 'Format D:M:S invalide', type: 'error' });
    return Number.NaN;
  }

  // Extraction des degrés, minutes et secondes à partir de la chaîne
  const hour = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseFloat(match[3]);

  // Conversion des minutes et secondes en degrés décimaux
  const decimalDegree = 15 * (hour + (minutes / 60) + (seconds / 3600));

  // Retourner la valeur positive ou négative en fonction de l'input
  return decimalDegree;
};
