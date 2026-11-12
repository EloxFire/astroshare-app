import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { router, useLocalSearchParams } from "expo-router"
import { ChevronRight, Focus, Layers, Pencil, Trash2 } from "lucide-react-native"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { app_colors } from "../../../../../../helpers/variables"
import { useAppUnits } from "../../../../../../hooks/useAppUnits"
import { ScreenHeader } from "../../../../../../components/ScreenHeader/ScreenHeader"
import SectionHeader from "../../../../../../components/SectionHeader/SectionHeader"
import ValueCard from "../../../../../../components/cards/ValueCard/ValueCard"
import { useUserDataStore } from "../../../../../../store/userData.store"
import { focuserDetailsStyles } from "./FocuserDetails.styles"

const FocuserDetails = () => {
  const { t } = useTranslation("tools/journal/gear/focusers/details")
  const { formatDate } = useAppUnits()

  const focuserId = useLocalSearchParams().id as string
  const focusers = useUserDataStore(state => state.gear.focusers)
  const setups = useUserDataStore(state => state.gear.setups)
  const astronomySessions = useUserDataStore(state => state.statistics.astronomySessions)
  const removeFocuser = useUserDataStore(state => state.removeFocuser)

  const focuser = focusers.find(item => item.id === focuserId)

  useEffect(() => {
    if (!focuser) {
      router.push("/tools/journal/gear")
    }
  }, [focuser])

  if (!focuser) return null

  const displayName = focuser.name || [focuser.brand, focuser.model].filter(Boolean).join(" ") || t("kindLabel")
  const setupsUsingFocuser = setups.filter(setup => setup.focusers.some(f => f.id === focuser.id))

  const handleDelete = () => {
    removeFocuser(focuser.id)
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>

          <View style={focuserDetailsStyles.heroCard}>
            <View style={focuserDetailsStyles.heroCard.iconBadge}>
              <Focus size={24} color={app_colors.primary.main} />
            </View>
            <View style={focuserDetailsStyles.heroCard.textBlock}>
              <Text style={focuserDetailsStyles.heroCard.textBlock.kindLabel}>
                {t("kindLabel")} · {t(`types.${focuser.type}`)}
              </Text>
              <Text style={focuserDetailsStyles.heroCard.textBlock.title}>{displayName}</Text>
            </View>
          </View>

          <View style={focuserDetailsStyles.topRow}>
            <TouchableOpacity
              style={focuserDetailsStyles.topRow.editButton}
              onPress={() => router.push(`/tools/journal/gear/focusers/add?id=${focuser.id}`)}
            >
              <Pencil size={14} color={app_colors.primary.main} />
              <Text style={focuserDetailsStyles.topRow.editButton.text}>{t("editButton")}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <SectionHeader title={t("characteristics.title")} />

            <View style={focuserDetailsStyles.characteristicsRow}>
              <ValueCard
                title={t("characteristics.travel.label")}
                value={`${focuser.travel} mm`}
                containerStyle={[globalStyles.defaultCard]}
                small
                reverse
                titleStyle={{ textTransform: "none" }}
              />
            </View>
          </View>

          <View style={focuserDetailsStyles.usedInSection}>
            <SectionHeader title={t("usedIn.title")} />

            {
              setupsUsingFocuser.length === 0 ? (
                <View style={focuserDetailsStyles.usedInSection.noItems}>
                  <Text style={focuserDetailsStyles.usedInSection.noItems.text}>{t("usedIn.noSetups")}</Text>
                </View>
              ) : (
                setupsUsingFocuser.map(setup => {
                  const setupSessions = astronomySessions.filter(session => session.setups?.some(s => s.id === setup.id))
                  const lastSessionTimestamp = setupSessions.length > 0 ? Math.max(...setupSessions.map(session => session.startTime)) : null

                  return (
                    <TouchableOpacity
                      key={setup.id}
                      style={focuserDetailsStyles.usedInSection.row}
                      onPress={() => router.push(`/tools/journal/gear/setups/${setup.id}`)}
                    >
                      <View style={focuserDetailsStyles.usedInSection.row.iconBadge}>
                        <Layers size={20} color={app_colors.primary.main} />
                      </View>
                      <View style={focuserDetailsStyles.usedInSection.row.textBlock}>
                        <Text style={focuserDetailsStyles.usedInSection.row.textBlock.title}>{setup.name}</Text>
                        <Text style={focuserDetailsStyles.usedInSection.row.textBlock.subtitle}>
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

          <View style={focuserDetailsStyles.actions}>
            <TouchableOpacity style={focuserDetailsStyles.actions.deleteButton} onPress={handleDelete}>
              <Trash2 color={app_colors.red.main} size={18} />
              <Text style={focuserDetailsStyles.actions.deleteButton.text}>{t("deleteButton")}</Text>
            </TouchableOpacity>
            <Text style={focuserDetailsStyles.actions.deleteWarning}>{t("deleteWarning")}</Text>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

export default FocuserDetails
