import {DSO} from "./types/DSO";

export const app_colors = {
  black: '#000000',
  black_modal: 'rgba(0,0,0,0.90)',
  black_skymap: 'rgba(0,0,0,0.70)',
  black_eighty: '#00000080',
  black_sixty: '#00000060',
  black_forty: '#00000040',
  black_twenty: '#00000020',
  black_ten: '#00000010',
  white: '#FFFFFF',
  white_no_opacity: '#FFFFFF0D',
  white_twenty: '#FFFFFF20',
  white_forty: '#FFFFFF40',
  white_sixty: '#FFFFFF60',
  white_eighty: '#FFFFFF80',
  grey: '#0F0F0F',
  lightgrey: '#cccccc',
  red: '#FF0000',
  red_twenty: '#FF000020',
  red_forty: '#FF000040',
  red_sixty: '#FF000060',
  red_eighty: '#FF000080',
  green: '#00FF00',
  green_forty: '#00FF0040',
  green_sixty: '#00FF0060',
  green_eighty: '#00FF0080',
  turquoise: '#488f9d',
  turquoise_sixty: '#488f9d60',
  yellow: '#F4C238',
  yellow_forty: '#F4C23840',
  yellow_sixty: '#F4C23860',
  yellow_eighty: '#F4C23880',
  orange: '#FFA500',
  orange_forty: '#FFA50040',
  orange_sixty: '#FFA50060',
  orange_eighty: '#FFA50080',
  darkorange: '#FF8C00',
  darkorange_forty: '#FF8C0040',
  darkorange_sixty: '#FF8C0060',
  darkorange_eighty: '#FF8C0080',
  violet: '#8A2BE2',
  violet_forty: '#8A2BE240',
  violet_sixty: '#8A2BE260',
  violet_eighty: '#8A2BE280',
  gold: '#D2AF26',
  gold_eighty: '#D2AF2680',
  blue: '#061e92',
  blue_eighty: '#061e9280',
  blue_sixty: '#061e9260',
  blue_forty: '#061e9240',
  blue_twenty: '#061e9220',
  warning: '#FFA500',
  warning_forty: '#FFA50040',
}

export const hex_colors = {
  blue: 0x061e92,
  violet: 0x8A2BE2,
}

export const Polaris = {
  ra: 37.954560670189856,
  dec: 89.26410897,
}

export const storageKeys = {
  firstLaunch: 'firstLaunch',
  viewPoints: 'viewPoints',
  hasChangedCurrentSpotElevation: 'hasChangedCurrentSpotElevation',
  hasAddedSpot: 'hasAddedSpot',
  selectedSpot: 'selectedSpot',
  favouriteObjects: 'favouriteObjects',
  favouritePlanets: 'favouritePlanets',
  favouriteStars: 'favouriteStars',
  homeWidgets: 'selectedHomeWidget',
  launches: {
    lastUpdate: 'launchesLastUpdate',
    data: 'launchesData',
  },
  notificationsId: 'notificationsId',
  notifications: {
    satellitePrefix: 'notification_satellite_',
    issPassPrefix: 'notification_isspass_',
    celestialObjectVisibilityPrefix: 'notification_objectvisibility_',
  },
  pushToken: 'pushToken',
  issPasses: 'issPasses', // TODO: cleanup old key
  satellites: {
    customNoradList: 'customNoradList',
    satellitePasses: 'satellitePasses',
  },
  auth: {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    user: 'user',
  },
  analytics: {
    sessionId: 'sessionId',
    base: "analyticsBase"
  },
  updates: {
    upgradeAvailable: 'upgradeAvailable',
    userSkippedVersion: 'userSkippedVersion',
    lastAvailableVersion: 'lastAvailableVersion',
  },
  hiddenPremiumAccess: 'hasHiddenPremiumAccess',
  homeNewsBannerVisible: 'homeNewsBannerVisible',
}

export const geomagneticStormLevelsLongLabels = {
  G0: 'G0 - Aucune tempête',
  G1: 'G1 - Tempête mineure',
  G2: 'G2 - Tempête modérée',
  G3: 'G3 - Tempête forte',
  G4: 'G4 - Tempête sévère',
  G5: 'G5 - Tempête extrême',
}

export const geomagneticStormLevelsShortLabels = {
  G0: 'G0',
  G1: 'G1',
  G2: 'G2',
  G3: 'G3',
  G4: 'G4',
  G5: 'G5',
}

export const geomagneticStormLevelsColors = {
  G0: app_colors.green,
  G1: app_colors.yellow,
  G2: app_colors.orange,
  G3: app_colors.darkorange,
  G4: app_colors.red,
  G5: app_colors.violet,
}

export const firebaseCollections = {
  categories: "Categories",
  resources: "Resources",
  gallery: "Gallery",
}

export const planetTextures: any = {
  'MERCURY': "https://i.postimg.cc/YSJYM5Q6/mercury.png",
  'VENUS': "https://i.postimg.cc/c4Z7KG2T/venus.png",
  'EARTH': "https://i.postimg.cc/vBFgpWdX/earth.png",
  'MARS': "https://i.postimg.cc/25qnpkLj/mars.png",
  'JUPITER': "https://i.postimg.cc/7ZZgVMx2/jupiter.png",
  'SATURN': "https://i.postimg.cc/15HGwYZS/saturn.png",
  'URANUS': "https://i.postimg.cc/pdn5Gs3p/uranus.png",
  'NEPTUNE': "https://i.postimg.cc/zDTSXGtV/neptune.png",
  'MOON_NORMAL': "https://i.postimg.cc/VNyk6mHk/moon-normals.png",
  'MOON': "https://i.postimg.cc/mgp76zD6/lune.png"
}

