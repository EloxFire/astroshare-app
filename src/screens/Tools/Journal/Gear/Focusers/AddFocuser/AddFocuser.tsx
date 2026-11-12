import { ScrollView, View, Text, TouchableOpacity, TextInput } from "react-native"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { Trash2 } from "lucide-react-native"
import { router, useLocalSearchParams } from "expo-router"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { app_colors } from "../../../../../../helpers/variables"
import { generateCustomId } from "../../../../../../helpers/ids"
import { ScreenHeader } from "../../../../../../components/ScreenHeader/ScreenHeader"
import { addFocuserStyles } from "./AddFocuser.styles"
import SectionHeader from "../../../../../../components/SectionHeader/SectionHeader"
import { InputWithIcon } from "../../../../../../components/InputWithIcon/InputWithIcon"
import { Focuser } from "../../../../../../types/gear/Focuser"
import { useUserDataStore } from "../../../../../../store/userData.store"
import { FOCUSER_TYPES } from "../../../../../../helpers/gear/focusers"
import { parseOptionalFloat } from "../../../../../../helpers/parseNumberInput"

const AddFocuser = () => {
  const { t } = useTranslation("tools/journal/gear/focusers/add")
  const { id: editedFocuserId } = useLocalSearchParams<{ id?: string }>()
  const focusers = useUserDataStore(state => state.gear.focusers)
  const addFocuser = useUserDataStore(state => state.addFocuser)
  const updateFocuser = useUserDataStore(state => state.updateFocuser)
  const removeFocuser = useUserDataStore(state => state.removeFocuser)

  const editedFocuser = editedFocuserId ? focusers.find(focuser => focuser.id === editedFocuserId) : undefined

  const [name, setName] = useState(editedFocuser?.name ?? "")
  const [brand, setBrand] = useState(editedFocuser?.brand ?? "")
  const [model, setModel] = useState(editedFocuser?.model ?? "")
  const [selectedType, setSelectedType] = useState<Focuser["type"]>(editedFocuser?.type ?? "manual")
  const [travelText, setTravelText] = useState(editedFocuser?.travel?.toString() ?? "")
  const travel = parseOptionalFloat(travelText)

  const isFormValid = travel !== null

  const handleSave = () => {
    if (!isFormValid || travel === null) return

    const focuserData: Focuser = {
      id: editedFocuser?.id ?? generateCustomId(),
      name: name.trim() || null,
      brand: brand.trim() || null,
      model: model.trim() || null,
      type: selectedType,
      travel,
    }

    if (editedFocuser) {
      updateFocuser(editedFocuser.id, focuserData)
    } else {
      addFocuser(focuserData)
    }
    router.back()
  }

  const handleDelete = () => {
    if (!editedFocuser) return
    removeFocuser(editedFocuser.id)
    router.replace("/tools/journal/gear")
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={editedFocuser ? t("editTitle") : t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>
          <View style={addFocuserStyles.form}>
            <View style={addFocuserStyles.form.formBlock}>
              <SectionHeader title={t("sections.identity.title")} />

              <InputWithIcon
                label={t("fields.name.label")}
                placeholder={t("fields.name.placeholder")}
                value={name}
                onChangeText={setName}
                fill
                action={() => {}}
              />

              <View style={addFocuserStyles.form.formRow}>
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

            <View style={addFocuserStyles.form.formBlock}>
              <SectionHeader title={t("sections.characteristics.title")} />

              <Text style={addFocuserStyles.form.label}>{t("fields.type.label")}</Text>
              <View style={addFocuserStyles.form.chipsRow}>
                {
                  FOCUSER_TYPES.map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={[addFocuserStyles.form.chipsRow.chip, selectedType === value && addFocuserStyles.form.chipsRow.chip.active]}
                      onPress={() => setSelectedType(value)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: selectedType === value }}
                    >
                      <Text style={[addFocuserStyles.form.chipsRow.chip.text, selectedType === value && addFocuserStyles.form.chipsRow.chip.active.text]}>{t(`types.${value}`)}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

              <View style={addFocuserStyles.form.numberField}>
                <Text style={addFocuserStyles.form.numberField.label}>
                  {t("fields.travel.label")}<Text style={addFocuserStyles.form.numberField.label.required}> *</Text>
                </Text>
                <View style={addFocuserStyles.form.numberField.valueContainer}>
                  <TextInput
                    style={addFocuserStyles.form.numberField.valueContainer.value}
                    value={travelText}
                    onChangeText={setTravelText}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={app_colors.primary.medium}
                  />
                  <Text style={addFocuserStyles.form.numberField.valueContainer.unit}>{t("unit.millimeters")}</Text>
                </View>
              </View>
            </View>

            <View style={addFocuserStyles.form.actions}>
              <TouchableOpacity style={addFocuserStyles.form.actions.saveButton} onPress={handleSave} disabled={!isFormValid}>
                <Text style={addFocuserStyles.form.actions.saveButton.text}>{editedFocuser ? t("actions.update") : t("actions.save")}</Text>
              </TouchableOpacity>
              {
                editedFocuser && (
                  <TouchableOpacity style={addFocuserStyles.form.actions.deleteButton} onPress={handleDelete}>
                    <Trash2 color={app_colors.red.main} size={18} />
                    <Text style={addFocuserStyles.form.actions.deleteButton.text}>{t("actions.delete")}</Text>
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

export default AddFocuser
