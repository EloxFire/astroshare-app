export const solarWeatherTranslations = {
  disclaimer: "Due to technical issues on the SDO server, live images are using a backup data source, operating in degraded mode. Videos are not available. NASA teams are working to resolve the issue.",
  containers: {
    ephemerids: {
      title: "Solar ephemeris",
      subtitle: "Position and apparent size of the Sun",
    },
    instrument: "Instrument : %{currentImageFilter}",
    emc: "Coronal Mass Ejections (CME)",
    sunspots: "Sunspots (Active Regions)",
    zone: "Study zone : %{zone}",
    northenAurora: "Northern Aurora forecast",
    southernAurora: "Southern Aurora forecast",
    kpIndexes: "KP Indexes",
    solarWinds: "Solar Winds",
    solarActivity: "Solar Activity",
    switches: {
      image: "Image",
      video: "Video"
    },
    disclaimer: "Backup data, degraded mode operation"
  },
  sources: {
    sdoSoho: "Source: NASA & ESA SOHO (Solar and Heliospheric Observatory)",
    soho: "Source: NASA / SoHO (Solar and Heliospheric Observatory)",
    noaa: "Source: NOAA Space Weather Prediction Center",
    kpNotice: "The following times are in UTC",
    kpExplanation: "This graph shows 3-hour bins. It updates every 3 hours.",
  },
  solarWinds: {
    speed: "Speed (Km/h)",
    density: "Density (p/cm³)",
    temperature: "Temperature (°K)",
  },
  studyZones: {
    HMI_IC: "Sun in Visible Light",
    AIA_193: "Solar Corona",
    AIA_304: "Solar Filaments",
    AIA_171: "Coronal Loops",
    AIA_131: "Solar Flares",
    AIA_335: "Active Regions",
    AIA_1600: "Magnetic Fields",
    HMI_CONTINUUM: "Sun in Visible Light (SOHO)",
    EIT_195: "Solar Corona (SOHO)",
    EIT_284: "Active Regions (SOHO)",
    EIT_171: "Coronal Loops (SOHO)",
    EIT_304: "Solar Filaments (SOHO)",
  }
}
