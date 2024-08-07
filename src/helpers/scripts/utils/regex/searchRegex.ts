const planetRegex = /\b[Pp][Ll][Aa][Nn][EeÉé][Tt][Ee]?[Ss]?\b/g;
const solarSystemRegex = /\b[Ss][Oo][Ll][Aa][Rr][\s-]?[Ss][Yy][Ss][Tt][Ee][Mm][Ee]?[Ss]?\b|\b[Ss][Yy][Ss][Tt][Ee][Mm][Ee]?[Ss]?\s+[Ss][Oo][Ll][Aa][Ii][Rr][Ee]?[Ss]?\b/g;
const systemRegex = /\b[Ss][Yy][Ss][Tt][Ee][Mm][Ee]?[Ss]?\b/g;
const solarRegex = /\b[Ss][Oo][Ll][Aa][Rr][Ee]?[Ss]?\b/g;


const mercuryRegex = /\b[Mm][Ee][Rr][Cc][Uu][Rr][Yy]?[Ee]?[Ss]?\b/g;
const venusRegex = /\b[Vv][Ee][Nn][Uu][Ss][Uu]?[Ss]?\b/g;
const earthRegex = /\b[Ee][Aa]?[Rr]?[Tt]?[Hh]?\b|\b[Tt][Ee][Rr][Rr][Ee]?[Ss]?\b/g;
const marsRegex = /\b[Mm][Aa][Rr][Ss][Uu]?[Ss]?\b/g;
const jupiterRegex = /\b[Jj][Uu][Pp][Ee][Rr][Tt][Uu]?[Ss]?\b/g;
const saturnRegex = /\b[Ss][Aa][Tt][Uu][Rr][Nn][Uu]?[Ss]?\b/g;
const uranusRegex = /\b[Uu][Rr][Aa][Nn][Uu][Ss][Uu]?[Ss]?\b/g;
const neptuneRegex = /\b[Nn][Ee][Pp][Tt][Uu][Nn][Ee]?[Ss]?\b/g;
const plutoRegex = /\b[Pp][Ll][Uu][Tt][Oo]?[Ss]?\b/g;

export const solarSystemRegexes = [planetRegex,solarSystemRegex, systemRegex, solarRegex]
export const planetNamesRegexes = [mercuryRegex, venusRegex, earthRegex, marsRegex, jupiterRegex, saturnRegex, uranusRegex, neptuneRegex, plutoRegex]