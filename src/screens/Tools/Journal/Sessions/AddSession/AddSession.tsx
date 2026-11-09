import { View, ScrollView, TouchableOpacity, Text } from "react-native"
import { useTranslation } from "react-i18next"
import { globalStyles } from "../../../../../helpers/globalStyles"
import { ScreenHeader } from "../../../../../components/ScreenHeader/ScreenHeader"
import SectionHeader from "../../../../../components/SectionHeader/SectionHeader"
import { addSessionStyles } from "./AddSession.styles"
import { useCallback, useState } from "react"
import { router, useFocusEffect } from "expo-router"
import { StatusBar } from "expo-status-bar"
import dayjs from "dayjs"
import SwitchButton from "../../../../../components/SwitchButton/SwitchButton"
import TabSwitch from "../../../MoonCalendar/components/TabSwitch/TabSwitch"
import { useUserDataStore } from "../../../../../store/userData.store"
import { MapPin, Plus, Star } from "lucide-react-native"
import { app_colors } from "../../../../../helpers/variables"
import IconButtonCard from "../../../../../components/cards/IconButtonCard/IconButtonCard"

const AddSession = () => {
  const { t } = useTranslation("tools/journal/sessions/add")
  const userObservatories = useUserDataStore(state => state.observatories)

  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("dark");
      return () => StatusBar.setStyle("dark");
    }, [])
  );

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3600000)) // 1 hour later
  const [selectedVenueType, setSelectedVenueType] = useState<"observatory" | "gps">("observatory")

  const [selectedSeeingGrade, setSelectedSeeingGrade] = useState<number>(0)

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
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.time}>{dayjs(startDate).format("HH:mm")}</Text>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.date}>{dayjs(startDate).format("ddd D MMM")}</Text>
                </TouchableOpacity>
                {/* END DATE PICKER */}
                <TouchableOpacity style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker}>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.text}>Fin</Text>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.time}>{dayjs(endDate).format("HH:mm")}</Text>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.date}>{dayjs(endDate).format("ddd D MMM")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={addSessionStyles.venueSection}>
            <SectionHeader title="Quel lieu ?" />

            <TabSwitch
              tabs={[
                {
                  text: "Observatoire"
                },
                {
                  text: "Position GPS"
                }
              ]}
              activeTab={selectedVenueType === "observatory" ? 0 : 1}
              onTabPress={(tab) => setSelectedVenueType(tab === 0 ? "observatory" : "gps")}
            />

            {/* TODO : Probleme de GoBack lorsque on navige vers le lien d'ajout ici */}
            {
              userObservatories.length === 0 && selectedVenueType === "observatory" && (
                <View style={addSessionStyles.venueSection.noObservatories}>
                  <Text style={addSessionStyles.venueSection.noObservatories.text}>Aucun observatoire disponible</Text>
                  <TouchableOpacity style={addSessionStyles.venueSection.noObservatories.button} onPress={() => router.push("/settings/observatories/addNewObservatory")}>
                    <Plus size={20} color={app_colors.white} />
                    <Text style={addSessionStyles.venueSection.noObservatories.button.text}>Ajouter un observatoire</Text>
                  </TouchableOpacity>
                </View>
              )
            }
            {
              selectedVenueType === "observatory" && userObservatories.length > 0 && (
                <View style={addSessionStyles.venueSection.observatoryList}>
                  {
                    userObservatories.map((observatory) => (
                      <IconButtonCard
                        title={observatory.display_name}
                        icon={MapPin}
                        subtitle={observatory.light_pollution ? `Observatoire enregistré - Bortle ${observatory.light_pollution.bortle}` : "Observatoire enregistré"}
                      />
                    ))
                  }
                </View>
              )
            }
          </View>

          <View style={addSessionStyles.skyQualitySection}>
            <SectionHeader title="Qualité du ciel" />
            
            <View style={addSessionStyles.skyQualitySection.form}>
              <View style={addSessionStyles.skyQualitySection.form.formRow}>
                <View style={addSessionStyles.skyQualitySection.form.formRow.leftColumn}>
                  <Text style={addSessionStyles.skyQualitySection.form.formRow.leftColumn.label}>Seeing</Text>
                  <Text style={addSessionStyles.skyQualitySection.form.formRow.leftColumn.description}>Stabilité de l'air</Text>
                </View>

                <View style={addSessionStyles.skyQualitySection.form.formRow.grade}>
                  {
                    [1, 2, 3, 4, 5].map((grade) => (
                      <TouchableOpacity key={grade} style={addSessionStyles.skyQualitySection.form.formRow.grade.gradeButton} onPress={() => {}}>
                        <Star size={25} color={app_colors.grey} fill={app_colors.accent.main} />
                      </TouchableOpacity>
                    ))
                  }
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default AddSession
