import type { LunarEclipseType, SolarEclipseType } from "../../types/eclipses/Eclipse";
import type { LunarEclipseVariant, SolarEclipseVariant } from "../../screens/Tools/Eclipses/components/EclipseTypeIcon/EclipseTypeIcon";

// Associe le `type` renvoyé par l'API (ex: "CentralTotalEclipse", "ObserverAnnularEclipse") à l'une
// des 3 variantes visuelles/textuelles — un type hybride est traité comme "total" (depuis la
// plupart des points du tracé, une éclipse hybride est vécue comme une totale), même convention que
// astroshare-public-tools (helpers/eclipseTypeIcon.ts).
const SOLAR_VARIANT_BY_TYPE: Record<string, SolarEclipseVariant> = {
  NonCentralPartialEclipse: "partial",
  ObserverPartialEclipse: "partial",
  NonCentralAnnularEclipse: "annular",
  CentralAnnularEclipse: "annular",
  ObserverAnnularEclipse: "annular",
  NonCentralTotalEclipse: "total",
  CentralTotalEclipse: "total",
  ObserverTotalEclipse: "total",
  NonCentralHybridEclipse: "total",
  CentralHybridEclipse: "total",
};

const LUNAR_VARIANT_BY_TYPE: Record<string, LunarEclipseVariant> = {
  PenumbralEclipse: "penumbral",
  PartialEclipse: "partial",
  TotalEclipse: "total",
};

export const getSolarEclipseVariant = (type: SolarEclipseType): SolarEclipseVariant => SOLAR_VARIANT_BY_TYPE[type] ?? "total";
export const getLunarEclipseVariant = (type: LunarEclipseType): LunarEclipseVariant => LUNAR_VARIANT_BY_TYPE[type] ?? "partial";

// Clé i18n (namespace tools/eclipses) du libellé affiché pour ce type — une seule clé par variante,
// pas par valeur brute de l'API (toutes les variantes "Central*"/"NonCentral*"/"Observer*" total se
// lisent "Éclipse totale", peu importe la centralité).
export const getSolarEclipseTypeLabelKey = (type: SolarEclipseType): string => `types.solar.${getSolarEclipseVariant(type)}`;
export const getLunarEclipseTypeLabelKey = (type: LunarEclipseType): string => `types.lunar.${getLunarEclipseVariant(type)}`;

// Forme courte ("Partielle", pas "Éclipse partielle") utilisée dans l'en-tête des circonstances
// locales — à côté d'une icône et d'un pourcentage, "Éclipse" est redondant.
export const getSolarEclipseShortTypeLabelKey = (type: SolarEclipseType): string => `details.header.type.solar.${getSolarEclipseVariant(type)}`;
export const getLunarEclipseShortTypeLabelKey = (type: LunarEclipseType): string => `details.header.type.lunar.${getLunarEclipseVariant(type)}`;

// L'éclipse est centrale (totale/annulaire/hybride) si son `type` brut le dit — distinct de la
// variante visuelle ci-dessus (qui simplifie hybride → total) : utile pour savoir si une ligne
// centrale/bande de totalité existe côté géométrie (visibilityLines.central, visibilityPaths.umbra).
export const isCentralSolarEclipseType = (type: SolarEclipseType): boolean =>
  typeof type === "string" && (type.startsWith("Central") || type.startsWith("Observer")) && !type.includes("Partial");
