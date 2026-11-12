import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { router, useLocalSearchParams } from "expo-router"
import { ChevronRight, CircleDot, Layers, Pencil, Trash2 } from "lucide-react-native"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { app_colors } from "../../../../../../helpers/variables"
import { useAppUnits } from "../../../../../../hooks/useAppUnits"
import { ScreenHeader } from "../../../../../../components/ScreenHeader/ScreenHeader"
import SectionHeader from "../../../../../../components/SectionHeader/SectionHeader"
import ValueCard from "../../../../../../components/cards/ValueCard/ValueCard"
import { useUserDataStore } from "../../../../../../store/userData.store"
import { eyepieceDetailsStyles } from "./EyepieceDetails.styles"

const EyepieceDetails = () => {
  const { t } = useTranslation("tools/journal/gear/eyepieces/details")
  const { formatDate } = useAppUnits()

  const eyepieceId = useLocalSearchParams().id as string
  const eyepieces = useUserDataStore(state => state.gear.eyepieces)
  const setups = useUserDataStore(state => state.gear.setups)
  const astronomySessions = useUserDataStore(state => state.statistics.astronomySessions)
  const removeEyepiece = useUserDataStore(state => state.removeEyepiece)

  const eyepiece = eyepieces.find(item => item.id === eyepieceId)

  useEffect(() => {
    if (!eyepiece) {
      router.push("/tools/journal/gear")
    }
  }, [eyepiece])

  if (!eyepiece) return null

  const displayName = eyepiece.name || [eyepiece.brand, eyepiece.model].filter(Boolean).join(" ") || t("kindLabel")
  const setupsUsingEyepiece = setups.filter(setup => setup.eyepieces.some(e => e.id === eyepiece.id))

  const handleDelete = () => {
    removeEyepiece(eyepiece.id)
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>

          <View style={eyepieceDetailsStyles.heroCard}>
            <View style={eyepieceDetailsStyles.heroCard.iconBadge}>
              <CircleDot size={24} color={app_colors.primary.main} />
            </View>
            <View style={eyepieceDetailsStyles.heroCard.textBlock}>
              <Text style={eyepieceDetailsStyles.heroCard.textBlock.kindLabel}>
                {t("kindLabel")} · {t(`types.${eyepiece.type}`)}
              </Text>
              <Text style={eyepieceDetailsStyles.heroCard.textBlock.title}>{displayName}</Text>
            </View>
          </View>

          <View style={eyepieceDetailsStyles.topRow}>
            <TouchableOpacity
              style={eyepieceDetailsStyles.topRow.editButton}
              onPress={() => router.push(`/tools/journal/gear/eyepieces/add?id=${eyepiece.id}`)}
            >
              <Pencil size={14} color={app_colors.primary.main} />
              <Text style={eyepieceDetailsStyles.topRow.editButton.text}>{t("editButton")}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <SectionHeader title={t("characteristics.title")} />

            <View style={eyepieceDetailsStyles.characteristicsGrid}>
              <View style={eyepieceDetailsStyles.characteristicsGrid.row}>
                <ValueCard
                  title={t("characteristics.focalLength.label")}
                  value={`${eyepiece.focalLength} mm`}
                  containerStyle={[globalStyles.defaultCard]}
                  small
                  reverse
                  titleStyle={{ textTransform: "none" }}
                />
                <ValueCard
                  title={t("characteristics.afov.label")}
                  value={`${eyepiece.afov}°`}
                  containerStyle={[globalStyles.defaultCard]}
                  small
                  reverse
                  titleStyle={{ textTransform: "none" }}
                />
              </View>

              <View style={eyepieceDetailsStyles.characteristicsGrid.row}>
                <ValueCard
                  title={t("characteristics.barrelSize.label")}
                  value={`${eyepiece.barrelSize}"`}
                  containerStyle={[globalStyles.defaultCard]}
                  small
                  reverse
                  titleStyle={{ textTransform: "none" }}
                />
              </View>
            </View>
          </View>

          <View style={eyepieceDetailsStyles.usedInSection}>
            <SectionHeader title={t("usedIn.title")} />

            {
              setupsUsingEyepiece.length === 0 ? (
                <View style={eyepieceDetailsStyles.usedInSection.noItems}>
                  <Text style={eyepieceDetailsStyles.usedInSection.noItems.text}>{t("usedIn.noSetups")}</Text>
                </View>
              ) : (
                setupsUsingEyepiece.map(setup => {
                  const setupSessions = astronomySessions.filter(session => session.setups?.some(s => s.id === setup.id))
                  const lastSessionTimestamp = setupSessions.length > 0 ? Math.max(...setupSessions.map(session => session.startTime)) : null

                  return (
                    <TouchableOpacity
                      key={setup.id}
                      style={eyepieceDetailsStyles.usedInSection.row}
                      onPress={() => router.push(`/tools/journal/gear/setups/${setup.id}`)}
                    >
                      <View style={eyepieceDetailsStyles.usedInSection.row.iconBadge}>
                        <Layers size={20} color={app_colors.primary.main} />
                      </View>
                      <View style={eyepieceDetailsStyles.usedInSection.row.textBlock}>
                        <Text style={eyepieceDetailsStyles.usedInSection.row.textBlock.title}>{setup.name}</Text>
                        <Text style={eyepieceDetailsStyles.usedInSection.row.textBlock.subtitle}>
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

          <View style={eyepieceDetailsStyles.actions}>
            <TouchableOpacity style={eyepieceDetailsStyles.actions.deleteButton} onPress={handleDelete}>
              <Trash2 color={app_colors.red.main} size={18} />
              <Text style={eyepieceDetailsStyles.actions.deleteButton.text}>{t("deleteButton")}</Text>
            </TouchableOpacity>
            <Text style={eyepieceDetailsStyles.actions.deleteWarning}>{t("deleteWarning")}</Text>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

export default EyepieceDetails
