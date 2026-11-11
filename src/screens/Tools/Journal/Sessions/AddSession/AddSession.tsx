import { View, ScrollView, TouchableOpacity, Text, Platform, Modal, Pressable } from "react-native"
import { useTranslation } from "react-i18next"
import { globalStyles } from "../../../../../helpers/globalStyles"
import { ScreenHeader } from "../../../../../components/ScreenHeader/ScreenHeader"
import SectionHeader from "../../../../../components/SectionHeader/SectionHeader"
import { addSessionStyles } from "./AddSession.styles"
import { useCallback, useState } from "react"
import { router, useFocusEffect } from "expo-router"
import { StatusBar } from "expo-status-bar"
import dayjs from "dayjs"
import TabSwitch from "../../../MoonCalendar/components/TabSwitch/TabSwitch"
import { useUserDataStore } from "../../../../../store/userData.store"
import { MapPin, Plus, Star, X } from "lucide-react-native"
import { app_colors, spacing } from "../../../../../helpers/variables"
import IconButtonCard from "../../../../../components/cards/IconButtonCard/IconButtonCard"
import { InputWithIcon } from "../../../../../components/InputWithIcon/InputWithIcon"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import DateTimePicker, { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker"

type SessionDateTarget = "start" | "end"
// Android n'a pas de mode "datetime" : on enchaîne sa boîte de dialogue date puis sa boîte de
// dialogue heure. iOS gère les deux d'un coup (mode "datetime"), affiché dans un panneau maison.
type AndroidPickerStep = "date" | "time"

const AddSession = () => {
  const { t } = useTranslation("tools/journal/sessions/add")
  const userObservatories = useUserDataStore(state => state.observatories)
  const userSetups = useUserDataStore(state => state.gear.setups)

  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("dark");
      return () => StatusBar.setStyle("dark");
    }, [])
  );

  const insets = useSafeAreaInsets()

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3600000)) // 1 hour later
  // null : aucun picker ouvert. `step` ne sert qu'à Android (date puis heure) ; iOS l'ignore et
  // affiche toujours son picker combiné "datetime".
  const [activePicker, setActivePicker] = useState<{ target: SessionDateTarget; step: AndroidPickerStep } | null>(null)
  const [selectedVenueType, setSelectedVenueType] = useState<"observatory" | "gps">("observatory")

  const [selectedSeeingGrade, setSelectedSeeingGrade] = useState<number>(0)
  const [selectedTransparencyGrade, setSelectedTransparencyGrade] = useState<number>(0)
  const [selectedDarknessGrade, setSelectedDarknessGrade] = useState<number>(0)

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [observedObjects, setObservedObjects] = useState<Array<any>>([])

  const [sessionNotes, setSessionNotes] = useState<string>("")

  const gradesRows = [
    {
      id: "seeing",
      label: "Seeing",
      description: "Stabilité de l'air",
      selectedGrade: selectedSeeingGrade,
      setSelectedGrade: setSelectedSeeingGrade,
      withBorder: true,
    },
    {
      id: "transparency",
      label: "Transparence",
      description: "Nuages, humidité",
      selectedGrade: selectedTransparencyGrade,
      setSelectedGrade: setSelectedTransparencyGrade,
      withBorder: true,
    },
    {
      id: "darkness",
      label: "Noirceur",
      description: "Pollution lumineuse",
      selectedGrade: selectedDarknessGrade,
      setSelectedGrade: setSelectedDarknessGrade,
      withBorder: false,
    }
  ]

  const openDateTimePicker = (target: SessionDateTarget) => setActivePicker({ target, step: "date" })
  const closeIosPicker = () => setActivePicker(null)

  // "dismissed" (bouton retour/tap hors boîte) : on ne chaîne pas vers l'étape heure côté Android.
  const handlePickerDismiss = () => setActivePicker(null)

  const handlePickerValueChange = (_event: DateTimePickerChangeEvent, selectedDate: Date) => {
    if (!activePicker) return

    const { target } = activePicker

    let newDate: Date
    if (Platform.OS === "android") {
      const baseDate = target === "start" ? startDate : endDate
      newDate = activePicker.step === "date"
        ? dayjs(baseDate).year(selectedDate.getFullYear()).month(selectedDate.getMonth()).date(selectedDate.getDate()).toDate()
        : dayjs(baseDate).hour(selectedDate.getHours()).minute(selectedDate.getMinutes()).toDate()
    } else {
      // iOS : picker combiné, mis à jour en direct, fermé via le bouton "Valider" du panneau.
      newDate = selectedDate
    }

    if (target === "start") {
      setStartDate(newDate)
      // La fin ne peut jamais précéder le début : si le nouveau début la dépasse, on la repousse
      // d'une heure derrière lui (même écart que la valeur initiale par défaut).
      if (newDate >= endDate) setEndDate(dayjs(newDate).add(1, "hour").toDate())
    } else {
      // Le picker est déjà borné par minimumDate={startDate} (date, et datetime sur iOS) — mais
      // côté Android, l'étape heure n'a pas d'équivalent, donc ce filet reste nécessaire.
      setEndDate(newDate < startDate ? startDate : newDate)
    }

    if (Platform.OS === "android") {
      setActivePicker(activePicker.step === "date" ? { ...activePicker, step: "time" } : null)
    }
  }

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
                <TouchableOpacity style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker} onPress={() => openDateTimePicker("start")}>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.text}>Début</Text>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.time}>{dayjs(startDate).format("HH:mm")}</Text>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.date}>{dayjs(startDate).format("ddd D MMM")}</Text>
                </TouchableOpacity>
                {/* END DATE PICKER */}
                <TouchableOpacity style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker} onPress={() => openDateTimePicker("end")}>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.text}>Fin</Text>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.time}>{dayjs(endDate).format("HH:mm")}</Text>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.date}>{dayjs(endDate).format("ddd D MMM")}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Android : boîte de dialogue native (date puis heure), déjà modale par nature. */}
            {Platform.OS === "android" && activePicker && (
              <DateTimePicker
                value={activePicker.target === "start" ? startDate : endDate}
                mode={activePicker.step}
                display="default"
                minimumDate={activePicker.target === "end" ? startDate : undefined}
                onValueChange={handlePickerValueChange}
                onDismiss={handlePickerDismiss}
              />
            )}

            {/* iOS : pas de mode "datetime" en boîte de dialogue système, on l'héberge dans un panneau maison. */}
            {Platform.OS === "ios" && (
              <Modal
                visible={activePicker !== null}
                animationType="slide"
                transparent
                statusBarTranslucent
                navigationBarTranslucent
                onRequestClose={closeIosPicker}
              >
                <View style={addSessionStyles.dateSection.pickerSheet.backdrop}>
                  <Pressable style={addSessionStyles.dateSection.pickerSheet.dismissArea} onPress={closeIosPicker} />

                  <View style={[addSessionStyles.dateSection.pickerSheet.container, { paddingBottom: spacing.modalSheet.bottom + insets.bottom }]}>
                    <View style={addSessionStyles.dateSection.pickerSheet.container.header}>
                      <Text style={addSessionStyles.dateSection.pickerSheet.container.header.title}>
                        {activePicker?.target === "start" ? "Début de la session" : "Fin de la session"}
                      </Text>
                      <TouchableOpacity onPress={closeIosPicker} accessibilityRole="button" hitSlop={10}>
                        <X color={app_colors.primary.main} size={20} />
                      </TouchableOpacity>
                    </View>

                    {activePicker && (
                      <DateTimePicker
                        value={activePicker.target === "start" ? startDate : endDate}
                        mode="datetime"
                        display="spinner"
                        minimumDate={activePicker.target === "end" ? startDate : undefined}
                        onValueChange={handlePickerValueChange}
                      />
                    )}

                    <TouchableOpacity style={addSessionStyles.dateSection.pickerSheet.container.doneButton} onPress={closeIosPicker}>
                      <Text style={addSessionStyles.dateSection.pickerSheet.container.doneButton.text}>Valider</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            )}
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
              {
                gradesRows.map((gradeRow) => (
                  <View key={gradeRow.id} style={[addSessionStyles.skyQualitySection.form.formRow, gradeRow.withBorder && addSessionStyles.skyQualitySection.form.formRow.withBorder]}>
                    <View style={addSessionStyles.skyQualitySection.form.formRow.leftColumn}>
                      <Text style={addSessionStyles.skyQualitySection.form.formRow.leftColumn.label}>{gradeRow.label}</Text>
                      <Text style={addSessionStyles.skyQualitySection.form.formRow.leftColumn.description}>{gradeRow.description}</Text>
                    </View>

                    <View style={addSessionStyles.skyQualitySection.form.formRow.grade}>
                      {
                        [1, 2, 3, 4, 5].map((grade) => (
                          <TouchableOpacity key={grade} style={addSessionStyles.skyQualitySection.form.formRow.grade.gradeButton} onPress={() => gradeRow.setSelectedGrade(grade)}>
                            <Star size={22} color={grade <= gradeRow.selectedGrade ? app_colors.accent.main : app_colors.primary.medium} fill={grade <= gradeRow.selectedGrade ? app_colors.accent.main : app_colors.yellow.light} />
                          </TouchableOpacity>
                        ))
                      }
                    </View>
                  </View>
                ))
              }
            </View>
          </View>

          {/* JOURNAL EN LUI MEME (OBJETS OBSERVÉS / DESSINÉS / PHOTOGRAPHIÉS) */}
          <View style={addSessionStyles.observationLogSection}>
            <SectionHeader title="Objets observés" subtitle={`${observedObjects.length} observés`} />

            <InputWithIcon
              placeholder={"Ajouter un objet : M13, JUpiter, NGC7000..."}
              value={sessionNotes}
              onChangeText={setSearchQuery}
              fill
              action={() => {/* TODO : ADD ACTION HERE*/}}
            />
          </View>

          {/* MATÉRIEL ET SETUPS UTILISÉS PENDANT LA SESSION */}
          <View style={addSessionStyles.usedGearSection}>
            <SectionHeader
              title="Matériel utilisé"
              button={{
                label: "Nouveau setup",
                onPress: () => router.push("/tools/journal/gear/"),
                icon: Plus
              }}
            />

            {
              userSetups.length === 0 && (
                <View style={addSessionStyles.usedGearSection.noSetups}>
                  <Text style={addSessionStyles.usedGearSection.noSetups.text}>Aucun setup disponible</Text>
                  <TouchableOpacity style={addSessionStyles.usedGearSection.noSetups.button} onPress={() => router.push("/tools/journal/gear/")}>
                    <Plus size={20} color={app_colors.white} />
                    <Text style={addSessionStyles.usedGearSection.noSetups.button.text}>Ajouter un setup</Text>
                  </TouchableOpacity>
                </View>
              )
            }
          </View>

          {/* NOTES ADDITIONELLES */}
          <View style={addSessionStyles.notesSection}>
            <SectionHeader title="Notes additionnelles" />

            <InputWithIcon
              placeholder={"Ajouter des notes sur la session, le ciel, le matériel, etc."}
              value={sessionNotes}
              onChangeText={setSessionNotes}
              multiline
              fill
              action={() => {/* TODO : ADD ACTION HERE*/}}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default AddSession
