import { Camera } from "../../types/gear/Camera";
import { Eyepiece } from "../../types/gear/Eyepiece";
import { Mount } from "../../types/gear/Mount";
import { Telescope } from "../../types/gear/Telescope";
import { i18n } from "../i18n";

export const getGearShortCharacteristicsString = (gear: Telescope | Eyepiece | Mount | Camera) => {
  let characteristicsString = '';

  if(gear.gearType === 'telescope'){
    const telescope = gear as Telescope;
    
    characteristicsString = characteristicsString + `${telescope.diameter}/${telescope.focalLength}`

    if(telescope.construction){
      characteristicsString = characteristicsString + ` - ${i18n.t(`gear.telescopes.constructions.${telescope.construction}`)}`
    }
    
    return characteristicsString + ` - f/${telescope.focalLength / telescope.diameter}`

  }else if(gear.gearType === 'eyepiece'){
    const eyepiece = gear as Eyepiece;

    characteristicsString = characteristicsString + `${eyepiece.focalLength}mm`

    if(eyepiece.apparentFieldOfView){
      characteristicsString = characteristicsString + ` - ${eyepiece.apparentFieldOfView}°`
    }

    if(eyepiece.barrelSize){
      characteristicsString = characteristicsString + ` - ${eyepiece.barrelSize}"`
    }
  }else if(gear.gearType === 'camera'){
    const camera = gear as Camera;

    characteristicsString = characteristicsString + `${i18n.t(`gear.cameras.types.${camera.type}`)}`

    if(camera.resolution){
      characteristicsString = characteristicsString + ` - ${camera.resolution.width}x${camera.resolution.height}`
    }
  }

  return characteristicsString;
}