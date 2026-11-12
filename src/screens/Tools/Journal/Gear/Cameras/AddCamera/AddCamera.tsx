import { ScrollView, View, Text, TouchableOpacity, TextInput } from "react-native"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { Trash2 } from "lucide-react-native"
import { router, useLocalSearchParams } from "expo-router"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { app_colors } from "../../../../../../helpers/variables"
import { generateCustomId } from "../../../../../../helpers/ids"
import { ScreenHeader } from "../../../../../../components/ScreenHeader/ScreenHeader"
import { addCameraStyles } from "./AddCamera.styles"
import SectionHeader from "../../../../../../components/SectionHeader/SectionHeader"
import { InputWithIcon } from "../../../../../../components/InputWithIcon/InputWithIcon"
import { Camera } from "../../../../../../types/gear/Camera"
import { useUserDataStore } from "../../../../../../store/userData.store"
import { CAMERA_TYPES } from "../../../../../../helpers/gear/cameras"
import { parseOptionalFloat } from "../../../../../../helpers/parseNumberInput"

const AddCamera = () => {
  const { t } = useTranslation("tools/journal/gear/cameras/add")
  const { id: editedCameraId } = useLocalSearchParams<{ id?: string }>()
  const cameras = useUserDataStore(state => state.gear.cameras)
  const addCamera = useUserDataStore(state => state.addCamera)
  const updateCamera = useUserDataStore(state => state.updateCamera)
  const removeCamera = useUserDataStore(state => state.removeCamera)

  const editedCamera = editedCameraId ? cameras.find(camera => camera.id === editedCameraId) : undefined

  const [name, setName] = useState(editedCamera?.name ?? "")
  const [brand, setBrand] = useState(editedCamera?.brand ?? "")
  const [model, setModel] = useState(editedCamera?.model ?? "")
  const [selectedType, setSelectedType] = useState<Camera["type"]>(editedCamera?.type ?? "cmos")
  const [sensorWidthText, setSensorWidthText] = useState(editedCamera?.sensorSize.width?.toString() ?? "")
  const [sensorHeightText, setSensorHeightText] = useState(editedCamera?.sensorSize.height?.toString() ?? "")
  const [pixelSizeText, setPixelSizeText] = useState(editedCamera?.pixelSize?.toString() ?? "")
  const [resolutionWidthText, setResolutionWidthText] = useState(editedCamera?.resolution?.width?.toString() ?? "")
  const [resolutionHeightText, setResolutionHeightText] = useState(editedCamera?.resolution?.height?.toString() ?? "")
  const sensorWidth = parseOptionalFloat(sensorWidthText)
  const sensorHeight = parseOptionalFloat(sensorHeightText)
  const pixelSize = parseOptionalFloat(pixelSizeText)
  const resolutionWidth = parseOptionalFloat(resolutionWidthText)
  const resolutionHeight = parseOptionalFloat(resolutionHeightText)

  const isFormValid = sensorWidth !== null && sensorHeight !== null && pixelSize !== null

  const handleSave = () => {
    if (!isFormValid || sensorWidth === null || sensorHeight === null || pixelSize === null) return

    const cameraData: Camera = {
      id: editedCamera?.id ?? generateCustomId(),
      name: name.trim() || null,
      brand: brand.trim() || null,
      model: model.trim() || null,
      type: selectedType,
      sensorSize: { width: sensorWidth, height: sensorHeight },
      pixelSize,
      resolution: resolutionWidth !== null && resolutionHeight !== null ? { width: resolutionWidth, height: resolutionHeight } : undefined,
    }

    if (editedCamera) {
      updateCamera(editedCamera.id, cameraData)
    } else {
      addCamera(cameraData)
    }
    router.back()
  }

  const handleDelete = () => {
    if (!editedCamera) return
    removeCamera(editedCamera.id)
    router.replace("/tools/journal/gear")
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={editedCamera ? t("editTitle") : t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>
          <View style={addCameraStyles.form}>
            <View style={addCameraStyles.form.formBlock}>
              <SectionHeader title={t("sections.identity.title")} />

              <InputWithIcon
                label={t("fields.name.label")}
                placeholder={t("fields.name.placeholder")}
                value={name}
                onChangeText={setName}
                fill
                action={() => {}}
              />

              <View style={addCameraStyles.form.formRow}>
                <InputWithIcon
                  label={t("fields.brand.label")}
                  placeholder={t("fields.optionalPlaceholder")}
                  value={brand}
                  onChangeText={setBrand}
                  fill
                  action={() => {}}
                />
                <InputWithIcon
                  label={t("fields.model.label")}
                  placeholder={t("fields.optionalPlaceholder")}
                  value={model}
                  onChangeText={setModel}
                  fill
                  action={() => {}}
                />
              </View>
            </View>

            <View style={addCameraStyles.form.formBlock}>
              <SectionHeader title={t("sections.characteristics.title")} />

              <Text style={addCameraStyles.form.label}>{t("fields.type.label")}</Text>
              <View style={addCameraStyles.form.chipsRow}>
                {
                  CAMERA_TYPES.map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={[addCameraStyles.form.chipsRow.chip, selectedType === value && addCameraStyles.form.chipsRow.chip.active]}
                      onPress={() => setSelectedType(value)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: selectedType === value }}
                    >
                      <Text style={[addCameraStyles.form.chipsRow.chip.text, selectedType === value && addCameraStyles.form.chipsRow.chip.active.text]}>{t(`types.${value}`)}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

              <View style={addCameraStyles.form.numberField}>
                <Text style={addCameraStyles.form.numberField.label}>
                  {t("fields.sensorWidth.label")}<Text style={addCameraStyles.form.numberField.label.required}> *</Text>
                </Text>
                <View style={addCameraStyles.form.numberField.valueContainer}>
                  <TextInput
                    style={addCameraStyles.form.numberField.valueContainer.value}
                    value={sensorWidthText}
                    onChangeText={setSensorWidthText}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={app_colors.primary.medium}
                  />
                  <Text style={addCameraStyles.form.numberField.valueContainer.unit}>{t("unit.millimeters")}</Text>
                </View>
              </View>

              <View style={addCameraStyles.form.numberField}>
                <Text style={addCameraStyles.form.numberField.label}>
                  {t("fields.sensorHeight.label")}<Text style={addCameraStyles.form.numberField.label.required}> *</Text>
                </Text>
                <View style={addCameraStyles.form.numberField.valueContainer}>
                  <TextInput
                    style={addCameraStyles.form.numberField.valueContainer.value}
                    value={sensorHeightText}
                    onChangeText={setSensorHeightText}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={app_colors.primary.medium}
                  />
                  <Text style={addCameraStyles.form.numberField.valueContainer.unit}>{t("unit.millimeters")}</Text>
                </View>
              </View>

              <View style={addCameraStyles.form.numberField}>
                <Text style={addCameraStyles.form.numberField.label}>
                  {t("fields.pixelSize.label")}<Text style={addCameraStyles.form.numberField.label.required}> *</Text>
                </Text>
                <View style={addCameraStyles.form.numberField.valueContainer}>
                  <TextInput
                    style={addCameraStyles.form.numberField.valueContainer.value}
                    value={pixelSizeText}
                    onChangeText={setPixelSizeText}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={app_colors.primary.medium}
                  />
                  <Text style={addCameraStyles.form.numberField.valueContainer.unit}>{t("unit.micrometers")}</Text>
                </View>
              </View>

              <View style={addCameraStyles.form.numberField}>
                <Text style={addCameraStyles.form.numberField.label}>{t("fields.resolutionWidth.label")}</Text>
                <View style={addCameraStyles.form.numberField.valueContainer}>
                  <TextInput
                    style={addCameraStyles.form.numberField.valueContainer.value}
                    value={resolutionWidthText}
                    onChangeText={setResolutionWidthText}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={app_colors.primary.medium}
                  />
                  <Text style={addCameraStyles.form.numberField.valueContainer.unit}>{t("unit.pixels")}</Text>
                </View>
              </View>

              <View style={addCameraStyles.form.numberField}>
                <Text style={addCameraStyles.form.numberField.label}>{t("fields.resolutionHeight.label")}</Text>
                <View style={addCameraStyles.form.numberField.valueContainer}>
                  <TextInput
                    style={addCameraStyles.form.numberField.valueContainer.value}
                    value={resolutionHeightText}
                    onChangeText={setResolutionHeightText}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={app_colors.primary.medium}
                  />
                  <Text style={addCameraStyles.form.numberField.valueContainer.unit}>{t("unit.pixels")}</Text>
                </View>
              </View>
            </View>

            <View style={addCameraStyles.form.actions}>
              <TouchableOpacity style={addCameraStyles.form.actions.saveButton} onPress={handleSave} disabled={!isFormValid}>
                <Text style={addCameraStyles.form.actions.saveButton.text}>{editedCamera ? t("actions.update") : t("actions.save")}</Text>
              </TouchableOpacity>
              {
                editedCamera && (
                  <TouchableOpacity style={addCameraStyles.form.actions.deleteButton} onPress={handleDelete}>
                    <Trash2 color={app_colors.red.main} size={18} />
                    <Text style={addCameraStyles.form.actions.deleteButton.text}>{t("actions.delete")}</Text>
                  </TouchableOpacity>
                )
              }
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default AddCamera
