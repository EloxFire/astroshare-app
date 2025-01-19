
export const app_colors = {
  black: '#000000',
  black_modal: 'rgba(0,0,0,0.90)',
  black_skymap: 'rgba(0,0,0,0.92)',
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
  yellow: '#FFFF00',
  yellow_forty: '#FFFF0040',
  yellow_sixty: '#FFFF0060',
  yellow_eighty: '#FFFF0080',
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
  blue_twenty: '##061e9220',
  warning: '#FFA500',
}

export const Polaris = {
  ra: "03:01:03.6",
  dec: "+89:40:50.4",
}

export const storageKeys = {
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
  pushToken: 'pushToken',
  issPasses: 'issPasses',
  auth: {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    user: 'user',
  }
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
  ressources: "Ressources",
  gallery: "Gallery",
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

export const sunVideoSrcWavelengths = {
  'HMI_IC': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_512_HMIIC.mp4',
  'AIA_193': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_512_0193.mp4',
  'AIA_304': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_512_0304.mp4',
  'AIA_171': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_512_0171.mp4',
  'AIA_131': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_512_0131.mp4',
  'AIA_335': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_512_0335.mp4',
  'AIA_1600': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_512_1600.mp4',
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
