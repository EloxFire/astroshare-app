// Liste statique des fuseaux IANA, plutôt que Intl.supportedValuesOf("timeZone") : cette
// API est récente (ES2022) et son support sur Hermes (moteur JS de React Native) n'est pas
// garanti selon la version/plateforme — une liste embarquée fonctionne partout, sans dépendre
// du support ICU du moteur JS.
export const ALL_TIMEZONES: string[] = [
  "UTC",

  // Afrique
  "Africa/Abidjan", "Africa/Accra", "Africa/Algiers", "Africa/Cairo", "Africa/Casablanca",
  "Africa/Dakar", "Africa/Johannesburg", "Africa/Khartoum", "Africa/Lagos", "Africa/Nairobi",
  "Africa/Tunis",

  // Amériques
  "America/Anchorage", "America/Argentina/Buenos_Aires", "America/Bogota", "America/Chicago",
  "America/Denver", "America/Halifax", "America/Lima", "America/Los_Angeles", "America/Mexico_City",
  "America/New_York", "America/Santiago", "America/Sao_Paulo", "America/Toronto", "America/Vancouver",

  // Antarctique
  "Antarctica/McMurdo",

  // Asie
  "Asia/Bangkok", "Asia/Dhaka", "Asia/Dubai", "Asia/Hong_Kong", "Asia/Istanbul",
  "Asia/Jakarta", "Asia/Jerusalem", "Asia/Karachi", "Asia/Kolkata", "Asia/Kuala_Lumpur",
  "Asia/Manila", "Asia/Riyadh", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore",
  "Asia/Taipei", "Asia/Tehran", "Asia/Tokyo",

  // Atlantique
  "Atlantic/Azores", "Atlantic/Canary", "Atlantic/Reykjavik",

  // Australie / Pacifique
  "Australia/Adelaide", "Australia/Brisbane", "Australia/Melbourne", "Australia/Perth", "Australia/Sydney",
  "Pacific/Auckland", "Pacific/Fiji", "Pacific/Honolulu", "Pacific/Tahiti",

  // Europe
  "Europe/Amsterdam", "Europe/Athens", "Europe/Berlin", "Europe/Brussels", "Europe/Bucharest",
  "Europe/Budapest", "Europe/Copenhagen", "Europe/Dublin", "Europe/Helsinki", "Europe/Lisbon",
  "Europe/London", "Europe/Madrid", "Europe/Moscow", "Europe/Oslo", "Europe/Paris",
  "Europe/Prague", "Europe/Rome", "Europe/Stockholm", "Europe/Vienna", "Europe/Warsaw",
  "Europe/Zurich",

  // Océan Indien
  "Indian/Maldives", "Indian/Reunion",
];
