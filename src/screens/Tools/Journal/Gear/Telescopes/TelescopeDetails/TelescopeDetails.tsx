import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { router, useLocalSearchParams } from "expo-router"
import { ChevronRight, Pencil, Telescope as TelescopeIcon, Layers, Trash2 } from "lucide-react-native"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { app_colors, withOpacity } from "../../../../../../helpers/variables"
import { getFocalRatioProfile, getUsefulMagnificationRange } from "../../../../../../helpers/gear/telescopes"
import { useAppUnits } from "../../../../../../hooks/useAppUnits"
import { ScreenHeader } from "../../../../../../components/ScreenHeader/ScreenHeader"
import SectionHeader from "../../../../../../components/SectionHeader/SectionHeader"
import ValueCard from "../../../../../../components/cards/ValueCard/ValueCard"
import { useUserDataStore } from "../../../../../../store/userData.store"
import { telescopeDetailsStyles } from "./TelescopeDetails.styles"

const TelescopeDetails = () => {
  const { t } = useTranslation("tools/journal/gear/telescopes/details")
  const { formatDate } = useAppUnits()

  const telescopeId = useLocalSearchParams().id as string
  const telescopes = useUserDataStore(state => state.gear.telescopes)
  const setups = useUserDataStore(state => state.gear.setups)
  const astronomySessions = useUserDataStore(state => state.statistics.astronomySessions)
  const removeTelescope = useUserDataStore(state => state.removeTelescope)

  const telescope = telescopes.find(scope => scope.id === telescopeId)

  // Pas de router.push direct dans le corps du rendu (voir le même commentaire dans
  // ObservatoryDetails) : après suppression, `telescope` passe à undefined au re-render, et c'est
  // ce useEffect qui gère la redirection une fois ce rendu terminé.
  useEffect(() => {
    if (!telescope) {
      router.push("/tools/journal/gear")
    }
  }, [telescope])

  if (!telescope) return null

  const focalRatio = telescope.focalLength / telescope.aperture
  const focalRatioProfile = getFocalRatioProfile(focalRatio)
  const magnificationRange = getUsefulMagnificationRange(telescope.aperture)
  const displayName = telescope.name || [telescope.brand, telescope.model].filter(Boolean).join(" ") || t("kindLabel")

  const setupsUsingTelescope = setups.filter(setup => setup.scope?.id === telescope.id)

  const handleDelete = () => {
    removeTelescope(telescope.id)
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>


          <View style={telescopeDetailsStyles.heroCard}>
            <View style={telescopeDetailsStyles.heroCard.topRow}>
              <View style={telescopeDetailsStyles.heroCard.topRow.iconBadge}>
                <TelescopeIcon size={24} color={app_colors.primary.main} />
              </View>
              <View style={telescopeDetailsStyles.heroCard.topRow.textBlock}>
                <Text style={telescopeDetailsStyles.heroCard.topRow.textBlock.kindLabel}>
                  {t("kindLabel")} · {t(`types.${telescope.type}`)}
                </Text>
                <Text style={telescopeDetailsStyles.heroCard.topRow.textBlock.title}>{displayName}</Text>
              </View>
            </View>

            {
              telescope.usages.length > 0 && (
                <View style={telescopeDetailsStyles.heroCard.chipsRow}>
                  {
                    telescope.usages.map(usage => (
                      <View key={usage} style={telescopeDetailsStyles.heroCard.chipsRow.chip}>
                        <Text style={telescopeDetailsStyles.heroCard.chipsRow.chip.text}>{t(`usages.${usage}`)}</Text>
                      </View>
                    ))
                  }
                </View>
              )
            }
          </View>
          
          <View style={telescopeDetailsStyles.topRow}>
            <TouchableOpacity
              style={telescopeDetailsStyles.topRow.editButton}
              onPress={() => router.push(`/tools/journal/gear/telescopes/add?id=${telescope.id}`)}
            >
              <Pencil size={14} color={app_colors.primary.main} />
              <Text style={telescopeDetailsStyles.topRow.editButton.text}>{t("editButton")}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <SectionHeader title={t("characteristics.title")} />

            <View style={telescopeDetailsStyles.characteristicsGrid}>
              <View style={telescopeDetailsStyles.characteristicsGrid.row}>
                <ValueCard
                  title={t("characteristics.aperture.label")}
                  value={`${telescope.aperture} mm`}
                  containerStyle={[globalStyles.defaultCard]}
                  small
                  reverse
                  titleStyle={{ textTransform: "none" }}
                />
                <ValueCard
                  title={t("characteristics.focalLength.label")}
                  value={`${telescope.focalLength} mm`}
                  containerStyle={[globalStyles.defaultCard]}
                  small
                  reverse
                  titleStyle={{ textTransform: "none" }}
                />
              </View>

              <View style={telescopeDetailsStyles.characteristicsGrid.row}>
                <ValueCard
                  title={`${t("characteristics.focalRatio.label")} · ${t(`characteristics.focalRatio.profiles.${focalRatioProfile}`)}`}
                  value={`F/${focalRatio.toFixed(1)}`}
                  containerStyle={{ backgroundColor: app_colors.primary.main }}
                  valueStyle={{ color: app_colors.ambre.main }}
                  titleStyle={{ textTransform: "none", color: withOpacity(app_colors.white, 0.6) }}
                  small
                  reverse
                />
                <ValueCard
                  title={t("characteristics.usefulMagnification.label")}
                  value={t("characteristics.usefulMagnification.range", magnificationRange)}
                  containerStyle={[globalStyles.defaultCard]}
                  small
                  reverse
                  titleStyle={{ textTransform: "none" }}
                />
              </View>
            </View>
          </View>

          <View style={telescopeDetailsStyles.usedInSection}>
            <SectionHeader title={t("usedIn.title")} />

            {
              setupsUsingTelescope.length === 0 ? (
                <View style={telescopeDetailsStyles.usedInSection.noItems}>
                  <Text style={telescopeDetailsStyles.usedInSection.noItems.text}>{t("usedIn.noSetups")}</Text>
                </View>
              ) : (
                setupsUsingTelescope.map(setup => {
                  const setupSessions = astronomySessions.filter(session => session.setups?.some(s => s.id === setup.id))
                  const lastSessionTimestamp = setupSessions.length > 0 ? Math.max(...setupSessions.map(session => session.startTime)) : null

                  return (
                    <TouchableOpacity
                      key={setup.id}
                      style={telescopeDetailsStyles.usedInSection.row}
                      onPress={() => router.push(`/tools/journal/gear/setups/${setup.id}`)}
                    >
                      <View style={telescopeDetailsStyles.usedInSection.row.iconBadge}>
                        <Layers size={20} color={app_colors.primary.main} />
                      </View>
                      <View style={telescopeDetailsStyles.usedInSection.row.textBlock}>
                        <Text style={telescopeDetailsStyles.usedInSection.row.textBlock.title}>{setup.name}</Text>
                        <Text style={telescopeDetailsStyles.usedInSection.row.textBlock.subtitle}>
                          {t("usedIn.sessionsCount", { count: setupSessions.length })}
                          {lastSessionTimestamp && ` · ${t("usedIn.lastSession", { date: formatDate(lastSessionTimestamp).format("D MMM") })}`}
                        </Text>
                      </View>
                      <ChevronRight size={20} color={app_colors.accent.main} />
                    </TouchableOpacity>
                  )
                })
              )
            }
          </View>

          <View style={telescopeDetailsStyles.notesCard}>
            <Text style={telescopeDetailsStyles.notesCard.title}>{t("notes.title")}</Text>
            <Text style={telescopeDetailsStyles.notesCard.text}>{telescope.notes || t("notes.empty")}</Text>
          </View>

          <View style={telescopeDetailsStyles.actions}>
            <TouchableOpacity style={telescopeDetailsStyles.actions.deleteButton} onPress={handleDelete}>
              <Trash2 color={app_colors.red.main} size={18} />
              <Text style={telescopeDetailsStyles.actions.deleteButton.text}>{t("deleteButton")}</Text>
            </TouchableOpacity>
            <Text style={telescopeDetailsStyles.actions.deleteWarning}>{t("deleteWarning")}</Text>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

export default TelescopeDetails
