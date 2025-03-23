import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { addSpotModalStyles } from '../../styles/components/modals/addSpotModal'
import { useSpot } from '../../contexts/ObservationSpotContext'
import { showToast } from '../../helpers/scripts/showToast'
import SimpleButton from '../commons/buttons/SimpleButton'
import {app_colors} from "../../helpers/constants";

interface AddSpotModalProps {
  onClose: () => void
}

export default function AddSpotModal({ onClose }: AddSpotModalProps) {

  const { addNewSpot, viewPoints } = useSpot()
  
  const [name, setName] = useState<string>('')
  const [electricity, setElectricity] = useState<boolean>(false)
  const [parking, setParking] = useState<boolean>(false)
  const [shelter, setShelter] = useState<boolean>(false)
  const [tools, setTools] = useState<boolean>(false)
  const [polarView, setPolarView] = useState<boolean>(false)
  const [altitude, setAltitude] = useState<number>(-1)

  const handleAddSpot = () => {
    try {
      addNewSpot({
        title: name !== '' ? name : `Lieu d'observation ${viewPoints.length + 1}`,
        equipments: {
          electricity: electricity,
          parking: parking,
          shelter: shelter,
          tools :tools,
          altitude: altitude === -1 ? '+0m' : `+${altitude}m`,
          polarView: polarView,
        }
      })
      showToast({ message: 'Lieu d\'observation ajouté', type: 'success' })
      onClose()
    } catch (error) {
      showToast({ message: 'Erreur lors de l\'ajout du lieu d\'observation', type: 'error' })
    }
  }

  return (
    <View style={addSpotModalStyles.modal}>
      <View style={addSpotModalStyles.modal.content}>
        <View style={addSpotModalStyles.modal.content.header}>
          <Text style={addSpotModalStyles.modal.content.header.title}>Ajouter un lieu d'observation</Text>
          <TouchableOpacity onPress={onClose}>
            <Image style={addSpotModalStyles.modal.content.header.icon} source={require('../../../assets/icons/FiXCircle.png')} />
          </TouchableOpacity>
        </View>
        {/* <Text style={addSpotModalStyles.modal.content.text}>Quels sont les équipements présents sur ce lieu ainsi que ses détails ?</Text> */}
        
        <View>
          <View style={addSpotModalStyles.modal.content.property}>
            <View style={addSpotModalStyles.modal.content.property.row}>
              <Image source={require('../../../assets/icons/FiViewPoint.png')} style={addSpotModalStyles.modal.content.property.illustration} />
              <Text style={addSpotModalStyles.modal.content.property.text}>Nom du lieu</Text>
            </View>
            <TextInput style={[addSpotModalStyles.modal.content.property.input, {flex: .8}]} placeholderTextColor="#FFFFFF25" placeholder='Ex: La SINNE' keyboardType='default' onChangeText={(text) => setName(text)} />
          </View>
          <View style={addSpotModalStyles.modal.content.property}>
            <View style={addSpotModalStyles.modal.content.property.row}>
              <Image source={require('../../../assets/icons/FiPlug.png')} style={addSpotModalStyles.modal.content.property.illustration} />
              <Text style={addSpotModalStyles.modal.content.property.text}>Electricité</Text>
            </View>
            <TouchableOpacity onPress={() => setElectricity(!electricity)}>
              <Image style={addSpotModalStyles.modal.content.property.icon} source={electricity ? require('../../../assets/icons/FiToggleFilled.png') : require('../../../assets/icons/FiToggleEmpty.png')} />
            </TouchableOpacity>
          </View>
          <View style={addSpotModalStyles.modal.content.property}>
            <View style={addSpotModalStyles.modal.content.property.row}>
              <Image source={require('../../../assets/icons/FiParking.png')} style={addSpotModalStyles.modal.content.property.illustration} />
              <Text style={addSpotModalStyles.modal.content.property.text}>Parking</Text>
            </View>
            <TouchableOpacity onPress={() => setParking(!parking)}>
              <Image style={addSpotModalStyles.modal.content.property.icon} source={parking ? require('../../../assets/icons/FiToggleFilled.png') : require('../../../assets/icons/FiToggleEmpty.png')} />
            </TouchableOpacity>
          </View>
          <View style={addSpotModalStyles.modal.content.property}>
            <View style={addSpotModalStyles.modal.content.property.row}>
              <Image source={require('../../../assets/icons/FiHome.png')} style={addSpotModalStyles.modal.content.property.illustration} />
              <Text style={addSpotModalStyles.modal.content.property.text}>Intérieur</Text>
            </View>
            <TouchableOpacity onPress={() => setShelter(!shelter)}>
              <Image style={addSpotModalStyles.modal.content.property.icon} source={shelter ? require('../../../assets/icons/FiToggleFilled.png') : require('../../../assets/icons/FiToggleEmpty.png')} />
            </TouchableOpacity>
          </View>
          <View style={addSpotModalStyles.modal.content.property}>
            <View style={addSpotModalStyles.modal.content.property.row}>
              <Image source={require('../../../assets/icons/FiTool.png')} style={addSpotModalStyles.modal.content.property.illustration} />
              <Text style={addSpotModalStyles.modal.content.property.text}>Outils</Text>
            </View>
            <TouchableOpacity onPress={() => setTools(!tools)}>
              <Image style={addSpotModalStyles.modal.content.property.icon} source={tools ? require('../../../assets/icons/FiToggleFilled.png') : require('../../../assets/icons/FiToggleEmpty.png')} />
            </TouchableOpacity>
          </View>
          <View style={addSpotModalStyles.modal.content.property}>
            <View style={addSpotModalStyles.modal.content.property.row}>
              <Image source={require('../../../assets/icons/FiCompass.png')} style={addSpotModalStyles.modal.content.property.illustration} />
              <Text style={addSpotModalStyles.modal.content.property.text}>Visibilité étoile polaire</Text>
            </View>
            <TouchableOpacity onPress={() => setPolarView(!polarView)}>
              <Image style={addSpotModalStyles.modal.content.property.icon} source={polarView ? require('../../../assets/icons/FiToggleFilled.png') : require('../../../assets/icons/FiToggleEmpty.png')} />
            </TouchableOpacity>
          </View>
          <View style={addSpotModalStyles.modal.content.property}>
            <View style={addSpotModalStyles.modal.content.property.row}>
              <Image source={require('../../../assets/icons/FiMountain.png')} style={addSpotModalStyles.modal.content.property.illustration} />
              <Text style={addSpotModalStyles.modal.content.property.text}>Altitude (m)</Text>
            </View>
            <TextInput style={addSpotModalStyles.modal.content.property.input} placeholderTextColor="#FFFFFF25" placeholder='Ex : 651' keyboardType='numeric' onChangeText={(text) => setAltitude(parseInt(text))} />
          </View>
        </View>

        <SimpleButton textColor={app_colors.white} text="Ajouter ce lieu" onPress={() => handleAddSpot()} />
      </View>
    </View>
  )
}
