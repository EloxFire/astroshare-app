import { View, ScrollView, TouchableOpacity, Text, Platform, Modal, Pressable } from "react-native"
import { useTranslation } from "react-i18next"
import type { TFunction } from "i18next"
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
import { Camera, Check, Clock, Eye, LocateFixed, MapPin, Pencil, Plus, Search, Star, X } from "lucide-react-native"
import { app_colors, spacing } from "../../../../../helpers/variables"
import IconButtonCard from "../../../../../components/cards/IconButtonCard/IconButtonCard"
import { InputWithIcon } from "../../../../../components/InputWithIcon/InputWithIcon"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import DateTimePicker, { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker"
import { useObjectSearch } from "../../../../../hooks/useObjectSearch"
import { CatalogObjectSummary } from "../../../../../types/catalog/CatalogObject"
import ObjectCardLite, { ObjectCardLiteToggle } from "../../../../../components/cards/ObjectCardLite/ObjectCardLite"
import CheckboxCard from "../../../../../components/cards/CheckboxCard/CheckboxCard"
import { formatCompactDuration } from "../../../../../helpers/format"
import { useLocation } from "../../../../../context/LocationContext"
import { generateCustomId } from "../../../../../helpers/ids"
import { AstronomySession, SessionObservedObject } from "../../../../../types/statistics/AstronomySession"

type SessionDateTarget = "start" | "end"
// Android n'a pas de mode "datetime" : on enchaîne sa boîte de dialogue date puis sa boîte de
// dialogue heure. iOS gère les deux d'un coup (mode "datetime"), affiché dans un panneau maison.
type AndroidPickerStep = "date" | "time"

type SessionObservedObjectFlag = "observedAtEyepiece" | "photographed" | "sketched"

const getCatalogObjectTitle = (catalogObject: CatalogObjectSummary) =>
  catalogObject.name === catalogObject.primary ? catalogObject.primary : `${catalogObject.primary} · ${catalogObject.name}`

// "Galaxie · Messier" (catégorie + catalogue, déduit du préfixe de la désignation principale) —
// pas de catalogue déduit pour une désignation qui ne vient d'aucun des trois (ex: une étoile nommée).
// Catégories de l'API /v3/objects traduites via observedObjects.categories ; une catégorie inconnue
// s'affiche telle quelle (defaultValue). `t` est passée par le composant plutôt que de traduire au
// chargement du module : le libellé suit ainsi un changement de langue.
const getCatalogObjectSubtitle = (catalogObject: CatalogObjectSummary, t: TFunction) => {
  const categoryLabel = t(`observedObjects.categories.${catalogObject.category}`, { defaultValue: catalogObject.category })
  const catalogLabel = /^M\s?\d/.test(catalogObject.primary) ? "Messier"
    : /^NGC/i.test(catalogObject.primary) ? "NGC"
    : /^IC/i.test(catalogObject.primary) ? "IC"
    : null

  return [categoryLabel, catalogLabel].filter(Boolean).join(" · ")
}

const AddSession = () => {
  const { t, i18n } = useTranslation("tools/journal/sessions/add")
  const userObservatories = useUserDataStore(state => state.observatories)
  const userSetups = useUserDataStore(state => state.gear.setups)
  const activeObservatoryId = useUserDataStore(state => state.activeObservatoryId)
  const addAstronomySession = useUserDataStore(state => state.addAstronomySession)
  const { gpsLocation } = useLocation()

  // Pas de reset au blur : voir le commentaire équivalent dans HomeScreen.tsx (course avec le
  // focus de l'écran suivant).
  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("dark");
    }, [])
  );

  const insets = useSafeAreaInsets()

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3600000)) // 1 hour later
  // null : aucun picker ouvert. `step` ne sert qu'à Android (date puis heure) ; iOS l'ignore et
  // affiche toujours son picker combiné "datetime".
  const [activePicker, setActivePicker] = useState<{ target: SessionDateTarget; step: AndroidPickerStep } | null>(null)
  const [selectedVenueType, setSelectedVenueType] = useState<"observatory" | "gps">("observatory")
  // Observatoire choisi pour la session : l'observatoire actif de l'app est présélectionné s'il y en
  // a un (lieu le plus probable), sinon aucun — l'utilisateur doit en toucher un.
  const [selectedObservatoryId, setSelectedObservatoryId] = useState<string | null>(
    () => userObservatories.some(observatory => observatory.id === activeObservatoryId) ? activeObservatoryId : null
  )

  const [selectedSeeingGrade, setSelectedSeeingGrade] = useState<number>(0)
  const [selectedTransparencyGrade, setSelectedTransparencyGrade] = useState<number>(0)
  const [selectedDarknessGrade, setSelectedDarknessGrade] = useState<number>(0)

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [observedObjects, setObservedObjects] = useState<SessionObservedObject[]>([])
  const { results: objectSearchResults, search: searchObjects } = useObjectSearch()

  // Setups utilisés pendant la session (sélection multiple). Leurs ids plutôt que les objets : les
  // Setup complets (attendus par AstronomySession.setups) seront retrouvés dans le store à
  // l'enregistrement, donc à jour même si un setup est modifié pendant que le formulaire est ouvert.
  const [selectedSetupIds, setSelectedSetupIds] = useState<string[]>([])

  const [sessionNotes, setSessionNotes] = useState<string>("")

  const selectedObservatory = userObservatories.find(observatory => observatory.id === selectedObservatoryId) ?? null
  const gpsLocationTitle = gpsLocation
    ? gpsLocation.local_names?.[i18n.language] || gpsLocation.name || `${gpsLocation.latitude.toFixed(3)}, ${gpsLocation.longitude.toFixed(3)}`
    : null
  // Seule condition pour enregistrer : un lieu (dates toujours cohérentes grâce aux pickers, le
  // reste est facultatif).
  const canSaveSession = selectedVenueType === "observatory" ? selectedObservatory !== null : gpsLocation !== null

  const handleSaveSession = () => {
    if (!canSaveSession) return

    const session: AstronomySession = {
      id: generateCustomId(),
      startTime: startDate.getTime(),
      endTime: endDate.getTime(),
      // Copie du lieu au moment de la session : elle reste lisible si l'observatoire est modifié ou
      // supprimé ensuite. Sans son image : une photo en base64 recopiée dans chaque session
      // alourdirait le stockage local pour rien (elle reste accessible via observatoryId).
      location: selectedVenueType === "observatory" && selectedObservatory ? { ...selectedObservatory, image: undefined } : gpsLocation!,
      observatoryId: selectedVenueType === "observatory" ? selectedObservatoryId : null,
      notes: sessionNotes.trim() || null,
      // 0 = note non donnée (aucune étoile touchée).
      grades: {
        seeing: selectedSeeingGrade || null,
        transparency: selectedTransparencyGrade || null,
        darkness: selectedDarknessGrade || null,
      },
      setups: selectedSetupIds.length > 0 ? userSetups.filter(setup => selectedSetupIds.includes(setup.id)) : null,
      // Déduits des objets observés : une session a donné lieu à des photos ou dessins si au moins
      // un objet a été photographié ou dessiné.
      astrophotos: observedObjects.some(entry => entry.photographed),
      drawings: observedObjects.some(entry => entry.sketched),
      observedObjects,
      // Pas encore saisis dans le formulaire.
      observations: { meteors: false, comets: false, eclipses: false, transits: false, occultations: false },
    }

    addAstronomySession(session)

    if (router.canGoBack()) router.back()
    else router.replace("/tools/journal")
  }

  const toggleSetupSelection = (setupId: string) => {
    setSelectedSetupIds(previousIds =>
      previousIds.includes(setupId)
        ? previousIds.filter(id => id !== setupId)
        : [...previousIds, setupId]
    )
  }

  const gradesRows = [
    {
      id: "seeing",
      label: t("skyQuality.seeing.label"),
      description: t("skyQuality.seeing.description"),
      selectedGrade: selectedSeeingGrade,
      setSelectedGrade: setSelectedSeeingGrade,
      withBorder: true,
    },
    {
      id: "transparency",
      label: t("skyQuality.transparency.label"),
      description: t("skyQuality.transparency.description"),
      selectedGrade: selectedTransparencyGrade,
      setSelectedGrade: setSelectedTransparencyGrade,
      withBorder: true,
    },
    {
      id: "darkness",
      label: t("skyQuality.darkness.label"),
      description: t("skyQuality.darkness.description"),
      selectedGrade: selectedDarknessGrade,
      setSelectedGrade: setSelectedDarknessGrade,
      withBorder: false,
    }
  ]

  const handleSearchQueryChange = (text: string) => {
    setSearchQuery(text)
    searchObjects(text)
  }

  // Les suggestions de InputWithIcon ne portent qu'un libellé (string) : on retrouve l'objet
  // complet correspondant dans les résultats de recherche, par position (même ordre, même source).
  const handleObjectSuggestionPress = (suggestion: string) => {
    const pickedObject = objectSearchResults[objectSearchResults.map(result => result.name).indexOf(suggestion)]
    if (!pickedObject) return

    setObservedObjects(previousObjects => {
      if (previousObjects.some(entry => entry.object.id === pickedObject.id)) return previousObjects
      // Ajouter l'objet à la liste vaut en soi pour une observation à l'oculaire ; photo/dessin
      // restent à cocher explicitement.
      return [...previousObjects, { object: pickedObject, observedAtEyepiece: true, photographed: false, sketched: false }]
    })
    setSearchQuery("")
    searchObjects("")
  }

  const toggleObservedObjectFlag = (objectId: string, flag: SessionObservedObjectFlag) => {
    setObservedObjects(previousObjects => previousObjects.map(entry =>
      entry.object.id === objectId ? { ...entry, [flag]: !entry[flag] } : entry
    ))
  }

  const removeObservedObject = (objectId: string) => {
    setObservedObjects(previousObjects => previousObjects.filter(entry => entry.object.id !== objectId))
  }

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

      {/* "handled" : avec le clavier ouvert, un appui sur un bouton (ex: une suggestion de la
          recherche d'objets) est traité tout de suite, au lieu de ne servir qu'à fermer le clavier. */}
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={globalStyles.content}>
          <View style={addSessionStyles.dateSection}>
            <SectionHeader title={t("date.title")} />

            <View style={addSessionStyles.dateSection.datePickerCard}>
              <View style={addSessionStyles.dateSection.datePickerCard.datePickerContainer}>
                {/* START DATE PICKER */}
                <TouchableOpacity style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker} onPress={() => openDateTimePicker("start")}>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.text}>{t("date.start")}</Text>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.time}>{dayjs(startDate).format("HH:mm")}</Text>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.date}>{dayjs(startDate).format("ddd D MMM")}</Text>
                </TouchableOpacity>
                {/* END DATE PICKER */}
                <TouchableOpacity style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker} onPress={() => openDateTimePicker("end")}>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.text}>{t("date.end")}</Text>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.time}>{dayjs(endDate).format("HH:mm")}</Text>
                  <Text style={addSessionStyles.dateSection.datePickerCard.datePickerContainer.picker.date}>{dayjs(endDate).format("ddd D MMM")}</Text>
                </TouchableOpacity>
              </View>

              <View style={addSessionStyles.dateSection.datePickerCard.timespanContainer}>
                <Clock color={app_colors.yellow.main} size={18} />
                <Text style={addSessionStyles.dateSection.datePickerCard.timespanContainer.text}>{t("date.duration", { duration: formatCompactDuration(dayjs(endDate).diff(startDate, "minute")) })}</Text>
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
                        {activePicker?.target === "start" ? t("date.picker.startTitle") : t("date.picker.endTitle")}
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
                      <Text style={addSessionStyles.dateSection.pickerSheet.container.doneButton.text}>{t("date.picker.done")}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            )}
          </View>

          <View style={addSessionStyles.venueSection}>
            <SectionHeader title={t("venue.title")} />

            <TabSwitch
              tabs={[
                {
                  text: t("venue.tabs.observatory")
                },
                {
                  text: t("venue.tabs.gps")
                }
              ]}
              activeTab={selectedVenueType === "observatory" ? 0 : 1}
              onTabPress={(tab) => setSelectedVenueType(tab === 0 ? "observatory" : "gps")}
            />

            {/* TODO : Probleme de GoBack lorsque on navige vers le lien d'ajout ici */}
            {
              userObservatories.length === 0 && selectedVenueType === "observatory" && (
                <View style={addSessionStyles.venueSection.noObservatories}>
                  <Text style={addSessionStyles.venueSection.noObservatories.text}>{t("venue.noObservatories")}</Text>
                  <TouchableOpacity style={addSessionStyles.venueSection.noObservatories.button} onPress={() => router.push("/settings/observatories/addNewObservatory")}>
                    <Plus size={20} color={app_colors.white} />
                    <Text style={addSessionStyles.venueSection.noObservatories.button.text}>{t("venue.addObservatory")}</Text>
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
                        key={observatory.id}
                        title={observatory.display_name}
                        icon={MapPin}
                        subtitle={observatory.light_pollution ? t("venue.savedObservatoryWithBortle", { bortle: observatory.light_pollution.bortle }) : t("venue.savedObservatory")}
                        selected={observatory.id === selectedObservatoryId}
                        onPress={() => setSelectedObservatoryId(observatory.id)}
                      />
                    ))
                  }
                </View>
              )
            }
            {/* Position GPS : celle lue par l'app (LocationContext), seule possible ici. */}
            {
              selectedVenueType === "gps" && (
                gpsLocation && gpsLocationTitle ? (
                  <View style={addSessionStyles.venueSection.observatoryList}>
                    <IconButtonCard
                      icon={LocateFixed}
                      title={gpsLocationTitle}
                      subtitle={t("venue.currentPosition")}
                      selected
                    />
                  </View>
                ) : (
                  <View style={addSessionStyles.venueSection.noObservatories}>
                    <Text style={addSessionStyles.venueSection.noObservatories.text}>{t("venue.positionUnavailable")}</Text>
                  </View>
                )
              )
            }
          </View>

          <View style={addSessionStyles.skyQualitySection}>
            <SectionHeader title={t("skyQuality.title")} />
            
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
            <SectionHeader title={t("observedObjects.title")} subtitle={t("observedObjects.count", { count: observedObjects.length })} />

            {/* TODO : Fix problème sur la recherche, plus de suggestions apres un certain nombre de recherches, probleme de CSS sur le bas de l'input */}
            {/* TODO : Revoir le systeme d'affichage de suggestions */}
            <InputWithIcon
              placeholder={t("observedObjects.searchPlaceholder")}
              value={searchQuery}
              onChangeText={handleSearchQueryChange}
              suggestions={objectSearchResults.map(result => result.name)}
              onSuggestionPress={handleObjectSuggestionPress}
              fill
              action={() => {}}
              icon={Search}
            />

            {
              observedObjects.length === 0 ? (
                <View style={addSessionStyles.observationLogSection.noItems}>
                  <Text style={addSessionStyles.observationLogSection.noItems.text}>{t("observedObjects.empty")}</Text>
                </View>
              ) : (
                <View style={addSessionStyles.observationLogSection.objectsList}>
                  {
                    observedObjects.map((entry, index) => {
                      const toggles: ObjectCardLiteToggle[] = [
                        { icon: Eye, active: entry.observedAtEyepiece, onPress: () => toggleObservedObjectFlag(entry.object.id, "observedAtEyepiece"), accessibilityLabel: t("observedObjects.toggles.observedAtEyepiece") },
                        { icon: Camera, active: entry.photographed, onPress: () => toggleObservedObjectFlag(entry.object.id, "photographed"), accessibilityLabel: t("observedObjects.toggles.photographed") },
                        { icon: Pencil, active: entry.sketched, onPress: () => toggleObservedObjectFlag(entry.object.id, "sketched"), accessibilityLabel: t("observedObjects.toggles.sketched") },
                      ]

                      return (
                        <ObjectCardLite
                          key={entry.object.id}
                          title={getCatalogObjectTitle(entry.object)}
                          subtitle={getCatalogObjectSubtitle(entry.object, t)}
                          withBorder={index !== observedObjects.length - 1}
                          toggles={toggles}
                          onPress={() => {/* TODO : navigation vers la fiche détaillée de l'objet, une fois l'écran construit */}}
                          onRemove={() => removeObservedObject(entry.object.id)}
                        />
                      )
                    })
                  }
                </View>
              )
            }
          </View>

          {/* MATÉRIEL ET SETUPS UTILISÉS PENDANT LA SESSION */}
          <View style={addSessionStyles.usedGearSection}>
            <SectionHeader
              title={t("gear.title")}
              button={{
                label: t("gear.newSetup"),
                onPress: () => router.push("/tools/journal/gear/"),
                icon: Plus
              }}
            />

            {
              userSetups.length === 0 && (
                <View style={addSessionStyles.usedGearSection.noSetups}>
                  <Text style={addSessionStyles.usedGearSection.noSetups.text}>{t("gear.noSetups")}</Text>
                  <TouchableOpacity style={addSessionStyles.usedGearSection.noSetups.button} onPress={() => router.push("/tools/journal/gear/")}>
                    <Plus size={20} color={app_colors.white} />
                    <Text style={addSessionStyles.usedGearSection.noSetups.button.text}>{t("gear.addSetup")}</Text>
                  </TouchableOpacity>
                </View>
              )
            }

            <View style={addSessionStyles.usedGearSection.setupsList}>
              {
                userSetups.map((setup) => {
                  return (
                    <CheckboxCard
                      key={setup.id}
                      title={setup.name}
                      checked={selectedSetupIds.includes(setup.id)}
                      // subtitle={setup.scope?.name ? `Télescope : ${setup.scope.name}` : undefined}
                      onChange={() => toggleSetupSelection(setup.id)}
                    />
                  )
                })
              }
            </View>
          </View>

          {/* NOTES ADDITIONELLES */}
          <View style={addSessionStyles.notesSection}>
            <SectionHeader title={t("notes.title")} />

            <InputWithIcon
              placeholder={t("notes.placeholder")}
              value={sessionNotes}
              onChangeText={setSessionNotes}
              multiline
              fill
              action={() => {/* TODO : ADD ACTION HERE*/}}
            />
          </View>

          {/* ENREGISTREMENT DE LA SESSION */}
          <View style={addSessionStyles.saveSection}>
            <TouchableOpacity
              style={[addSessionStyles.saveSection.button, !canSaveSession && addSessionStyles.saveSection.button.disabled]}
              onPress={handleSaveSession}
              disabled={!canSaveSession}
            >
              <Check size={20} color={app_colors.white} />
              <Text style={addSessionStyles.saveSection.button.text}>{t("save")}</Text>
            </TouchableOpacity>
            {!canSaveSession && <Text style={addSessionStyles.saveSection.hint}>{t("missingVenue")}</Text>}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default AddSession
