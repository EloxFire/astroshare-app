import { useEffect, useState } from "react"
import { ScrollView, Text, View } from "react-native"
import { v4 as uuidv4 } from 'uuid'
import DisclaimerBar from "../../../../components/banners/DisclaimerBar"
import SimpleButton from "../../../../components/commons/buttons/SimpleButton"
import PageTitle from "../../../../components/commons/PageTitle"
import InputWithIcon from "../../../../components/forms/InputWithIcon"
import { useSettings } from "../../../../contexts/AppSettingsContext"
import { useAuth } from "../../../../contexts/AuthContext"
import { useAstroGear } from "../../../../contexts/GearContext"
import { app_colors, cameraTypes, mountTypes } from "../../../../helpers/constants"
import { eventTypes } from "../../../../helpers/constants/analytics"
import { sendAnalyticsEvent } from "../../../../helpers/scripts/analytics"
import { addCamera, deleteCamera, updateCamera } from "../../../../helpers/scripts/gear/cameras"
import { i18n } from "../../../../helpers/scripts/i18n"
import { showToast } from "../../../../helpers/scripts/showToast"
import { Camera } from "../../../../helpers/types/gear/Camera"
import { useTranslation } from "../../../../hooks/useTranslation"
import { globalStyles } from "../../../../styles/global"
import { gearFormsStyles } from "../../../../styles/screens/profile/gear/gearForms"
import CustomDropdown from "../../../../components/forms/CustomDropdown"
import { Mount } from "../../../../helpers/types/gear/Mount"
import { addMount, deleteMount, updateMount } from "../../../../helpers/scripts/gear/mounts"

