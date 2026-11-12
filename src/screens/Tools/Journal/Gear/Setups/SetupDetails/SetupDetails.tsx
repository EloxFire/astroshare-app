import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { router, useLocalSearchParams } from "expo-router"
import { Calendar, ChevronRight, Pencil, Trash2 } from "lucide-react-native"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { app_colors } from "../../../../../../helpers/variables"
import { formatDuration } from "../../../../../../helpers/format"
import { gearName } from "../../../../../../helpers/gear/gearName"
import { getSetupPieceCount } from "../../../../../../helpers/gear/setups"
import { useAppUnits } from "../../../../../../hooks/useAppUnits"
import { ScreenHeader } from "../../../../../../components/ScreenHeader/ScreenHeader"
import SectionHeader from "../../../../../../components/SectionHeader/SectionHeader"
import { useUserDataStore } from "../../../../../../store/userData.store"
import { setupDetailsStyles } from "./SetupDetails.styles"

// Les deux formes possibles de `AstronomySession.location` : un Observatory enregistré (toujours
// un display_name) ou une simple position GPS ponctuelle (name facultatif).
const getLocationLabel = (location: { display_name?: string; name?: string }, fallback: string): string =>
  location.display_name || location.name || fallback

const SetupDetails = () => {
  const { t } = useTranslation("tools/journal/gear/setups/details")
  const { formatDate } = useAppUnits()

  const setupId = useLocalSearchParams().id as string
  const setups = useUserDataStore(state => state.gear.setups)
  const astronomySessions = useUserDataStore(state => state.statistics.astronomySessions)
  const removeSetup = useUserDataStore(state => state.removeSetup)

  const setup = setups.find(item => item.id === setupId)

  useEffect(() => {
    if (!setup) {
      router.push("/tools/journal/gear")
    }
  }, [setup])

  if (!setup) return null

  const pieceCount = getSetupPieceCount(setup)

  const sessionsUsingSetup = astronomySessions.filter(session => session.setups?.some(s => s.id === setup.id))

  const handleDelete = () => {
    removeSetup(setup.id)
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>

          <View style={setupDetailsStyles.heroCard}>
            <Text style={setupDetailsStyles.heroCard.title}>{setup.name}</Text>
            {setup.description && <Text style={setupDetailsStyles.heroCard.description}>{setup.description}</Text>}

            <View style={setupDetailsStyles.heroCard.pieceCount}>
              <Text style={setupDetailsStyles.heroCard.pieceCount.value}>{pieceCount}</Text>
              <Text style={setupDetailsStyles.heroCard.pieceCount.label}>{pieceCount > 1 ? t("pieceCount_other") : t("pieceCount_one")}</Text>
            </View>
          </View>

          <View style={setupDetailsStyles.topRow}>
            <TouchableOpacity
              style={setupDetailsStyles.topRow.editButton}
              onPress={() => router.push(`/tools/journal/gear/setups/add?id=${setup.id}`)}
            >
              <Pencil size={14} color={app_colors.primary.main} />
              <Text style={setupDetailsStyles.topRow.editButton.text}>{t("editButton")}</Text>
            </TouchableOpacity>
          </View>

          <View style={setupDetailsStyles.compositionSection}>
            <SectionHeader title={t("sections.composition.title")} />

            {
              [
                { title: t("categories.telescope.title"), badge: t("badges.single"), items: setup.scope ? [gearName(setup.scope.name, setup.scope.brand, setup.scope.model, t("categories.telescope.title"))] : [] },
                { title: t("categories.mount.title"), badge: t("badges.single"), items: setup.mount ? [gearName(setup.mount.name, setup.mount.brand, setup.mount.model, t("categories.mount.title"))] : [] },
                { title: t("categories.eyepieces.title"), badge: t("badges.multiple"), items: setup.eyepieces.map(e => gearName(e.name, e.brand, e.model, t("categories.eyepieces.title"))) },
                { title: t("categories.filters.title"), badge: t("badges.multiple"), items: setup.filters.map(f => gearName(f.name, f.brand, f.model, t("categories.filters.title"))) },
                { title: t("categories.cameras.title"), badge: t("badges.multiple"), items: setup.cameras.map(c => gearName(c.name, c.brand, c.model, t("categories.cameras.title"))) },
                { title: t("categories.guideScope.title"), badge: t("badges.single"), items: setup.guideScope ? [gearName(setup.guideScope.name, setup.guideScope.brand, setup.guideScope.model, t("categories.guideScope.title"))] : [] },
                { title: t("categories.guideCamera.title"), badge: t("badges.single"), items: setup.guideCamera ? [gearName(setup.guideCamera.name, setup.guideCamera.brand, setup.guideCamera.model, t("categories.cameras.title"))] : [] },
                { title: t("categories.focusers.title"), badge: t("badges.multiple"), items: setup.focusers.map(f => gearName(f.name, f.brand, f.model, t("categories.focusers.title"))) },
              ].map(category => (
                <View key={category.title} style={setupDetailsStyles.categoryCard}>
                  <View style={setupDetailsStyles.categoryCard.header}>
                    <Text style={setupDetailsStyles.categoryCard.header.title}>{category.title}</Text>
                    <Text style={setupDetailsStyles.categoryCard.header.badge}>{category.badge}</Text>
                  </View>

                  {
                    category.items.length === 0 ? (
                      <Text style={setupDetailsStyles.categoryCard.emptyText}>{t("emptyCategory")}</Text>
                    ) : (
                      <View style={setupDetailsStyles.categoryCard.chipsRow}>
                        {
                          category.items.map((label, index) => (
                            <View key={`${label}-${index}`} style={setupDetailsStyles.categoryCard.chip}>
                              <Text style={setupDetailsStyles.categoryCard.chip.text}>{label}</Text>
                            </View>
                          ))
                        }
                      </View>
                    )
                  }
                </View>
              ))
            }
          </View>

          <View style={setupDetailsStyles.sessionsSection}>
            <SectionHeader title={t("sessions.title")} />

            {
              sessionsUsingSetup.length === 0 ? (
                <View style={setupDetailsStyles.sessionsSection.noItems}>
                  <Text style={setupDetailsStyles.sessionsSection.noItems.text}>{t("sessions.noSessions")}</Text>
                </View>
              ) : (
                sessionsUsingSetup.map(session => (
                  <TouchableOpacity
                    key={session.id}
                    style={setupDetailsStyles.sessionsSection.row}
                    onPress={() => router.push(`/tools/journal/sessions/${session.id}`)}
                  >
                    <View style={setupDetailsStyles.sessionsSection.row.iconBadge}>
                      <Calendar size={20} color={app_colors.primary.main} />
                    </View>
                    <View style={setupDetailsStyles.sessionsSection.row.textBlock}>
                      <Text style={setupDetailsStyles.sessionsSection.row.textBlock.title}>
                        {getLocationLabel(session.location, t("sessions.unknownLocation"))}
                      </Text>
                      <Text style={setupDetailsStyles.sessionsSection.row.textBlock.subtitle}>
                        {formatDate(session.startTime).format("D MMM")} · {formatDuration((session.endTime - session.startTime) / 1000, t)}
                      </Text>
                    </View>
                    <ChevronRight size={20} color={app_colors.accent.main} />
                  </TouchableOpacity>
                ))
              )
            }
          </View>

          <View style={setupDetailsStyles.actions}>
            <TouchableOpacity style={setupDetailsStyles.actions.deleteButton} onPress={handleDelete}>
              <Trash2 color={app_colors.red.main} size={18} />
              <Text style={setupDetailsStyles.actions.deleteButton.text}>{t("deleteButton")}</Text>
            </TouchableOpacity>
            <Text style={setupDetailsStyles.actions.deleteWarning}>{t("deleteWarning")}</Text>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

export default SetupDetails
