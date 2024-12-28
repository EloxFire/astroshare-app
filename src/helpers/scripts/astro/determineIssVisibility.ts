import {app_colors} from "../../constants";
import {i18n} from "../i18n";
import {getNight} from "@observerly/astrometry";

export const determineIssVisibility = (maxElevation: number, weatherIcon: string, passStart?: number) => {
  const weatherIcons: any = {
    'default': 'clear sky',
    '01d': 'clear sky',
    '01n': 'clear sky',
    '02d': 'few clouds',
    '02n': 'few clouds',
    '03d': 'scattered clouds',
    '03n': 'scattered clouds',
    '04d': 'broken clouds',
    '04n': 'broken clouds',
    '09d': 'shower rain',
    '09n': 'shower rain',
    '10d': 'rain',
    '10n': 'rain',
    '11d': 'thunderstorm',
    '11n': 'thunderstorm',
    '13d': 'snow',
    '13n': 'snow',
    '50d': 'mist',
    '50n': 'mist'
  }

  const weatherCondition = weatherIcons[weatherIcon]

  if(maxElevation < 20){
    return {backgroundColor: app_colors.red, foregroundColor: app_colors.white, text: i18n.t('common.visibility.notVisible')};
  }else if(maxElevation > 20 && (weatherCondition === 'clear sky' || weatherCondition === 'few clouds')){
    return {backgroundColor: app_colors.green, foregroundColor: app_colors.black, text: i18n.t('common.visibility.visible')};
  }else{
    return {backgroundColor: app_colors.warning, foregroundColor: app_colors.black, text: i18n.t('common.visibility.partiallyVisible')};
  }
}