export const sunImagesSrcWavelengths = {
  'HMI_IC': 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_HMIIC.jpg',
  'AIA_193': 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0193.jpg',
  'AIA_304': 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0304.jpg',
  'AIA_171': 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0171.jpg',
  'AIA_131': 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0131.jpg',
  'AIA_335': 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0335.jpg',
  'AIA_1600': 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_1600.jpg',
}

export const sunImagesSrcWavelengthsBackup = {
  'HMI_CONTINUUM': 'https://soho.nascom.nasa.gov/data/realtime/hmi_igr/1024/latest.jpg',
  'EIT_195': 'https://soho.nascom.nasa.gov/data/realtime/eit_195/1024/latest.jpg',
  'EIT_284': 'https://soho.nascom.nasa.gov/data/realtime/eit_284/1024/latest.jpg',
  'EIT_171': 'https://soho.nascom.nasa.gov/data/realtime/eit_171/1024/latest.jpg',
  'EIT_304': 'https://soho.nascom.nasa.gov/data/realtime/eit_304/1024/latest.jpg',
}

export const sunVideoSrcWavelengths = {
  'HMI_IC': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_512_HMIIC.mp4',
  'AIA_193': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_512_0193.mp4',
  'AIA_304': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_512_0304.mp4',
  'AIA_171': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_512_0171.mp4',
  'AIA_131': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_512_0131.mp4',
  'AIA_335': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_512_0335.mp4',
  'AIA_1600': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_512_1600.mp4',
}

export const sunVideoSrcWavelengthsBackup = {
  'HMI_CONTINUUM': 'https://soho.nascom.nasa.gov/data/LATEST/current_hmiigrsmall.mp4',
  'EIT_195': 'https://soho.nascom.nasa.gov/data/LATEST/current_eit195small.mp4',
  'EIT_284': 'https://soho.nascom.nasa.gov/data/LATEST/current_eit284small.mp4',
  'EIT_171': 'https://soho.nascom.nasa.gov/data/LATEST/current_eit171small.mp4',
  'EIT_304': 'https://soho.nascom.nasa.gov/data/LATEST/current_eit304small.mp4',
}


export const cmeImageSrc = {
  'C2': 'https://soho.nascom.nasa.gov/data/realtime/c2/512/latest.jpg',
  'C3': 'https://soho.nascom.nasa.gov/data/realtime/c3/512/latest.jpg',
}

export const cmeVideoSrc = {
  'C2': 'https://soho.nascom.nasa.gov/data/LATEST/current_c2small.mp4',
  'C3': 'https://soho.nascom.nasa.gov/data/LATEST/current_c3small.mp4',
}

export const cmeImageDescription = {
  'C2': 'Courone intérieure',
  'C3': 'Champ large (32 diamètres solaires)',
}

export const sampleDSO: DSO = {
  "name": "NGC1976",
  "type": "Cl+N",
  "ra": "05:35:16.48",
  "dec": "-05:23:22.8",
  "const": "Ori",
  "maj_ax": 90,
  "min_ax": 60,
  "pos_ang": "",
  "b_mag": 4,
  "v_mag": 4,
  "j_mag": "",
  "h_mag": "",
  "k_mag": "",
  "surf_br": "",
  "hubble": "",
  "pax": "",
  "pm_ra": 1.67,
  "pm_dec": -0.3,
  "rad_vel": 28,
  "redshift": 0.000093,
  "cstar_u_mag": "",
  "cstar_b_mag": "",
  "cstar_v_mag": "",
  "m": 42,
  "ngc": "",
  "ic": "",
  "cstar_name": "",
  "identifiers": "LBN 974,MWSC 0582",
  "common_names": "Great Orion Nebula,Orion Nebula",
  "ned_notes": "",
  "open_ngc_notes": "",
  "sources": "Type:1|RA:1|Dec:1|Const:99|MajAx:9|MinAx:9|B-Mag:3|V-Mag:10|Pm-RA:2|Pm-Dec:2|RadVel:2|Redshift:2",
  "image_url": "https://i.postimg.cc/y8W7ZH89/m42.png",
  "distance": "",
  "dist_unit": "",
  "dimensions": "",
  "discovered_by": "",
  "discovery_year": "",
  "apparent_size": "",
  "age": ""
}

export const solarEclipseTypes: any = {
  'NonCentralPartialEclipse': "Éclipse partielle",
  'NonCentralHybridEclipse': "Éclipse totale ou annulaire",
  'NonCentralTotalEclipse': "Éclipse totale",
  'NonCentralAnnularEclipse': "Éclipse annulaire",
  'CentralHybridEclipse': "Éclipse totale ou annulaire",
  'CentralTotalEclipse': "Éclipse totale",
  'CentralAnnularEclipse': "Éclipse annulaire",
  'ObserverPartialEclipse': "Éclipse partielle",
  'ObserverTotalEclipse': "Éclipse totale",
  'ObserverAnnularEclipse': "Éclipse annulaire",
}

export const solarEclipseVisibilityLinesColors: any = {
  'beginSunRise': app_colors.green,
  'endSunSet': app_colors.red,
  'beginSunSet': app_colors.red,
  'endSunRise': app_colors.green,
  'limitSouth': app_colors.yellow,
  'limitNorth': app_colors.yellow,
  'maximumSunRise': app_colors.orange,
  'maximumSunSet': app_colors.orange,
}