export const MountsCrud = ({navigation, route}: any) => {


  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()
  const { updateCurrentMount } = useAstroGear()

  const [mode, setMode] = useState<'add' | 'edit'>('add')

  const [mountPayloadCapacity, setMountPayloadCapacity] = useState<string>('')

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'mount_management_screen_view', eventTypes.SCREEN_VIEW, {mode: route.params ? 'edit' : 'add'}, currentLocale)

    if(route.params){
      const selectedMount = route.params.selectedMount as Mount
      setMount(selectedMount)
      setMountPayloadCapacity(selectedMount.payloadCapacity ? selectedMount.payloadCapacity.toString() : '')
      setMode('edit')
    }
  }, [])
  
  const [mount, setMount] = useState<Mount>({
    id: uuidv4(),
    name: "",
    brand: "",
    model: "",
    type: "",
    gotoSystem: false,
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    gearType: 'mount'
  })

  const parseNumericInput = (value: string): number | undefined => {
    if (!value || value === ".") {
      return undefined
    }

    const parsed = parseFloat(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }

  const saveMount = async () => {
    if (!currentUser) {
      showToast({ message: "Utilisateur non authentifié.", type: "error" });
      return;
    }

    await addMount(currentUser.uid, mount);
    updateCurrentMount(mount)
    navigation.goBack();
  }

  const removeMount = async () => {
    if (!currentUser) {
      showToast({ message: "Utilisateur non authentifié.", type: "error" });
      return;
    }

    await deleteMount(currentUser.uid, mount.id);
    updateCurrentMount(null)
    navigation.goBack();
  }

  const saveChanges = async () => {
    if (!currentUser) {
      showToast({ message: "Utilisateur non authentifié.", type: "error" });
      return;
    }

    await updateMount(currentUser.uid, mount);
    navigation.goBack();
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t(`profile.gear.mounts.crud.${mode}.title`)}
        subtitle={i18n.t(`profile.gear.mounts.crud.${mode}.subtitle`)}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={globalStyles.content}>
          <DisclaimerBar
            message={i18n.t(`profile.gear.mounts.crud.disclaimer`)}
            type="info"
            soft
          />
          <View style={gearFormsStyles.formSection}>
            <Text style={gearFormsStyles.formSection.title}>Votre monture</Text>

            <View>
              <Text style={gearFormsStyles.label}>Nom de la monture <Text style={{color: app_colors.red}}>*</Text></Text>
              <InputWithIcon
                keyboardType="default"
                placeholder="Ma super monture"
                type="text"
                changeEvent={(value) => setMount({...mount, name: value})}
                value={mount.name}
                additionalStyles={{marginVertical: 5}}
              />
            </View>
            <View style={gearFormsStyles.formSection.formRow}>
              <View style={{flex: 1, marginRight: 5}}>
                <Text style={gearFormsStyles.label}>Marque</Text>
                <InputWithIcon
                  keyboardType="default"
                  placeholder="ZWO"
                  type="text"
                  changeEvent={(value) => setMount({...mount, brand: value})}
                  value={mount.brand}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <Text style={gearFormsStyles.label}>Modèle</Text>
                <InputWithIcon
                  keyboardType="default"
                  placeholder="ASI 2600MC"
                  type="text"
                  changeEvent={(value) => setMount({...mount, model: value})}
                  value={mount.model}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
            </View>

            <View>
              <Text style={gearFormsStyles.label}>Description</Text>
              <InputWithIcon
                keyboardType="default"
                placeholder="Description de ma super monture"
                type="text"
                changeEvent={(value) => setMount({...mount, description: value})}
                value={mount.description}
                additionalStyles={{marginVertical: 5}}
              />
            </View>
          </View>

          <View style={gearFormsStyles.formSection}>
            <Text style={gearFormsStyles.formSection.title}>Caractéristiques techniques</Text>

            <View style={gearFormsStyles.formSection.formRow}>
              <View style={{flex: 1, marginRight: 5}}>
                <Text style={gearFormsStyles.label}>Type de monture <Text style={{color: app_colors.red}}>*</Text></Text>
                <CustomDropdown
                  data={mountTypes}
                  value={mount.type}
                  placeholder="Types de monture"
                  onChange={(value) => setMount({...mount, type: value as Mount['type']})}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <Text style={gearFormsStyles.label}>Charge maximale (Kg)</Text>
                <InputWithIcon
                  keyboardType="decimal-pad"
                  placeholder="5.2"
                  type="number"
                  changeEvent={(value) => {
                    setMountPayloadCapacity(value)
                    const parsed = parseNumericInput(value)
                    setMount((prevMount) => ({
                      ...prevMount,
                      payloadCapacity: parsed ?? 0
                    }))
                  }}
                  value={mountPayloadCapacity}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
            </View>

            <View style={gearFormsStyles.formSection.formRow}>
              <View style={{flex: 1, marginRight: 5}}>
                <Text style={gearFormsStyles.label}>Système GoTo</Text>
                <CustomDropdown
                  data={[
                    {label: 'Oui', value: 'yes'},
                    {label: 'Non', value: 'no'}
                  ]}
                  value={mount.gotoSystem ? 'yes' : 'no'}
                  placeholder="Types de monture"
                  onChange={(value) => setMount({...mount, gotoSystem: value === 'yes'})}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <Text style={gearFormsStyles.label}>Pilotage PC</Text>
                <CustomDropdown
                  data={[
                    {label: 'Oui', value: 'yes'},
                    {label: 'Non', value: 'no'}
                  ]}
                  value={mount.pcControl ? 'yes' : 'no'}
                  placeholder="Types de monture"
                  onChange={(value) => setMount({...mount, pcControl: value === 'yes'})}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
            </View>
          </View>

          <SimpleButton
            fullWidth
            text={i18n.t(`profile.gear.mounts.crud.${mode}.saveButton`)}
            onPress={() => mode === 'add' ? saveMount() : saveChanges()}
            textColor={app_colors.black}
            backgroundColor={app_colors.white}
            align="center"
            textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
          />
          {
            mode === 'edit' && (
              <SimpleButton
                fullWidth
                text={i18n.t(`profile.gear.mounts.crud.${mode}.deleteButton`)}
                onPress={() => removeMount()}
                textColor={app_colors.white}
                backgroundColor={app_colors.red_eighty}
                align="center"
                textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
              />
            )
          }
        </View>
      </ScrollView>
    </View>
  )
}
