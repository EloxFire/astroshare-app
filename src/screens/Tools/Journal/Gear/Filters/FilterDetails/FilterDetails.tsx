import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { router, useLocalSearchParams } from "expo-router"
import { Aperture, ChevronRight, Layers, Pencil, Trash2 } from "lucide-react-native"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { app_colors } from "../../../../../../helpers/variables"
import { useAppUnits } from "../../../../../../hooks/useAppUnits"
import { ScreenHeader } from "../../../../../../components/ScreenHeader/ScreenHeader"
import SectionHeader from "../../../../../../components/SectionHeader/SectionHeader"
import ValueCard from "../../../../../../components/cards/ValueCard/ValueCard"
import { useUserDataStore } from "../../../../../../store/userData.store"
import { filterDetailsStyles } from "./FilterDetails.styles"

const FilterDetails = () => {
  const { t } = useTranslation("tools/journal/gear/filters/details")
  const { formatDate } = useAppUnits()

  const filterId = useLocalSearchParams().id as string
  const filters = useUserDataStore(state => state.gear.filters)
  const setups = useUserDataStore(state => state.gear.setups)
  const astronomySessions = useUserDataStore(state => state.statistics.astronomySessions)
  const removeFilter = useUserDataStore(state => state.removeFilter)

  const filter = filters.find(item => item.id === filterId)

  useEffect(() => {
    if (!filter) {
      router.push("/tools/journal/gear")
    }
  }, [filter])

  if (!filter) return null

  const displayName = filter.name || [filter.brand, filter.model].filter(Boolean).join(" ") || t("kindLabel")
  const setupsUsingFilter = setups.filter(setup => setup.filters.some(f => f.id === filter.id))

  const handleDelete = () => {
    removeFilter(filter.id)
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>

          <View style={filterDetailsStyles.heroCard}>
            <View style={filterDetailsStyles.heroCard.iconBadge}>
              <Aperture size={24} color={app_colors.primary.main} />
            </View>
            <View style={filterDetailsStyles.heroCard.textBlock}>
              <Text style={filterDetailsStyles.heroCard.textBlock.kindLabel}>
                {t("kindLabel")} · {t(`types.${filter.type}`)}
              </Text>
              <Text style={filterDetailsStyles.heroCard.textBlock.title}>{displayName}</Text>
            </View>
          </View>

          <View style={filterDetailsStyles.topRow}>
            <TouchableOpacity
              style={filterDetailsStyles.topRow.editButton}
              onPress={() => router.push(`/tools/journal/gear/filters/add?id=${filter.id}`)}
            >
              <Pencil size={14} color={app_colors.primary.main} />
              <Text style={filterDetailsStyles.topRow.editButton.text}>{t("editButton")}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <SectionHeader title={t("characteristics.title")} />

            <View style={filterDetailsStyles.characteristicsGrid}>
              <View style={filterDetailsStyles.characteristicsGrid.row}>
                <ValueCard
                  title={t("characteristics.size.label")}
                  value={filter.size}
                  containerStyle={[globalStyles.defaultCard]}
                  small
                  reverse
                  titleStyle={{ textTransform: "none" }}
                />
                <ValueCard
                  title={t("characteristics.wavelengthRange.label")}
                  value={`${filter.wavelengthRange.min}-${filter.wavelengthRange.max} ${t("unit.nanometers")}`}
                  containerStyle={[globalStyles.defaultCard]}
                  small
                  reverse
                  titleStyle={{ textTransform: "none" }}
                />
              </View>
            </View>
          </View>

          <View style={filterDetailsStyles.usedInSection}>
            <SectionHeader title={t("usedIn.title")} />

            {
              setupsUsingFilter.length === 0 ? (
                <View style={filterDetailsStyles.usedInSection.noItems}>
                  <Text style={filterDetailsStyles.usedInSection.noItems.text}>{t("usedIn.noSetups")}</Text>
                </View>
              ) : (
                setupsUsingFilter.map(setup => {
                  const setupSessions = astronomySessions.filter(session => session.setups?.some(s => s.id === setup.id))
                  const lastSessionTimestamp = setupSessions.length > 0 ? Math.max(...setupSessions.map(session => session.startTime)) : null

                  return (
                    <TouchableOpacity
                      key={setup.id}
                      style={filterDetailsStyles.usedInSection.row}
                      onPress={() => router.push(`/tools/journal/gear/setups/${setup.id}`)}
                    >
                      <View style={filterDetailsStyles.usedInSection.row.iconBadge}>
                        <Layers size={20} color={app_colors.primary.main} />
                      </View>
                      <View style={filterDetailsStyles.usedInSection.row.textBlock}>
                        <Text style={filterDetailsStyles.usedInSection.row.textBlock.title}>{setup.name}</Text>
                        <Text style={filterDetailsStyles.usedInSection.row.textBlock.subtitle}>
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

          <View style={filterDetailsStyles.actions}>
            <TouchableOpacity style={filterDetailsStyles.actions.deleteButton} onPress={handleDelete}>
              <Trash2 color={app_colors.red.main} size={18} />
              <Text style={filterDetailsStyles.actions.deleteButton.text}>{t("deleteButton")}</Text>
            </TouchableOpacity>
            <Text style={filterDetailsStyles.actions.deleteWarning}>{t("deleteWarning")}</Text>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

export default FilterDetails
