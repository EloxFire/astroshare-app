import { scopeAlignmentStyles } from './../styles/screens/scopeAlignment';
export const app_colors = {
  black: '#000000',
  black_forty: '#00000099',
  white: '#FFFFFF',
  white_no_opacity: '#FFFFFF0D',
  white_forty: '#FFFFFF40',
  white_sixty: '#FFFFFF60',
  white_eighty: '#FFFFFF80',
  grey: '#0F0F0F',
  red: '#FF0000',
  red_twenty: '#FF000020',
  red_forty: '#FF000040',
  red_sixty: '#FF000060',
  red_eighty: '#FF000080',
  green: '#00FF00',
  green_forty: '#00FF0040',
  green_sixty: '#00FF0060',
  green_eighty: '#00FF0080',
}

export const Polaris = {
  ra: "03:01:03.6",
  dec: "+89:40:50.4",
}

export const moonPhases: any = {
  "New": 'Nouvelle Lune',
  "Waxing Crescent": 'Premier Croissant',
  "First Quarter": 'Premier Quartier',
  "Waxing Gibbous": 'Gibbeuse Croissante',
  "Full": 'Pleine Lune',
  "Waning Gibbous": 'Gibbeuse Décroissante',
  "Last Quarter": 'Dernier Quartier',
  "Waning Crescent": 'Dernier Croissant',
}

export const storageKeys = {
  viewPoints: 'viewPoints',
  hasChangedCurrentSpotElevation: 'hasChangedCurrentSpotElevation',
  hasAddedSpot: 'hasAddedSpot',
  selectedSpot: 'selectedSpot',
}

export const sunImagesSrcWavelengths = {
  'HMI_IC': 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_HMIIC.jpg',
  'AIA_193': 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0193.jpg',
  'AIA_304': 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0304.jpg',
  'AIA_171': 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0171.jpg',
  'AIA_131': 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0131.jpg',
  'AIA_335': 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0335.jpg',
  'AIA_1600': 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_1600.jpg',
}

export const sunVideoSrcWavelengths = {
  'HMI_IC': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_1024_HMIIC.mp4',
  'AIA_193': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_1024_0193.mp4',
  'AIA_304': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_1024_0304.mp4',
  'AIA_171': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_1024_0171.mp4',
  'AIA_131': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_1024_0131.mp4',
  'AIA_335': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_1024_0335.mp4',
  'AIA_1600': 'https://sdo.gsfc.nasa.gov/assets/img/latest/mpeg/latest_1024_1600.mp4',
}

export const sunIMageFiltersDescription = {
  'HMI_IC': 'Soleil en lumière visible',
  'AIA_193': 'Couronne solaire',
  'AIA_304': 'Filaments solaires',
  'AIA_171': 'Boucles coronales',
  'AIA_131': 'Éruptions solaires',
  'AIA_335': 'Régions actives',
  'AIA_1600': 'Champs magnétiques',
}

export const cmeImageSrc = {
  'C2': 'https://soho.nascom.nasa.gov/data/realtime/c2/1024/latest.jpg',
  'C3': 'https://soho.nascom.nasa.gov/data/realtime/c3/1024/latest.jpg',
}

export const cmeVideoSrc = {
  'C2': 'https://soho.nascom.nasa.gov/data/LATEST/current_c2small.mp4',
  'C3': 'https://soho.nascom.nasa.gov/data/LATEST/current_c3small.mp4',
}

export const cmeImageDescription = {
  'C2': 'Courone intérieure',
  'C3': 'Champ large (32 diamètres solaires)',
}

export const scopeAlignmentSteps = [
  {
    title: 'Orientation',
    description: 'Utilisez la boussole pour placer le trepried de votre télescope en direction du nord.',
  },
  {
    title: 'Niveau',
    description: 'Assurez-vous que votre télescope est parfaitement horizontal grâce au niveau à bulle.\nPlacez votre téléphone a plat sur le trépied de votre telescope.',
  },
  {
    title: 'Alignement polaire',
    description: 'Installez la monture sur le trépied et alignez votre télescope sur le pôle nord céleste. Polaris doit être visible dans le viseur polaire comme indiqué sur le schéma.',
  }
]
