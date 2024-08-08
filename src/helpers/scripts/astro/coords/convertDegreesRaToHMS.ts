export const convertDegreesRaToHMS = (degrees: number): string => {
    // Étape 1 : Conversion des degrés en heures
    const totalHours = degrees / 15;
    
    // Étape 2 : Extraire les heures
    const hours = Math.floor(totalHours);
    
    // Étape 3 : Extraire les minutes
    const minutes = Math.floor((totalHours - hours) * 60);
    
    // Étape 4 : Extraire les secondes
    const seconds = Math.round(((totalHours - hours) * 60 - minutes) * 60);

    // Formatage en chaîne de caractères "HH:MM:SS"
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    return `${hoursStr}h${minutesStr}m${secondsStr}s`;
}