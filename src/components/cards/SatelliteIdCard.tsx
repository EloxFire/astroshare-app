import { i18n } from "../../helpers/scripts/i18n"
import { satelliteIdCardStyles } from "../../styles/components/cards/SatelliteIdCard"
import { Satellite } from "../../helpers/types/satellites/Satellite"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { app_colors } from "../../helpers/constants"

export const SatelliteIdCard = ({sat, onClick, active}: {sat: Satellite, onClick: () => void, active: boolean}) => {
  return (
    <TouchableOpacity onPress={onClick} style={[satelliteIdCardStyles.card, active ? {borderColor: app_colors.yellow} : {}]}>
      <View style={satelliteIdCardStyles.card.conditions}>
        {
          sat.object_type === 'PAY' && <Image style={satelliteIdCardStyles.card.conditions.icon} source={require('../../../assets/icons/FiPayload.png')}/>
        }
        {
          sat.object_type === 'R/B' && <Image style={satelliteIdCardStyles.card.conditions.icon} source={require('../../../assets/icons/FiStarship.png')}/>
        }
        {
          (sat.object_type === 'DEB' || sat.object_type === 'UNK') && <Image style={satelliteIdCardStyles.card.conditions.icon} source={require('../../../assets/icons/FiCrewCapsule.png')}/>
        }
        <View style={satelliteIdCardStyles.card.infos}>
          {/* <View style={satelliteIdCardStyles.column}>
            <Text style={satelliteIdCardStyles.column.title}>{i18n.t('satelliteTrackers.addSatellite.satCard.titles.type')}</Text>
            <Text style={satelliteIdCardStyles.column.value}>{i18n.t(`satelliteTrackers.addSatellite.satCard.values.${sat.object_type}`)}</Text>
          </View> */}

          <View style={[satelliteIdCardStyles.column, {width: '60%'}]}>
            <Text style={satelliteIdCardStyles.column.title}>{i18n.t('satelliteTrackers.addSatellite.satCard.titles.name')}</Text>
            {/* <Text style={satelliteIdCardStyles.column.value}>{sat.object_name.length >= 10 ? (sat.object_name.substring(0, 10)) + "..." : sat.object_name}</Text> */}
            <Text style={satelliteIdCardStyles.column.value}>{sat.object_name}</Text>
          </View>

          {/* <View style={satelliteIdCardStyles.column}>
            <Text style={satelliteIdCardStyles.column.title}>{i18n.t('satelliteTrackers.addSatellite.satCard.titles.noradId')}</Text>
            <Text style={satelliteIdCardStyles.column.value}>{sat.norad_id}</Text>
          </View> */}


          <View style={satelliteIdCardStyles.column}>
            <Text style={satelliteIdCardStyles.column.title}>{i18n.t('satelliteTrackers.addSatellite.satCard.titles.status')}</Text>
            <Text style={satelliteIdCardStyles.column.value}>{i18n.t(`satelliteTrackers.addSatellite.satCard.values.${sat.ops_status}`)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}