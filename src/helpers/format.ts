// Insère une espace tous les 3 chiffres (ex: 384 400 → "384 400") — utilisé pour l'affichage
// de grandes distances (ex: distance Terre-Lune en km).
export const formatWithSpaces = (value: number): string => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
