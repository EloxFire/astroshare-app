export const convertDegreesDecToDMS = (degrees: number): string => {
    // Étape 1 : Déterminer le signe (+ ou -)
    const sign = degrees >= 0 ? "+" : "-";
    
    // Étape 2 : Travailler avec la valeur absolue des degrés
    const absoluteDegrees = Math.abs(degrees);
    
    // Étape 3 : Extraire les degrés
    const deg = Math.floor(absoluteDegrees);
    
    // Étape 4 : Extraire les minutes d'arc
    const minutes = Math.floor((absoluteDegrees - deg) * 60);
    
    // Étape 5 : Extraire les secondes d'arc
    const seconds = Math.round(((absoluteDegrees - deg) * 60 - minutes) * 60);

    // Formatage en chaîne de caractères "±DD:MM:SS"
    const degStr = String(deg).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    return `${sign}${degStr}°${minutesStr}m${secondsStr}s`;
}