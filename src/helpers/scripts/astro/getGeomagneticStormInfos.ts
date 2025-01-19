import {app_colors, geomagneticStormLevelsLongLabels, geomagneticStormLevelsShortLabels} from "../../constants";

export const getGeomagneticStormInfos = (level: number) => {
  if(level < 5) {
    return {
      color: app_colors.green,
      longLabel: geomagneticStormLevelsLongLabels.G0,
      shortLabel: geomagneticStormLevelsShortLabels.G0,
    }
  }else if(level >= 5 && level < 6) {
    return {
      color: app_colors.yellow,
      longLabel: geomagneticStormLevelsLongLabels.G1,
      shortLabel: geomagneticStormLevelsShortLabels.G1,
    }
  }else if(level >= 6 && level < 7) {
    return {
      color: app_colors.orange,
      longLabel: geomagneticStormLevelsLongLabels.G2,
      shortLabel: geomagneticStormLevelsShortLabels.G2,
    }
  } else if(level >= 7 && level < 8) {
    return {
      color: app_colors.darkorange,
      longLabel: geomagneticStormLevelsLongLabels.G3,
      shortLabel: geomagneticStormLevelsShortLabels.G3,
    }
  } else if(level >= 8 && level < 9) {
    return {
      color: app_colors.red,
      longLabel: geomagneticStormLevelsLongLabels.G4,
      shortLabel: geomagneticStormLevelsShortLabels.G4,
    }
  } else {
    return {
      color: app_colors.violet,
      longLabel: geomagneticStormLevelsLongLabels.G5,
      shortLabel: geomagneticStormLevelsShortLabels.G5,
    }
  }
}