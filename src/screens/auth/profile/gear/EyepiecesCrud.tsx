import { useEffect, useState } from "react"
import { ScrollView, Text, View } from "react-native"
import { v4 as uuidv4 } from 'uuid'
import DisclaimerBar from "../../../../components/banners/DisclaimerBar"
import SimpleButton from "../../../../components/commons/buttons/SimpleButton"
import PageTitle from "../../../../components/commons/PageTitle"
import InputWithIcon from "../../../../components/forms/InputWithIcon"
import { useAuth } from "../../../../contexts/AuthContext"
import { useAstroGear } from "../../../../contexts/GearContext"
import { app_colors } from "../../../../helpers/constants"
import { addEyepiece, deleteEyepiece } from "../../../../helpers/scripts/gear/eyepieces"
import { i18n } from "../../../../helpers/scripts/i18n"
import { showToast } from "../../../../helpers/scripts/showToast"
import { Eyepiece } from "../../../../helpers/types/gear/Eyepiece"
import { globalStyles } from "../../../../styles/global"
import { gearFormsStyles } from "../../../../styles/screens/profile/gear/gearForms"
import { useSettings } from "../../../../contexts/AppSettingsContext"
import { useTranslation } from "../../../../hooks/useTranslation"
import { eventTypes } from "../../../../helpers/constants/analytics"
import { sendAnalyticsEvent } from "../../../../helpers/scripts/analytics"

export const EyepiecesCrud = ({navigation, route}: any) => {


  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()
  const { updateCurrentEyepiece } = useAstroGear()

  const [mode, setMode] = useState<'add' | 'edit'>('add')

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'eyepiece_management_screen_view', eventTypes.SCREEN_VIEW, {mode: route.params ? 'edit' : 'add'}, currentLocale)

    if(route.params){
      setEyepiece(route.params.selectedEyepiece)
      setMode('edit')
    }
  }, [])
  
  const [eyepiece, setEyepiece] = useState<Eyepiece>({
    id: uuidv4(),
    name: "",
    brand: "",
    model: "",
    focalLength: 0,
    apparentFieldOfView: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    gearType: 'eyepiece'
  })

  const saveEyepiece = async () => {
    if (!currentUser) {
      showToast({ message: "Utilisateur non authentifié.", type: "error" });
      return;
    }

    await addEyepiece(currentUser.uid, eyepiece);
    updateCurrentEyepiece(eyepiece)
    navigation.goBack();
  }

  const removeEyepiece = async () => {
    if (!currentUser) {
      showToast({ message: "Utilisateur non authentifié.", type: "error" });
      return;
    }

    await deleteEyepiece(currentUser.uid, eyepiece.id);
    updateCurrentEyepiece(null)
    navigation.goBack();
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t(`profile.gear.eyepieces.crud.${mode}.title`)}
        subtitle={i18n.t(`profile.gear.eyepieces.crud.${mode}.subtitle`)}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={globalStyles.content}>
          <DisclaimerBar
            message={i18n.t(`profile.gear.eyepieces.crud.disclaimer`)}
            type="info"
            soft
          />
          <View style={gearFormsStyles.formSection}>
            <Text style={gearFormsStyles.formSection.title}>Votre oculaire</Text>

            <View>
              <Text style={gearFormsStyles.label}>Nom de l'oculaire <Text style={{color: app_colors.red}}>*</Text></Text>
              <InputWithIcon
                keyboardType="default"
                placeholder="Mon super oculaire"
                type="text"
                changeEvent={(value) => setEyepiece({...eyepiece, name: value})}
                value={eyepiece.name}
                additionalStyles={{marginVertical: 5}}
              />
            </View>

            <View style={gearFormsStyles.formSection.formRow}>
              <View style={{flex: 1, marginRight: 5}}>
                <Text style={gearFormsStyles.label}>Marque</Text>
                <InputWithIcon
                  keyboardType="default"
                  placeholder="TeleVue"
                  type="text"
                  changeEvent={(value) => setEyepiece({...eyepiece, brand: value})}
                  value={eyepiece.brand}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <Text style={gearFormsStyles.label}>Modèle</Text>
                <InputWithIcon
                  keyboardType="default"
                  placeholder="Delos"
                  type="text"
                  changeEvent={(value) => setEyepiece({...eyepiece, model: value})}
                  value={eyepiece.model}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
            </View>

            <View>
              <Text style={gearFormsStyles.label}>Description</Text>
              <InputWithIcon
                keyboardType="default"
                placeholder="Description de mon super oculaire"
                type="text"
                changeEvent={(value) => setEyepiece({...eyepiece, description: value})}
                value={eyepiece.description}
                additionalStyles={{marginVertical: 5}}
              />
            </View>
          </View>

          <View style={gearFormsStyles.formSection}>
            <Text style={gearFormsStyles.formSection.title}>Caractéristiques techniques</Text>

            <View style={gearFormsStyles.formSection.formRow}>
              <View style={{flex: 1, marginRight: 5}}>
                <Text style={gearFormsStyles.label}>Focale (en mm) <Text style={{color: app_colors.red}}>*</Text></Text>
                <InputWithIcon
                  keyboardType="numeric"
                  placeholder="13"
                  type="number"
                  changeEvent={(value) => setEyepiece({...eyepiece, focalLength: Number(value)})}
                  value={eyepiece.focalLength ? eyepiece.focalLength.toString() : ""}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <Text style={gearFormsStyles.label}>Champ (°) <Text style={{color: app_colors.red}}>*</Text></Text>
                <InputWithIcon
                  keyboardType="numeric"
                  placeholder="100"
                  type="number"
                  changeEvent={(value) => setEyepiece({...eyepiece, apparentFieldOfView: Number(value)})}
                  value={eyepiece.apparentFieldOfView ? eyepiece.apparentFieldOfView.toString() : ""}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
            </View>
          </View>

          <SimpleButton
            fullWidth
            text={i18n.t(`profile.gear.eyepieces.crud.${mode}.saveButton`)}
            onPress={() => saveEyepiece()}
            textColor={app_colors.black}
            backgroundColor={app_colors.white}
            align="center"
            textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
          />
          {
            mode === 'edit' && (
              <SimpleButton
                fullWidth
                text={i18n.t(`profile.gear.eyepieces.crud.${mode}.deleteButton`)}
                onPress={() => removeEyepiece()}
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
