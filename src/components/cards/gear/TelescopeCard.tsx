import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native"
import { telescopeCardStyles } from "../../../styles/components/cards/gear/telescopeCard"
import { Telescope } from "../../../helpers/types/gear/Telescope"
import SimpleBadge from "../../badges/SimpleBadge"
import { app_colors } from "../../../helpers/constants"
import { astroImages } from "../../../helpers/scripts/loadImages"
import DSOValues from "../../commons/DSOValues"

interface TelescopeCardProps {
  telescope: Telescope
  isActive: boolean
}

export const TelescopeCard = ({telescope, isActive}: TelescopeCardProps) => {

  return (
    <TouchableOpacity style={[telescopeCardStyles.card, isActive && {borderColor: app_colors.white, borderWidth: 1}]}>
      <View style={telescopeCardStyles.card.content}>
        <Image source={require('../../../../assets/icons/FiTelescope.png')} style={telescopeCardStyles.card.content.image} />
        <View style={telescopeCardStyles.card.content.body}>
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <Text style={telescopeCardStyles.card.content.body.title}>{telescope.name}</Text>
            {isActive && <SimpleBadge text="Séléctionné" small backgroundColor={app_colors.white} foregroundColor={app_colors.black} />}
          </View>
          <Text style={telescopeCardStyles.card.content.body.subtitle}>{telescope.diameter}/{telescope.focalLength} - {telescope.construction}</Text>
        </View>

        <Image source={require('../../../../assets/icons/FiChevronRight.png')} style={telescopeCardStyles.card.content.icon} />
      </View>
    </TouchableOpacity>
  )
}