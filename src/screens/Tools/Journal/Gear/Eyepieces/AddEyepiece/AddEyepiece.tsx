import { ScrollView, View, Text, TouchableOpacity, TextInput } from "react-native"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { Trash2 } from "lucide-react-native"
import { router, useLocalSearchParams } from "expo-router"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { app_colors } from "../../../../../../helpers/variables"
import { generateCustomId } from "../../../../../../helpers/ids"
import { ScreenHeader } from "../../../../../../components/ScreenHeader/ScreenHeader"
import { addEyepieceStyles } from "./AddEyepiece.styles"
import SectionHeader from "../../../../../../components/SectionHeader/SectionHeader"
import { InputWithIcon } from "../../../../../../components/InputWithIcon/InputWithIcon"
import { Eyepiece } from "../../../../../../types/gear/Eyepiece"
import { useUserDataStore } from "../../../../../../store/userData.store"
import { EYEPIECE_BARREL_SIZES, EYEPIECE_TYPES } from "../../../../../../helpers/gear/eyepieces"
import { parseOptionalFloat } from "../../../../../../helpers/parseNumberInput"

const AddEyepiece = () => {
  const { t } = useTranslation("tools/journal/gear/eyepieces/add")
  const { id: editedEyepieceId } = useLocalSearchParams<{ id?: string }>()
  const eyepieces = useUserDataStore(state => state.gear.eyepieces)
  const addEyepiece = useUserDataStore(state => state.addEyepiece)
  const updateEyepiece = useUserDataStore(state => state.updateEyepiece)
  const removeEyepiece = useUserDataStore(state => state.removeEyepiece)

  const editedEyepiece = editedEyepieceId ? eyepieces.find(eyepiece => eyepiece.id === editedEyepieceId) : undefined

  const [name, setName] = useState(editedEyepiece?.name ?? "")
  const [brand, setBrand] = useState(editedEyepiece?.brand ?? "")
  const [model, setModel] = useState(editedEyepiece?.model ?? "")
  const [selectedType, setSelectedType] = useState<Eyepiece["type"]>(editedEyepiece?.type ?? "plossl")
  const [barrelSize, setBarrelSize] = useState<Eyepiece["barrelSize"]>(editedEyepiece?.barrelSize ?? 1.25)
  const [focalLengthText, setFocalLengthText] = useState(editedEyepiece?.focalLength?.toString() ?? "")
  const [afovText, setAfovText] = useState(editedEyepiece?.afov?.toString() ?? "")
  const focalLength = parseOptionalFloat(focalLengthText)
  const afov = parseOptionalFloat(afovText)

  const isFormValid = focalLength !== null && afov !== null

  const handleSave = () => {
    if (!isFormValid || focalLength === null || afov === null) return

    const eyepieceData: Eyepiece = {
      id: editedEyepiece?.id ?? generateCustomId(),
      name: name.trim() || null,
      brand: brand.trim() || null,
      model: model.trim() || null,
      type: selectedType,
      barrelSize,
      focalLength,
      afov,
    }

    if (editedEyepiece) {
      updateEyepiece(editedEyepiece.id, eyepieceData)
    } else {
      addEyepiece(eyepieceData)
    }
    router.back()
  }

  const handleDelete = () => {
    if (!editedEyepiece) return
    removeEyepiece(editedEyepiece.id)
    router.replace("/tools/journal/gear")
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={editedEyepiece ? t("editTitle") : t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>
          <View style={addEyepieceStyles.form}>
            <View style={addEyepieceStyles.form.formBlock}>
              <SectionHeader title={t("sections.identity.title")} />

              <InputWithIcon
                label={t("fields.name.label")}
                placeholder={t("fields.name.placeholder")}
                value={name}
                onChangeText={setName}
                fill
                action={() => {}}
              />

              <View style={addEyepieceStyles.form.formRow}>
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

            <View style={addEyepieceStyles.form.formBlock}>
              <SectionHeader title={t("sections.characteristics.title")} />

              <Text style={addEyepieceStyles.form.label}>{t("fields.type.label")}</Text>
              <View style={addEyepieceStyles.form.chipsRow}>
                {
                  EYEPIECE_TYPES.map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={[addEyepieceStyles.form.chipsRow.chip, selectedType === value && addEyepieceStyles.form.chipsRow.chip.active]}
                      onPress={() => setSelectedType(value)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: selectedType === value }}
                    >
                      <Text style={[addEyepieceStyles.form.chipsRow.chip.text, selectedType === value && addEyepieceStyles.form.chipsRow.chip.active.text]}>{t(`types.${value}`)}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

              <Text style={addEyepieceStyles.form.label}>{t("fields.barrelSize.label")}</Text>
              <View style={addEyepieceStyles.form.chipsRow}>
                {
                  EYEPIECE_BARREL_SIZES.map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={[addEyepieceStyles.form.chipsRow.chip, barrelSize === value && addEyepieceStyles.form.chipsRow.chip.active]}
                      onPress={() => setBarrelSize(value)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: barrelSize === value }}
                    >
                      <Text style={[addEyepieceStyles.form.chipsRow.chip.text, barrelSize === value && addEyepieceStyles.form.chipsRow.chip.active.text]}>{value}&quot;</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

              <View style={addEyepieceStyles.form.numberField}>
                <Text style={addEyepieceStyles.form.numberField.label}>
                  {t("fields.focalLength.label")}<Text style={addEyepieceStyles.form.numberField.label.required}> *</Text>
                </Text>
                <View style={addEyepieceStyles.form.numberField.valueContainer}>
                  <TextInput
                    style={addEyepieceStyles.form.numberField.valueContainer.value}
                    value={focalLengthText}
                    onChangeText={setFocalLengthText}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={app_colors.primary.medium}
                  />
                  <Text style={addEyepieceStyles.form.numberField.valueContainer.unit}>{t("unit.millimeters")}</Text>
                </View>
              </View>

              <View style={addEyepieceStyles.form.numberField}>
                <Text style={addEyepieceStyles.form.numberField.label}>
                  {t("fields.afov.label")}<Text style={addEyepieceStyles.form.numberField.label.required}> *</Text>
                </Text>
                <View style={addEyepieceStyles.form.numberField.valueContainer}>
                  <TextInput
                    style={addEyepieceStyles.form.numberField.valueContainer.value}
                    value={afovText}
                    onChangeText={setAfovText}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={app_colors.primary.medium}
                  />
                  <Text style={addEyepieceStyles.form.numberField.valueContainer.unit}>{t("unit.degrees")}</Text>
                </View>
              </View>
            </View>

            <View style={addEyepieceStyles.form.actions}>
              <TouchableOpacity style={addEyepieceStyles.form.actions.saveButton} onPress={handleSave} disabled={!isFormValid}>
                <Text style={addEyepieceStyles.form.actions.saveButton.text}>{editedEyepiece ? t("actions.update") : t("actions.save")}</Text>
              </TouchableOpacity>
              {
                editedEyepiece && (
                  <TouchableOpacity style={addEyepieceStyles.form.actions.deleteButton} onPress={handleDelete}>
                    <Trash2 color={app_colors.red.main} size={18} />
                    <Text style={addEyepieceStyles.form.actions.deleteButton.text}>{t("actions.delete")}</Text>
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

export default AddEyepiece
