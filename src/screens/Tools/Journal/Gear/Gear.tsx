import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useTranslation } from "react-i18next"
import { globalStyles } from "../../../../helpers/globalStyles"
import { ScreenHeader } from "../../../../components/ScreenHeader/ScreenHeader"
import { gearScreenStyles } from "./Gear.styles"
import SectionHeader from "../../../../components/SectionHeader/SectionHeader"
import { useUserDataStore } from "../../../../store/userData.store"
import { app_colors } from "../../../../helpers/variables"
import { Aperture, Camera, CircleDot, Crosshair, Focus, LucideIcon, Plus, Rotate3D, Telescope } from "lucide-react-native"
import { router, useFocusEffect } from "expo-router"
import { useCallback } from "react"
import { StatusBar } from "expo-status-bar"
import InfoCard from "../../../../components/cards/InfoCard/InfoCard"
import ValueCard from "../../../../components/cards/ValueCard/ValueCard"

// `items` et `renderCard` partagent le même T, propre à chaque catégorie d'équipement (Telescope,
// Mount, ...) — renderCard a donc accès à ses champs spécifiques sans union ni cast. Le mapping se
// fait ici, à l'intérieur de la fonction générique : une fois sorties, les cartes ne sont plus que
// des chaînes (title/value), donc le tableau de sections rendu par Gear.tsx n'est plus générique.
const gearSection = <T extends { id: string }>(section: {
  id: string;
  title: string;
  icon: LucideIcon;
  iconBackgroundColor: string;
  addRoute: string;
  items: T[];
  renderCard: (item: T) => { title: string; value: string };
}) => ({
  id: section.id,
  title: section.title,
  icon: section.icon,
  iconBackgroundColor: section.iconBackgroundColor,
  addRoute: section.addRoute,
  cards: section.items.map(item => ({ id: item.id, ...section.renderCard(item) })),
})

