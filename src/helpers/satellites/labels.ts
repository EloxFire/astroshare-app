// `object_type.label`, `ops_status.label` (catalogue NORAD) et `quality` (passages) sont des
// identifiants stables à traduire côté front, pas du texte affichable — voir la doc de l'API.
// Ce sont des unions ouvertes (l'API peut en ajouter), donc chaque valeur inconnue retombe sur
// "unknown" plutôt que d'afficher la clé brute non traduite (même principe que le catalogue
// d'objets, §2 de agents-reference.md).
const KNOWN_OBJECT_TYPES = ["payload", "rocket_body", "debris", "unknown"];
const KNOWN_OPS_STATUSES = [
  "operational",
  "nonoperational",
  "partially_operational",
  "backup_standby",
  "spare",
  "extended_mission",
  "decayed",
  "unknown",
];
const KNOWN_PASS_QUALITIES = ["excellent", "good", "faint"];

export const resolveObjectTypeKey = (label: string): string =>
  KNOWN_OBJECT_TYPES.includes(label) ? label : "unknown";

export const resolveOpsStatusKey = (label: string): string =>
  KNOWN_OPS_STATUSES.includes(label) ? label : "unknown";

export const resolvePassQualityKey = (quality: string): string =>
  KNOWN_PASS_QUALITIES.includes(quality) ? quality : "faint";

// Un statut "opérationnel" (au sens large : actif, veille, mission étendue) justifie un badge vert
// plutôt que neutre/rouge — utilisé pour la pastille de statut de la fiche satellite.
export const isOperationalStatus = (label: string): boolean =>
  ["operational", "partially_operational", "backup_standby", "extended_mission"].includes(label);
