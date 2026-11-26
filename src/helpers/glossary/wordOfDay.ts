// Nombre de jours écoulés depuis l'epoch Unix — stable quel que soit le fuseau/l'heure dans la
// journée (contrairement à `date.getDate()`, qui recommence à 1 chaque mois).
const daysSinceEpoch = (date: Date): number => Math.floor(date.getTime() / 86400000);

// "Mot du jour" DÉTERMINISTE, pas tiré au hasard (demande explicite) : même terme pour tout le monde
// un jour donné (calculé uniquement à partir de la date), qui change chaque jour et boucle sur
// l'ensemble des entrées au lieu de risquer des répétitions proches comme un vrai tirage aléatoire.
// Générique (pas typé `GlossaryEntryConfig[]`) : l'écran l'appelle sur les entrées déjà résolues
// (avec leur texte traduit), pas sur la config brute.
export const getWordOfTheDay = <T>(entries: T[], date: Date = new Date()): T =>
  entries[daysSinceEpoch(date) % entries.length];
