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
import { app_colors, cameraTypes } from "../../../../helpers/constants"
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

export const CamerasCrud = ({navigation, route}: any) => {


  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()
  const { updateCurrentCamera } = useAstroGear()

  const [mode, setMode] = useState<'add' | 'edit'>('add')

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'camera_management_screen_view', eventTypes.SCREEN_VIEW, {mode: route.params ? 'edit' : 'add'}, currentLocale)

    if(route.params){
      const selectedCamera = route.params.selectedCamera as Camera
      setCamera(selectedCamera)
      setSensorWidthInput(selectedCamera.sensorSize.width ? selectedCamera.sensorSize.width.toString() : "")
      setSensorHeightInput(selectedCamera.sensorSize.height ? selectedCamera.sensorSize.height.toString() : "")
      setResolutionWidthInput(selectedCamera.resolution.width ? selectedCamera.resolution.width.toString() : "")
      setResolutionHeightInput(selectedCamera.resolution.height ? selectedCamera.resolution.height.toString() : "")
      setPixelSizeInput(selectedCamera.pixelSize ? selectedCamera.pixelSize.toString() : "")
      setMode('edit')
    }
  }, [])
  
  const [camera, setCamera] = useState<Camera>({
    id: uuidv4(),
    name: "",
    brand: "",
    model: "",
    sensorSize: {
      width: 0,
      height: 0
    },
    resolution: {
      width: 0,
      height: 0
    },
    pixelSize: 0,
    type: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    gearType: 'camera'
  })

  const [sensorWidthInput, setSensorWidthInput] = useState("")
  const [sensorHeightInput, setSensorHeightInput] = useState("")
  const [resolutionWidthInput, setResolutionWidthInput] = useState("")
  const [resolutionHeightInput, setResolutionHeightInput] = useState("")
  const [pixelSizeInput, setPixelSizeInput] = useState("")

  const parseNumericInput = (value: string): number | undefined => {
    if (!value || value === ".") {
      return undefined
    }

    const parsed = parseFloat(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }

  const saveCamera = async () => {
    if (!currentUser) {
      showToast({ message: "Utilisateur non authentifié.", type: "error" });
      return;
    }

    await addCamera(currentUser.uid, camera);
    updateCurrentCamera(camera)
    navigation.goBack();
  }

  const removeCamera = async () => {
    if (!currentUser) {
      showToast({ message: "Utilisateur non authentifié.", type: "error" });
      return;
    }

    await deleteCamera(currentUser.uid, camera.id);
    updateCurrentCamera(null)
    navigation.goBack();
  }

  const saveChanges = async () => {
    if (!currentUser) {
      showToast({ message: "Utilisateur non authentifié.", type: "error" });
      return;
    }

    await updateCamera(currentUser.uid, camera);
    navigation.goBack();
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t(`profile.gear.cameras.crud.${mode}.title`)}
        subtitle={i18n.t(`profile.gear.cameras.crud.${mode}.subtitle`)}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={globalStyles.content}>
          <DisclaimerBar
            message={i18n.t(`profile.gear.cameras.crud.disclaimer`)}
            type="info"
            soft
          />
          <View style={gearFormsStyles.formSection}>
            <Text style={gearFormsStyles.formSection.title}>Votre caméra</Text>

            <View>
              <Text style={gearFormsStyles.label}>Nom de la caméra <Text style={{color: app_colors.red}}>*</Text></Text>
              <InputWithIcon
                keyboardType="default"
                placeholder="Ma super caméra"
                type="text"
                changeEvent={(value) => setCamera({...camera, name: value})}
                value={camera.name}
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
                  changeEvent={(value) => setCamera({...camera, brand: value})}
                  value={camera.brand}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <Text style={gearFormsStyles.label}>Modèle</Text>
                <InputWithIcon
                  keyboardType="default"
                  placeholder="ASI 2600MC"
                  type="text"
                  changeEvent={(value) => setCamera({...camera, model: value})}
                  value={camera.model}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
            </View>

            <View>
              <Text style={gearFormsStyles.label}>Description</Text>
              <InputWithIcon
                keyboardType="default"
                placeholder="Description de ma super caméra"
                type="text"
                changeEvent={(value) => setCamera({...camera, description: value})}
                value={camera.description}
                additionalStyles={{marginVertical: 5}}
              />
            </View>
          </View>

          <View style={gearFormsStyles.formSection}>
            <Text style={gearFormsStyles.formSection.title}>Caractéristiques techniques</Text>

            <View>
              <Text style={gearFormsStyles.label}>Type de caméra</Text>
              <CustomDropdown
                data={cameraTypes}
                value={camera.type}
                placeholder="Types de caméra"
                onChange={(value) => setCamera({...camera, type: value as Camera['type']})}
                additionalStyles={{marginVertical: 5}}
              />
            </View>

            <View style={gearFormsStyles.formSection.formRow}>
              <View style={{flex: 1, marginRight: 5}}>
                <Text style={gearFormsStyles.label}>Largeur capteur (mm) <Text style={{color: app_colors.red}}>*</Text></Text>
                <InputWithIcon
                  keyboardType="decimal-pad"
                  placeholder="7.37"
                  type="number"
                  changeEvent={(value) => {
                    setSensorWidthInput(value)
                    const parsed = parseNumericInput(value)
                    setCamera((prevCamera) => ({
                      ...prevCamera,
                      sensorSize: { ...prevCamera.sensorSize, width: parsed ?? 0 }
                    }))
                  }}
                  value={sensorWidthInput}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <Text style={gearFormsStyles.label}>Hauteur capteur (mm) <Text style={{color: app_colors.red}}>*</Text></Text>
                <InputWithIcon
                  keyboardType="decimal-pad"
                  placeholder="4.92"
                  type="number"
                  changeEvent={(value) => {
                    setSensorHeightInput(value)
                    const parsed = parseNumericInput(value)
                    setCamera((prevCamera) => ({
                      ...prevCamera,
                      sensorSize: { ...prevCamera.sensorSize, height: parsed ?? 0 }
                    }))
                  }}
                  value={sensorHeightInput}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
            </View>

            <View style={gearFormsStyles.formSection.formRow}>
              <View style={{flex: 1, marginRight: 5}}>
                <Text style={gearFormsStyles.label}>Résolution, largeur (px) <Text style={{color: app_colors.red}}>*</Text></Text>
                <InputWithIcon
                  keyboardType="decimal-pad"
                  placeholder="2080"
                  type="number"
                  changeEvent={(value) => {
                    setResolutionWidthInput(value)
                    const parsed = parseNumericInput(value)
                    setCamera((prevCamera) => ({
                      ...prevCamera,
                      resolution: { ...prevCamera.resolution, width: parsed ?? 0 }
                    }))
                  }}
                  value={resolutionWidthInput}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <Text style={gearFormsStyles.label}>Résolution, hauteur (px) <Text style={{color: app_colors.red}}>*</Text></Text>
                <InputWithIcon
                  keyboardType="decimal-pad"
                  placeholder="3096"
                  type="number"
                  changeEvent={(value) => {
                    setResolutionHeightInput(value)
                    const parsed = parseNumericInput(value)
                    setCamera((prevCamera) => ({
                      ...prevCamera,
                      resolution: { ...prevCamera.resolution, height: parsed ?? 0 }
                    }))
                  }}
                  value={resolutionHeightInput}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
            </View>

            <View style={{flex: 1, marginLeft: 5}}>
              <Text style={gearFormsStyles.label}>Taille pixel (µm) <Text style={{color: app_colors.red}}>*</Text></Text>
              <InputWithIcon
                keyboardType="decimal-pad"
                placeholder="2.4"
                type="number"
                changeEvent={(value) => {
                  setPixelSizeInput(value)
                  const parsed = parseNumericInput(value)
                  setCamera((prevCamera) => ({
                    ...prevCamera,
                    pixelSize: parsed ?? 0
                  }))
                }}
                value={pixelSizeInput}
                additionalStyles={{marginVertical: 5}}
              />
            </View>
          </View>

          <SimpleButton
            fullWidth
            text={i18n.t(`profile.gear.cameras.crud.${mode}.saveButton`)}
            onPress={() => mode === 'add' ? saveCamera() : saveChanges()}
            textColor={app_colors.black}
            backgroundColor={app_colors.white}
            align="center"
            textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
          />
          {
            mode === 'edit' && (
              <SimpleButton
                fullWidth
                text={i18n.t(`profile.gear.cameras.crud.${mode}.deleteButton`)}
                onPress={() => removeCamera()}
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
