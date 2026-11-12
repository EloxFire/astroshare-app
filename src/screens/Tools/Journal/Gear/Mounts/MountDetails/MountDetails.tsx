import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { router, useLocalSearchParams } from "expo-router"
import { ChevronRight, Layers, Pencil, Rotate3D, Trash2 } from "lucide-react-native"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { app_colors } from "../../../../../../helpers/variables"
import { useAppUnits } from "../../../../../../hooks/useAppUnits"
import { ScreenHeader } from "../../../../../../components/ScreenHeader/ScreenHeader"
import SectionHeader from "../../../../../../components/SectionHeader/SectionHeader"
import ValueCard from "../../../../../../components/cards/ValueCard/ValueCard"
import { useUserDataStore } from "../../../../../../store/userData.store"
import { mountDetailsStyles } from "./MountDetails.styles"

const MountDetails = () => {
  const { t } = useTranslation("tools/journal/gear/mounts/details")
  const { formatDate } = useAppUnits()

  const mountId = useLocalSearchParams().id as string
  const mounts = useUserDataStore(state => state.gear.mounts)
  const setups = useUserDataStore(state => state.gear.setups)
  const astronomySessions = useUserDataStore(state => state.statistics.astronomySessions)
  const removeMount = useUserDataStore(state => state.removeMount)

  const mount = mounts.find(item => item.id === mountId)

  useEffect(() => {
    if (!mount) {
      router.push("/tools/journal/gear")
    }
  }, [mount])

  if (!mount) return null

  const displayName = mount.name || [mount.brand, mount.model].filter(Boolean).join(" ") || t("kindLabel")
  const setupsUsingMount = setups.filter(setup => setup.mount?.id === mount.id)

  const handleDelete = () => {
    removeMount(mount.id)
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>

          <View style={mountDetailsStyles.heroCard}>
            <View style={mountDetailsStyles.heroCard.iconBadge}>
              <Rotate3D size={24} color={app_colors.primary.main} />
            </View>
            <View style={mountDetailsStyles.heroCard.textBlock}>
              <Text style={mountDetailsStyles.heroCard.textBlock.kindLabel}>
                {t("kindLabel")} · {t(`types.${mount.type}`)}
              </Text>
              <Text style={mountDetailsStyles.heroCard.textBlock.title}>{displayName}</Text>
            </View>
          </View>

          <View style={mountDetailsStyles.topRow}>
            <TouchableOpacity
              style={mountDetailsStyles.topRow.editButton}
              onPress={() => router.push(`/tools/journal/gear/mounts/add?id=${mount.id}`)}
            >
              <Pencil size={14} color={app_colors.primary.main} />
              <Text style={mountDetailsStyles.topRow.editButton.text}>{t("editButton")}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <SectionHeader title={t("characteristics.title")} />

            <View style={mountDetailsStyles.characteristicsRow}>
              <ValueCard
                title={t("characteristics.motorized.label")}
                value={mount.motorized ? t("motorizedValue.true") : t("motorizedValue.false")}
                containerStyle={[globalStyles.defaultCard]}
                small
                reverse
                titleStyle={{ textTransform: "none" }}
              />
              {
                mount.maxPayload != null && (
                  <ValueCard
                    title={t("characteristics.maxPayload.label")}
                    value={`${mount.maxPayload} ${t("unit.kilograms")}`}
                    containerStyle={[globalStyles.defaultCard]}
                    small
                    reverse
                    titleStyle={{ textTransform: "none" }}
                  />
                )
              }
            </View>
          </View>

          <View style={mountDetailsStyles.usedInSection}>
            <SectionHeader title={t("usedIn.title")} />

            {
              setupsUsingMount.length === 0 ? (
                <View style={mountDetailsStyles.usedInSection.noItems}>
                  <Text style={mountDetailsStyles.usedInSection.noItems.text}>{t("usedIn.noSetups")}</Text>
                </View>
              ) : (
                setupsUsingMount.map(setup => {
                  const setupSessions = astronomySessions.filter(session => session.setups?.some(s => s.id === setup.id))
                  const lastSessionTimestamp = setupSessions.length > 0 ? Math.max(...setupSessions.map(session => session.startTime)) : null

                  return (
                    <TouchableOpacity
                      key={setup.id}
                      style={mountDetailsStyles.usedInSection.row}
                      onPress={() => router.push(`/tools/journal/gear/setups/${setup.id}`)}
                    >
                      <View style={mountDetailsStyles.usedInSection.row.iconBadge}>
                        <Layers size={20} color={app_colors.primary.main} />
                      </View>
                      <View style={mountDetailsStyles.usedInSection.row.textBlock}>
                        <Text style={mountDetailsStyles.usedInSection.row.textBlock.title}>{setup.name}</Text>
                        <Text style={mountDetailsStyles.usedInSection.row.textBlock.subtitle}>
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

          <View style={mountDetailsStyles.actions}>
            <TouchableOpacity style={mountDetailsStyles.actions.deleteButton} onPress={handleDelete}>
              <Trash2 color={app_colors.red.main} size={18} />
              <Text style={mountDetailsStyles.actions.deleteButton.text}>{t("deleteButton")}</Text>
            </TouchableOpacity>
            <Text style={mountDetailsStyles.actions.deleteWarning}>{t("deleteWarning")}</Text>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

export default MountDetails