const Gear = () => {

  // Pas de reset au blur : voir le commentaire équivalent dans Journal.tsx (même course avec
  // l'écran qui regagne le focus).
  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("dark");
    }, [])
  );

  const { t } = useTranslation("tools/journal")

  const userScopes = useUserDataStore(state => state.gear.telescopes)
  const userCameras = useUserDataStore(state => state.gear.cameras)
  const userFocusers = useUserDataStore(state => state.gear.focusers)
  const userGuideScopes = useUserDataStore(state => state.gear.guideScopes)
  const userMounts = useUserDataStore(state => state.gear.mounts)
  const userFilters = useUserDataStore(state => state.gear.filters)
  const userEyepieces = useUserDataStore(state => state.gear.eyepieces)
  const userSetups = useUserDataStore(state => state.gear.setups)

  // Nom affiché sur chaque carte : marque + modèle, ou le titre de la catégorie si l'équipement
  // (ajouté manuellement) n'a ni l'un ni l'autre.
  const gearName = (brand: string | null, model: string | null, fallbackTitleKey: string) =>
    [brand, model].filter(Boolean).join(" ") || t(fallbackTitleKey)

  const detailedGearSections = [
    gearSection({
      id: "telescopes",
      title: "gear.telescopes.title",
      icon: Telescope,
      iconBackgroundColor: app_colors.accent.light,
      addRoute: "/tools/journal/gear/telescopes/add",
      items: userScopes,
      renderCard: (telescope) => ({
        title: gearName(telescope.brand, telescope.model, "gear.telescopes.title"),
        value: `${telescope.aperture}mm · f/${(telescope.focalLength / telescope.aperture).toFixed(1)}`,
      }),
    }),
    gearSection({
      id: "mounts",
      title: "gear.mounts.title",
      icon: Rotate3D,
      iconBackgroundColor: app_colors.accent.light,
      addRoute: "/tools/journal/gear/mounts/add",
      items: userMounts,
      renderCard: (mount) => ({
        title: gearName(mount.brand, mount.model, "gear.mounts.title"),
        value: mount.motorized ? "Motorisée" : "Manuelle",
      }),
    }),
    gearSection({
      id: "eyepieces",
      title: "gear.eyepieces.title",
      icon: CircleDot,
      iconBackgroundColor: app_colors.yellow.light,
      addRoute: "/tools/journal/gear/eyepieces/add",
      items: userEyepieces,
      renderCard: (eyepiece) => ({
        title: gearName(eyepiece.brand, eyepiece.model, "gear.eyepieces.title"),
        value: `${eyepiece.focalLength}mm · ${eyepiece.afov}°`,
      }),
    }),
    gearSection({
      id: "filters",
      title: "gear.filters.title",
      icon: Aperture,
      iconBackgroundColor: app_colors.yellow.light,
      addRoute: "/tools/journal/gear/filters/add",
      items: userFilters,
      renderCard: (filter) => ({
        title: gearName(filter.brand, filter.model, "gear.filters.title"),
        value: `${filter.size} · ${filter.wavelengthRange.min}-${filter.wavelengthRange.max}nm`,
      }),
    }),
    gearSection({
      id: "cameras",
      title: "gear.cameras.title",
      icon: Camera,
      iconBackgroundColor: app_colors.accent.light,
      addRoute: "/tools/journal/gear/cameras/add",
      items: userCameras,
      renderCard: (camera) => ({
        title: gearName(camera.brand, camera.model, "gear.cameras.title"),
        value: `${camera.sensorSize.width}×${camera.sensorSize.height}mm · ${camera.pixelSize}µm`,
      }),
    }),
    gearSection({
      id: "focusers",
      title: "gear.focusers.title",
      icon: Focus,
      iconBackgroundColor: app_colors.accent.light,
      addRoute: "/tools/journal/gear/focusers/add",
      items: userFocusers,
      renderCard: (focuser) => ({
        title: gearName(focuser.brand, focuser.model, "gear.focusers.title"),
        value: `${focuser.travel}mm`,
      }),
    }),
    gearSection({
      id: "guideScopes",
      title: "gear.guideScopes.title",
      icon: Crosshair,
      iconBackgroundColor: app_colors.accent.light,
      addRoute: "/tools/journal/gear/guideScopes/add",
      items: userGuideScopes,
      renderCard: (guideScope) => ({
        title: gearName(guideScope.brand, guideScope.model, "gear.guideScopes.title"),
        value: `${guideScope.aperture}mm · f=${guideScope.focalLength}mm`,
      }),
    }),
  ]

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("gear.title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>

          <InfoCard
            title={t("gear.infoCard.title")}
            description={t("gear.infoCard.subtitle")}
            icon={Telescope}
            variant="dark-light"
          />

          <View style={gearScreenStyles.setupsSection}>
            <SectionHeader title={t("gear.setups.title")} />

            {
              userSetups.length === 0 && (
                <View style={gearScreenStyles.setupsSection.noSetups}>
                  <Text style={gearScreenStyles.setupsSection.noSetups.text}>{t("gear.detailed.noItems.setups")}</Text>
                  <TouchableOpacity style={gearScreenStyles.setupsSection.noSetups.button} onPress={() => router.push("/tools/journal/gear/setups/add")}>
                    <Plus size={20} color={app_colors.white} />
                    <Text style={gearScreenStyles.setupsSection.noSetups.button.text}>{t("gear.setups.add.title")}</Text>
                  </TouchableOpacity>
                </View>
              )
            }
          </View>

          <View style={gearScreenStyles.detailedGearSection}>
            <SectionHeader title={t("gear.detailed.title")} />

            {
              detailedGearSections.map(section => (
                <View key={section.id} style={gearScreenStyles.detailedGearSection.section}>
                  <View style={gearScreenStyles.detailedGearSection.section.header}>
                    <View style={gearScreenStyles.detailedGearSection.section.header.titleContainer}>
                      <View style={[gearScreenStyles.detailedGearSection.section.header.titleContainer.icon, { backgroundColor: section.iconBackgroundColor }]}>
                        <section.icon size={20} color={app_colors.primary.main} />
                      </View>
                      <Text style={globalStyles.categoryTitle}>{t(section.title)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push(section.addRoute)}>
                      <Plus size={25} color={app_colors.accent.main} />
                    </TouchableOpacity>
                  </View>

                  <View style={gearScreenStyles.detailedGearSection.section.content}>
                    {
                      section.cards.length === 0 && (
                        <View style={gearScreenStyles.detailedGearSection.section.content.noItems}>
                          <Text style={gearScreenStyles.detailedGearSection.section.content.noItems.text}>{t(`gear.detailed.noItems.${section.id}`)}</Text>
                        </View>
                      )
                    }

                    {
                      section.cards.map(card => (
                        <ValueCard
                          key={card.id}
                          title={card.value}
                          value={card.title}
                          containerStyle={[globalStyles.defaultCard]}
                          small
                          reverse
                          titleStyle={{textTransform: "none"}}
                        />
                      ))
                    }
                  </View>
                </View>
              ))
            }
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Gear
