import { View, ScrollView, TouchableOpacity, Text } from "react-native"
import { useTranslation } from "react-i18next"
import { globalStyles } from "../../../../../helpers/globalStyles"
import { ScreenHeader } from "../../../../../components/ScreenHeader/ScreenHeader"
import SectionHeader from "../../../../../components/SectionHeader/SectionHeader"
import { addSessionStyles } from "./AddSession.styles"

const AddSession = () => {
  const { t } = useTranslation("tools/journal/sessions/add")

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>
          <View style={addSessionStyles.dateSection}>
            <SectionHeader title="Quand ?" />

            <View style={addSessionStyles.dateSection.datePickerCard}>
              <View style={addSessionStyles.dateSection.datePickerCard.datePickerContainer}>
                {/* START DATE PICKER */}
                <TouchableOpacity style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker} onPress={() => {}}>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.text}>Début</Text>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.time}>21:10</Text>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.date}>Mer. 4 nov</Text>
                </TouchableOpacity>
                {/* END DATE PICKER */}
                <TouchableOpacity style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker}>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.text}>Fin</Text>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.time}>02:00</Text>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.date}>Jeu. 5 nov</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default AddSession
