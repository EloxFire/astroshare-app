import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { router, useLocalSearchParams } from "expo-router"
import { Camera as CameraIcon, ChevronRight, Layers, Pencil, Trash2 } from "lucide-react-native"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { app_colors } from "../../../../../../helpers/variables"
import { useAppUnits } from "../../../../../../hooks/useAppUnits"
import { ScreenHeader } from "../../../../../../components/ScreenHeader/ScreenHeader"
import SectionHeader from "../../../../../../components/SectionHeader/SectionHeader"
import ValueCard from "../../../../../../components/cards/ValueCard/ValueCard"
import { useUserDataStore } from "../../../../../../store/userData.store"
import { cameraDetailsStyles } from "./CameraDetails.styles"

const CameraDetails = () => {
  const { t } = useTranslation("tools/journal/gear/cameras/details")
  const { formatDate } = useAppUnits()

  const cameraId = useLocalSearchParams().id as string
  const cameras = useUserDataStore(state => state.gear.cameras)
  const setups = useUserDataStore(state => state.gear.setups)
  const astronomySessions = useUserDataStore(state => state.statistics.astronomySessions)
  const removeCamera = useUserDataStore(state => state.removeCamera)

  const camera = cameras.find(item => item.id === cameraId)

  useEffect(() => {
    if (!camera) {
      router.push("/tools/journal/gear")
    }
  }, [camera])

  if (!camera) return null

  const displayName = camera.name || [camera.brand, camera.model].filter(Boolean).join(" ") || t("kindLabel")
  // Une caméra peut être utilisée en imagerie principale (cameras) ou en guidage (guideCamera) :
  // les deux comptent comme une utilisation dans le setup.
  const setupsUsingCamera = setups.filter(setup => setup.cameras.some(c => c.id === camera.id) || setup.guideCamera?.id === camera.id)

  const handleDelete = () => {
    removeCamera(camera.id)
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>

          <View style={cameraDetailsStyles.heroCard}>
            <View style={cameraDetailsStyles.heroCard.iconBadge}>
              <CameraIcon size={24} color={app_colors.primary.main} />
            </View>
            <View style={cameraDetailsStyles.heroCard.textBlock}>
              <Text style={cameraDetailsStyles.heroCard.textBlock.kindLabel}>
                {t("kindLabel")} · {t(`types.${camera.type}`)}
              </Text>
              <Text style={cameraDetailsStyles.heroCard.textBlock.title}>{displayName}</Text>
            </View>
          </View>

          <View style={cameraDetailsStyles.topRow}>
            <TouchableOpacity
              style={cameraDetailsStyles.topRow.editButton}
              onPress={() => router.push(`/tools/journal/gear/cameras/add?id=${camera.id}`)}
            >
              <Pencil size={14} color={app_colors.primary.main} />
              <Text style={cameraDetailsStyles.topRow.editButton.text}>{t("editButton")}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <SectionHeader title={t("characteristics.title")} />

            <View style={cameraDetailsStyles.characteristicsGrid}>
              <View style={cameraDetailsStyles.characteristicsGrid.row}>
                <ValueCard
                  title={t("characteristics.sensorSize.label")}
                  value={`${camera.sensorSize.width}×${camera.sensorSize.height} mm`}
                  containerStyle={[globalStyles.defaultCard]}
                  small
                  reverse
                  titleStyle={{ textTransform: "none" }}
                />
                <ValueCard
                  title={t("characteristics.pixelSize.label")}
                  value={`${camera.pixelSize} µm`}
                  containerStyle={[globalStyles.defaultCard]}
                  small
                  reverse
                  titleStyle={{ textTransform: "none" }}
                />
              </View>

              {
                camera.resolution && (
                  <View style={cameraDetailsStyles.characteristicsGrid.row}>
                    <ValueCard
                      title={t("characteristics.resolution.label")}
                      value={`${camera.resolution.width}×${camera.resolution.height} px`}
                      containerStyle={[globalStyles.defaultCard]}
                      small
                      reverse
                      titleStyle={{ textTransform: "none" }}
                    />
                  </View>
                )
              }
            </View>
          </View>

          <View style={cameraDetailsStyles.usedInSection}>
            <SectionHeader title={t("usedIn.title")} />

            {
              setupsUsingCamera.length === 0 ? (
                <View style={cameraDetailsStyles.usedInSection.noItems}>
                  <Text style={cameraDetailsStyles.usedInSection.noItems.text}>{t("usedIn.noSetups")}</Text>
                </View>
              ) : (
                setupsUsingCamera.map(setup => {
                  const setupSessions = astronomySessions.filter(session => session.setups?.some(s => s.id === setup.id))
                  const lastSessionTimestamp = setupSessions.length > 0 ? Math.max(...setupSessions.map(session => session.startTime)) : null

                  return (
                    <TouchableOpacity
                      key={setup.id}
                      style={cameraDetailsStyles.usedInSection.row}
                      onPress={() => router.push(`/tools/journal/gear/setups/${setup.id}`)}
                    >
                      <View style={cameraDetailsStyles.usedInSection.row.iconBadge}>
                        <Layers size={20} color={app_colors.primary.main} />
                      </View>
                      <View style={cameraDetailsStyles.usedInSection.row.textBlock}>
                        <Text style={cameraDetailsStyles.usedInSection.row.textBlock.title}>{setup.name}</Text>
                        <Text style={cameraDetailsStyles.usedInSection.row.textBlock.subtitle}>
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

          <View style={cameraDetailsStyles.actions}>
            <TouchableOpacity style={cameraDetailsStyles.actions.deleteButton} onPress={handleDelete}>
              <Trash2 color={app_colors.red.main} size={18} />
              <Text style={cameraDetailsStyles.actions.deleteButton.text}>{t("deleteButton")}</Text>
            </TouchableOpacity>
            <Text style={cameraDetailsStyles.actions.deleteWarning}>{t("deleteWarning")}</Text>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

export default CameraDetails
