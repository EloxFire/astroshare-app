import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { router, useLocalSearchParams } from "expo-router"
import { ChevronRight, Crosshair, Layers, Pencil, Trash2 } from "lucide-react-native"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { app_colors } from "../../../../../../helpers/variables"
import { useAppUnits } from "../../../../../../hooks/useAppUnits"
import { ScreenHeader } from "../../../../../../components/ScreenHeader/ScreenHeader"
import SectionHeader from "../../../../../../components/SectionHeader/SectionHeader"
import ValueCard from "../../../../../../components/cards/ValueCard/ValueCard"
import { useUserDataStore } from "../../../../../../store/userData.store"
import { guideScopeDetailsStyles } from "./GuideScopeDetails.styles"

const GuideScopeDetails = () => {
  const { t } = useTranslation("tools/journal/gear/guideScopes/details")
  const { formatDate } = useAppUnits()

  const guideScopeId = useLocalSearchParams().id as string
  const guideScopes = useUserDataStore(state => state.gear.guideScopes)
  const setups = useUserDataStore(state => state.gear.setups)
  const astronomySessions = useUserDataStore(state => state.statistics.astronomySessions)
  const removeGuideScope = useUserDataStore(state => state.removeGuideScope)

  const guideScope = guideScopes.find(item => item.id === guideScopeId)

  useEffect(() => {
    if (!guideScope) {
      router.push("/tools/journal/gear")
    }
  }, [guideScope])

  if (!guideScope) return null

  const displayName = guideScope.name || [guideScope.brand, guideScope.model].filter(Boolean).join(" ") || t("kindLabel")
  const setupsUsingGuideScope = setups.filter(setup => setup.guideScope?.id === guideScope.id)

  const handleDelete = () => {
    removeGuideScope(guideScope.id)
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>

          <View style={guideScopeDetailsStyles.heroCard}>
            <View style={guideScopeDetailsStyles.heroCard.iconBadge}>
              <Crosshair size={24} color={app_colors.primary.main} />
            </View>
            <View style={guideScopeDetailsStyles.heroCard.textBlock}>
              <Text style={guideScopeDetailsStyles.heroCard.textBlock.kindLabel}>
                {t("kindLabel")} · {t(`types.${guideScope.type}`)}
              </Text>
              <Text style={guideScopeDetailsStyles.heroCard.textBlock.title}>{displayName}</Text>
            </View>
          </View>

          <View style={guideScopeDetailsStyles.topRow}>
            <TouchableOpacity
              style={guideScopeDetailsStyles.topRow.editButton}
              onPress={() => router.push(`/tools/journal/gear/guide-scopes/add?id=${guideScope.id}`)}
            >
              <Pencil size={14} color={app_colors.primary.main} />
              <Text style={guideScopeDetailsStyles.topRow.editButton.text}>{t("editButton")}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <SectionHeader title={t("characteristics.title")} />

            <View style={guideScopeDetailsStyles.characteristicsRow}>
              <ValueCard
                title={t("characteristics.aperture.label")}
                value={`${guideScope.aperture} mm`}
                containerStyle={[globalStyles.defaultCard]}
                small
                reverse
                titleStyle={{ textTransform: "none" }}
              />
              <ValueCard
                title={t("characteristics.focalLength.label")}
                value={`${guideScope.focalLength} mm`}
                containerStyle={[globalStyles.defaultCard]}
                small
                reverse
                titleStyle={{ textTransform: "none" }}
              />
            </View>
          </View>

          <View style={guideScopeDetailsStyles.usedInSection}>
            <SectionHeader title={t("usedIn.title")} />

            {
              setupsUsingGuideScope.length === 0 ? (
                <View style={guideScopeDetailsStyles.usedInSection.noItems}>
                  <Text style={guideScopeDetailsStyles.usedInSection.noItems.text}>{t("usedIn.noSetups")}</Text>
                </View>
              ) : (
                setupsUsingGuideScope.map(setup => {
                  const setupSessions = astronomySessions.filter(session => session.setups?.some(s => s.id === setup.id))
                  const lastSessionTimestamp = setupSessions.length > 0 ? Math.max(...setupSessions.map(session => session.startTime)) : null

                  return (
                    <TouchableOpacity
                      key={setup.id}
                      style={guideScopeDetailsStyles.usedInSection.row}
                      onPress={() => router.push(`/tools/journal/gear/setups/${setup.id}`)}
                    >
                      <View style={guideScopeDetailsStyles.usedInSection.row.iconBadge}>
                        <Layers size={20} color={app_colors.primary.main} />
                      </View>
                      <View style={guideScopeDetailsStyles.usedInSection.row.textBlock}>
                        <Text style={guideScopeDetailsStyles.usedInSection.row.textBlock.title}>{setup.name}</Text>
                        <Text style={guideScopeDetailsStyles.usedInSection.row.textBlock.subtitle}>
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

          <View style={guideScopeDetailsStyles.actions}>
            <TouchableOpacity style={guideScopeDetailsStyles.actions.deleteButton} onPress={handleDelete}>
              <Trash2 color={app_colors.red.main} size={18} />
              <Text style={guideScopeDetailsStyles.actions.deleteButton.text}>{t("deleteButton")}</Text>
            </TouchableOpacity>
            <Text style={guideScopeDetailsStyles.actions.deleteWarning}>{t("deleteWarning")}</Text>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

export default GuideScopeDetails
