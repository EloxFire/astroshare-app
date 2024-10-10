const planetRegex = /\b[Pp][Ll][Aa][Nn][EeÉé][Tt][Ee]?[Ss]?\b/g;
const solarSystemRegex = /\b[Ss][Oo][Ll][Aa][Rr][\s-]?[Ss][Yy][Ss][Tt][Ee][Mm][Ee]?[Ss]?\b|\b[Ss][Yy][Ss][Tt][Ee][Mm][Ee]?[Ss]?\s+[Ss][Oo][Ll][Aa][Ii][Rr][Ee]?[Ss]?\b/g;
const systemRegex = /\b[Ss][Yy][Ss][Tt][Ee][Mm][Ee]?[Ss]?\b/g;
const solarRegex = /\b[Ss][Oo][Ll][Aa][Rr][Ee]?[Ss]?\b/g;
const frenchPlanetsRegex = /\bPlanètes\b/i


export const planetNamesRegexes = /\b(?:Mercury|Mercure|Venus|Vénus|Earth|Terre|Mars|Jupiter|Saturn|Saturne|Uranus|Neptune)\b/i;
export const solarSystemRegexes = [frenchPlanetsRegex, planetRegex,solarSystemRegex, systemRegex, solarRegex]