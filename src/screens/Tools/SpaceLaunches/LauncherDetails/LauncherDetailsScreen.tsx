import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Globe, Landmark } from "lucide-react-native";
import { globalStyles } from "../../../../helpers/globalStyles";
import { app_colors } from "../../../../helpers/variables";
import { useAppUnits } from "../../../../hooks/useAppUnits";
import { formatLocaleNumber } from "../../../../helpers/format";
import { getLauncherById } from "../../../../helpers/api/launches/launchers";
import { getLaunchImageUrl } from "../../../../helpers/spaceLaunches/launchImage";
import { Launcher } from "../../../../types/spaceLaunches/Launcher";
import { ScreenHeader } from "../../../../components/layout/ScreenHeader/ScreenHeader";
import { ImageHeaderScrollView } from "../../../../components/layout/ImageHeaderScrollView/ImageHeaderScrollView";
import Badge from "../../../../components/Badges/Badge/Badge";
import ListCard from "../../../../components/cards/ListCard/ListCard";
import InfoCard from "../../../../components/cards/InfoCard/InfoCard";
import SectionHeader from "../../../../components/layout/SectionHeader/SectionHeader";
import { launcherDetailsScreenStyles } from "./LauncherDetailsScreen.styles";

const LauncherDetailsScreen = () => {
  const launcherId = useLocalSearchParams().id as string;
  const { t, i18n } = useTranslation("tools/spaceLaunches");
  const { formatDate } = useAppUnits();

  const [launcher, setLauncher] = useState<Launcher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const heroImageUrl = getLaunchImageUrl(launcher?.image);

  // Pas dérivable du contexte des lancements (fiche lanceur complète, pas le résumé embarqué
  // rocket.configuration) : appel direct, propre à cet écran — même logique que Pad/Agency.
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setLauncher(await getLauncherById(launcherId));
      setIsLoading(false);
    })();
  }, [launcherId]);

  if (isLoading) {
    return (
      <View style={globalStyles.screen}>
        <ScreenHeader title={t("launcher.screenTitle")} main={false} />
        <ActivityIndicator size="large" color={app_colors.accent.main} style={launcherDetailsScreenStyles.loader} />
      </View>
    );
  }

  if (!launcher) {
    return (
      <View style={globalStyles.screen}>
        <ScreenHeader title={t("launcher.screenTitle")} main={false} />
        <Text style={launcherDetailsScreenStyles.notFound}>{t("errors.notFound")}</Text>
      </View>
    );
  }

  // "N/A" en pratique quand il n'y a pas de variante (ex: Starship) — à traiter comme absent,
  // sans quoi le sous-titre afficherait littéralement "Variante N/A".
  const hasRealVariant = launcher.variant && launcher.variant !== "N/A";

  const hasSpecs =
    launcher.length != null ||
    launcher.diameter != null ||
    launcher.launch_mass != null ||
    launcher.leo_capacity != null ||
    launcher.gto_capacity != null ||
    launcher.geo_capacity != null ||
    launcher.sso_capacity != null ||
    launcher.to_thrust != null ||
    launcher.apogee != null ||
    (launcher.min_stage != null && launcher.max_stage != null) ||
    !!launcher.maiden_flight;

  const hasStats =
    launcher.total_launch_count != null ||
    launcher.successful_launches != null ||
    launcher.failed_launches != null ||
    launcher.pending_launches != null ||
    launcher.consecutive_successful_launches != null;

  // Distinctes des statistiques de lancement : un lancement réussi peut avoir un atterrissage
  // raté (ex: Starship), donc pas la même donnée.
  const hasLandingStats =
    launcher.attempted_landings != null ||
    launcher.successful_landings != null ||
    launcher.failed_landings != null ||
    launcher.consecutive_successful_landings != null;

  return (
    <View style={globalStyles.screen}>
      <ImageHeaderScrollView
        title={launcher.name}
        subtitle={hasRealVariant ? t("details.rocket.variant", { variant: launcher.variant }) : launcher.full_name}
        image={heroImageUrl ? { uri: heroImageUrl } : require("../../../../../assets/images/placeholders/no-picture.png")}
      >
        <View style={[globalStyles.screen.content, { backgroundColor: "transparent" }]}>
          <View style={launcherDetailsScreenStyles.tags}>
            {launcher.active != null && (
              <Badge
                text={t(launcher.active ? "launcher.status.active" : "launcher.status.inactive")}
                backgroundColor={launcher.active ? app_colors.accent.light : app_colors.red.light}
                foregroundColor={launcher.active ? app_colors.primary.main : app_colors.red.main}
              />
            )}
            {/* Pas de badge "non réutilisable" : c'est le cas par défaut de la plupart des
                lanceurs, pas une information notable — seul le cas positif mérite un badge. */}
            {launcher.reusable === true && (
              <Badge text={t("launcher.reusable")} backgroundColor={app_colors.green.light} foregroundColor={app_colors.green.main} />
            )}
          </View>

          <Text style={launcherDetailsScreenStyles.description}>{launcher.description || t("launcher.noDescription")}</Text>

          {launcher.manufacturer && (
            <InfoCard
              variant="light"
              icon={Landmark}
              title={launcher.manufacturer.name}
              description={launcher.manufacturer.abbrev}
              internalLink={`/tools/space-launches/agency/${launcher.manufacturer.id}`}
            />
          )}

          {hasSpecs && (
            <View style={launcherDetailsScreenStyles.section}>
              <SectionHeader title={t("launcher.specs.title")} />
              <ListCard
                items={[
                  ...(launcher.length != null ? [{ title: t("launcher.specs.length"), value: `${formatLocaleNumber(launcher.length, i18n.language, 1)} m` }] : []),
                  ...(launcher.diameter != null ? [{ title: t("launcher.specs.diameter"), value: `${formatLocaleNumber(launcher.diameter, i18n.language, 1)} m` }] : []),
                  // launch_mass est en tonnes côté LL2 (vérifié : Starship donne 5000, soit ~5000 t
                  // au décollage — 5000 kg serait absurde pour un lanceur de cette taille).
                  ...(launcher.launch_mass != null ? [{ title: t("launcher.specs.launchMass"), value: `${formatLocaleNumber(launcher.launch_mass, i18n.language, 0)} t` }] : []),
                  ...(launcher.leo_capacity != null ? [{ title: t("launcher.specs.leoCapacity"), value: `${formatLocaleNumber(launcher.leo_capacity, i18n.language, 0)} kg` }] : []),
                  ...(launcher.gto_capacity != null ? [{ title: t("launcher.specs.gtoCapacity"), value: `${formatLocaleNumber(launcher.gto_capacity, i18n.language, 0)} kg` }] : []),
                  ...(launcher.geo_capacity != null ? [{ title: t("launcher.specs.geoCapacity"), value: `${formatLocaleNumber(launcher.geo_capacity, i18n.language, 0)} kg` }] : []),
                  ...(launcher.sso_capacity != null ? [{ title: t("launcher.specs.ssoCapacity"), value: `${formatLocaleNumber(launcher.sso_capacity, i18n.language, 0)} kg` }] : []),
                  ...(launcher.to_thrust != null ? [{ title: t("launcher.specs.thrust"), value: `${formatLocaleNumber(launcher.to_thrust, i18n.language, 0)} kN` }] : []),
                  ...(launcher.apogee != null ? [{ title: t("launcher.specs.apogee"), value: `${formatLocaleNumber(launcher.apogee, i18n.language, 0)} km` }] : []),
                  ...(launcher.min_stage != null && launcher.max_stage != null
                    ? [{ title: t("launcher.specs.stages"), value: launcher.min_stage === launcher.max_stage ? String(launcher.min_stage) : `${launcher.min_stage}–${launcher.max_stage}` }]
                    : []),
                  ...(launcher.maiden_flight ? [{ title: t("launcher.specs.maidenFlight"), value: formatDate(launcher.maiden_flight).format("DD/MM/YYYY") }] : []),
                ]}
              />
            </View>
          )}

          {hasStats && (
            <View style={launcherDetailsScreenStyles.section}>
              <SectionHeader title={t("launcher.stats.title")} />
              <ListCard
                items={[
                  ...(launcher.total_launch_count != null ? [{ title: t("launcher.stats.total"), value: String(launcher.total_launch_count) }] : []),
                  ...(launcher.successful_launches != null ? [{ title: t("launcher.stats.successful"), value: String(launcher.successful_launches) }] : []),
                  ...(launcher.failed_launches != null ? [{ title: t("launcher.stats.failed"), value: String(launcher.failed_launches) }] : []),
                  ...(launcher.pending_launches != null ? [{ title: t("launcher.stats.pending"), value: String(launcher.pending_launches) }] : []),
                  ...(launcher.consecutive_successful_launches != null
                    ? [{ title: t("launcher.stats.consecutiveSuccess"), value: String(launcher.consecutive_successful_launches) }]
                    : []),
                ]}
              />
            </View>
          )}

          {hasLandingStats && (
            <View style={launcherDetailsScreenStyles.section}>
              <SectionHeader title={t("launcher.landingStats.title")} />
              <ListCard
                items={[
                  ...(launcher.attempted_landings != null ? [{ title: t("launcher.landingStats.attempted"), value: String(launcher.attempted_landings) }] : []),
                  ...(launcher.successful_landings != null ? [{ title: t("launcher.landingStats.successful"), value: String(launcher.successful_landings) }] : []),
                  ...(launcher.failed_landings != null ? [{ title: t("launcher.landingStats.failed"), value: String(launcher.failed_landings) }] : []),
                  ...(launcher.consecutive_successful_landings != null
                    ? [{ title: t("launcher.landingStats.consecutiveSuccess"), value: String(launcher.consecutive_successful_landings) }]
                    : []),
                ]}
              />
            </View>
          )}

          {(launcher.info_url || launcher.wiki_url) && (
            <View style={launcherDetailsScreenStyles.section}>
              {launcher.info_url && <InfoCard variant="light" icon={Globe} title={t("launcher.links.info")} link={launcher.info_url} />}
              {launcher.wiki_url && <InfoCard variant="light" icon={Globe} title={t("launcher.links.wiki")} link={launcher.wiki_url} />}
            </View>
          )}
        </View>
      </ImageHeaderScrollView>
    </View>
  );
}

export default LauncherDetailsScreen;
