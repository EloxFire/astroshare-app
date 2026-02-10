import { View, ScrollView, Text } from "react-native"
import PageTitle from "../../../../components/commons/PageTitle"
import { routes } from "../../../../helpers/routes"
import { i18n } from "../../../../helpers/scripts/i18n"
import { globalStyles } from "../../../../styles/global"
import InputWithIcon from "../../../../components/forms/InputWithIcon"
import { useEffect, useState } from "react"
import { gearFormsStyles } from "../../../../styles/screens/profile/gear/gearForms"
import DisclaimerBar from "../../../../components/banners/DisclaimerBar"
import { Telescope } from "../../../../helpers/types/gear/Telescope"
import CustomDropdown from "../../../../components/forms/CustomDropdown"
import { app_colors, telescopeConstructions, telescopeTypes, telescopeUsages } from "../../../../helpers/constants"
import SimpleButton from "../../../../components/commons/buttons/SimpleButton"
import { addTelescope, deleteTelescope } from "../../../../helpers/scripts/gear/telescopes"
import { useAuth } from "../../../../contexts/AuthContext"
import { showToast } from "../../../../helpers/scripts/showToast"
import { v4 as uuidv4 } from 'uuid';
import { useAstroGear } from "../../../../contexts/GearContext"
import { useTranslation } from "../../../../hooks/useTranslation"
import { useSettings } from "../../../../contexts/AppSettingsContext"
import { sendAnalyticsEvent } from "../../../../helpers/scripts/analytics"
import { eventTypes } from "../../../../helpers/constants/analytics"

export const TelescopesCrud = ({navigation, route}: any) => {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()
  const { updateCurrentTelescope } = useAstroGear()

  const [mode, setMode] = useState<'add' | 'edit'>('add')

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'telesscope_management_screen_view', eventTypes.SCREEN_VIEW, {mode: route.params ? 'edit' : 'add'}, currentLocale)

    if(route.params){
      setTelescope(route.params.selectedTelescope)
      setMode('edit')
    }
  }, [])

  
  const [telescope, setTelescope] = useState<Telescope>({
    id: uuidv4(),
    name: "",
    diameter: 0,
    aperture: 0,
    focalLength: 0,
    type: "",
    construction: "",
    brand: "",
    model: "",
    description: "",
    usage: [],
    image_url: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    gearType: 'telescope'
  })

  const saveTelescope = async () => {
    if (!currentUser) {
      showToast({ message: "Utilisateur non authentifié.", type: "error" });
      return;
    }

    await addTelescope(currentUser.uid, telescope);
    updateCurrentTelescope(telescope)
    navigation.goBack();
  }
  
  const removeTelescope = async () => {
    if (!currentUser) {
      showToast({ message: "Utilisateur non authentifié.", type: "error" });
      return;
    }

    await deleteTelescope(currentUser.uid, telescope.id);
    updateCurrentTelescope(null)
    navigation.goBack();
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t(`profile.gear.telescopes.crud.${mode}.title`)}
        subtitle={i18n.t(`profile.gear.telescopes.crud.${mode}.subtitle`)}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={globalStyles.content}>
          <DisclaimerBar
            message={i18n.t(`profile.gear.telescopes.crud.disclaimer`)}
            type="info"
            soft
          />
          <View style={gearFormsStyles.formSection}>
            <Text style={gearFormsStyles.formSection.title}>Votre télescope</Text>

            <View>
              <Text style={gearFormsStyles.label}>Nom du télescope <Text style={{color: app_colors.red}}>*</Text></Text>
              <InputWithIcon
                keyboardType="default"
                placeholder="Mon super télescope"
                type="text"
                changeEvent={(value) => setTelescope({...telescope, name: value})}
                value={telescope.name}
                additionalStyles={{marginVertical: 5}}
              />
            </View>

            <View style={gearFormsStyles.formSection.formRow}>
              <View style={{flex: 1, marginRight: 5}}>
                <Text style={gearFormsStyles.label}>Marque</Text>
                <InputWithIcon
                  keyboardType="default"
                  placeholder="Omegon"
                  type="text"
                  changeEvent={(value) => setTelescope({...telescope, brand: value})}
                  value={telescope.brand}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <Text style={gearFormsStyles.label}>Modèle</Text>
                <InputWithIcon
                  keyboardType="default"
                  placeholder="Omegon Advanced"
                  type="text"
                  changeEvent={(value) => setTelescope({...telescope, model: value})}
                  value={telescope.model}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
            </View>

            <View style={gearFormsStyles.formSection.formRow}>
              <View style={{flex: 1, marginRight: 5}}>
                <Text style={gearFormsStyles.label}>Type de télescope</Text>
                <CustomDropdown
                  data={telescopeTypes}
                  value={telescope.type}
                  placeholder="Sélectionnez"
                  onChange={(value) => setTelescope({...telescope, type: value as Telescope['type']})}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <Text style={gearFormsStyles.label}>Construction</Text>
                <CustomDropdown
                  data={telescopeConstructions}
                  value={telescope.construction}
                  placeholder="Sélectionnez"
                  onChange={(value) => setTelescope({...telescope, construction: value as Telescope['construction']})}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
            </View>

            <View>
              <Text style={gearFormsStyles.label}>Description</Text>
              <InputWithIcon
                keyboardType="default"
                placeholder="Description de mon super télescope"
                type="text"
                changeEvent={(value) => setTelescope({...telescope, description: value})}
                value={telescope.description}
                additionalStyles={{marginVertical: 5}}
              />
            </View>
          </View>

          <View style={gearFormsStyles.formSection}>
            <Text style={gearFormsStyles.formSection.title}>Caractéristiques techniques</Text>

            <View style={gearFormsStyles.formSection.formRow}>
              <View style={{flex: 1, marginRight: 5}}>
                <Text style={gearFormsStyles.label}>Diamètre (en mm) <Text style={{color: app_colors.red}}>*</Text></Text>
                <InputWithIcon
                  keyboardType="numeric"
                  placeholder="150"
                  type="number"
                  changeEvent={(value) => setTelescope({...telescope, diameter: Number(value)})}
                  value={telescope.diameter ? telescope.diameter.toString() : ""}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <Text style={gearFormsStyles.label}>Focale (en mm) <Text style={{color: app_colors.red}}>*</Text></Text>
                <InputWithIcon
                  keyboardType="numeric"
                  placeholder="750"
                  type="number"
                  changeEvent={(value) => setTelescope({...telescope, focalLength: Number(value)})}
                  value={telescope.focalLength ? telescope.focalLength.toString() : ""}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
            </View>

            <View>
              <Text style={gearFormsStyles.label}>Domaine(s) d'utilisation</Text>
              <CustomDropdown
                data={telescopeUsages}
                value={telescope.usage}
                placeholder="Usages"
                multiselect
                onChange={(value) => setTelescope({...telescope, usage: value as Telescope['usage']})}
                additionalStyles={{marginVertical: 5}}
              />
            </View>
          </View>

          <SimpleButton
            fullWidth
            text={i18n.t(`profile.gear.telescopes.crud.${mode}.saveButton`)}
            onPress={() => saveTelescope()}
            textColor={app_colors.black}
            backgroundColor={app_colors.white}
            align="center"
            textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
          />

          {
            mode === 'edit' && (
              <SimpleButton
                fullWidth
                text={i18n.t(`profile.gear.telescopes.crud.${mode}.deleteButton`)}
                onPress={() => removeTelescope()}
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
