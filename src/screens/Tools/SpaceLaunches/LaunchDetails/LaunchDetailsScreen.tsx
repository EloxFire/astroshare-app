import { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { MapPin, Video } from "lucide-react-native";
import { globalStyles } from "../../../../helpers/globalStyles";
import { app_colors, withOpacity } from "../../../../helpers/variables";
import { useAppUnits } from "../../../../hooks/useAppUnits";
import { useAgencyLogo } from "../../../../hooks/useAgencyLogo";
import { getLaunchProbability } from "../../../../helpers/spaceLaunches/launchStatus";
import { getLaunchImageUrl } from "../../../../helpers/spaceLaunches/launchImage";
import { useSpaceLaunches } from "../../../../context/SpaceLaunchesContext";
import { Launch } from "../../../../types/spaceLaunches/Launch";
import { ImageHeaderScrollView } from "../../../../components/layout/ImageHeaderScrollView/ImageHeaderScrollView";
import Badge from "../../../../components/Badges/Badge/Badge";
import ListCard from "../../../../components/cards/ListCard/ListCard";
import InfoCard from "../../../../components/cards/InfoCard/InfoCard";
import SwitchInfoCard from "../../../../components/cards/SwitchInfoCard/SwitchInfoCard";
import LocationMapCard from "../../../../components/cards/LocationMapCard/LocationMapCard";
import CircularGauge from "../../../../components/charts/CircularGauge/CircularGauge";
import LaunchStatusBadge from "../../../../components/SpaceLaunches/LaunchStatusBadge/LaunchStatusBadge";
import NextLaunchCountdown from "../../../../components/SpaceLaunches/NextLaunchCountdown/NextLaunchCountdown";
import LaunchWindowChart from "../../../../components/SpaceLaunches/LaunchWindowChart/LaunchWindowChart";
import { launchDetailsScreenStyles } from "./LaunchDetailsScreen.styles";
import SectionHeader from "../../../../components/layout/SectionHeader/SectionHeader";

const LaunchDetailsScreen = () => {
  const launchId = useLocalSearchParams().id as string;
  const { t } = useTranslation("tools/spaceLaunches");
  const { formatDate } = useAppUnits();
  const { getLaunchById } = useSpaceLaunches();
  const launch = getLaunchById(launchId);

  // Pas de route /:id côté API : si l'id n'est plus dans les 30 prochains lancements (lien ouvert
  // après coup, ou données rafraîchies), on revient à la liste plutôt que d'afficher un écran vide.
  useEffect(() => {
    if (!launch) {
      router.replace("/tools/space-launches");
    }
  }, [launch]);

  if (!launch) {
    return null;
  }

  const probability = getLaunchProbability(launch.probability);
  const precisionName = launch.net_precision?.name;
  const imageUrl = getLaunchImageUrl(launch.image);

  return (
    <View style={globalStyles.screen}>
      <ImageHeaderScrollView
        title={launch.name}
        subtitle={`${launch.launch_service_provider.name} · ${launch.rocket.configuration.full_name}`}
        image={imageUrl ? { uri: imageUrl } : require("../../../../../assets/images/placeholders/no-picture.png")}
      >
        <View style={[globalStyles.screen.content, { backgroundColor: "transparent" }]}>
          <View style={launchDetailsScreenStyles.statusRow}>
            <LaunchStatusBadge status={launch.status} />
            {launch.webcast_live && (
              <Badge text={t("details.webcastPlanned")} icon={Video} backgroundColor={app_colors.accent.light} foregroundColor={app_colors.primary.main} />
            )}
          </View>

          <NextLaunchCountdown launch={launch} />

          {/* TODO : implémenter les notifications (voir le même repli dans FutureApodScreen) */}
          {/* <View style={launchDetailsScreenStyles.section}>
            <SwitchInfoCard
              title={t("details.follow.title")}
              description={t("details.follow.subtitle")}
              variant="light"
              icon={Bell}
              isEnabled={false}
              onToggle={() => {}}
            />
            <View style={launchDetailsScreenStyles.followTimings}>
              <Badge text={t("details.follow.timing24h")} backgroundColor={app_colors.white} foregroundColor={app_colors.primary.main} borderColor={app_colors.primary.light} />
              <Badge text={t("details.follow.timing1h")} backgroundColor={app_colors.accent.main} foregroundColor={app_colors.white} />
              <Badge text={t("details.follow.timing10min")} backgroundColor={app_colors.white} foregroundColor={app_colors.primary.main} borderColor={app_colors.primary.light} />
            </View>
          </View> */}

          <View style={launchDetailsScreenStyles.section}>
            <SectionHeader title={t("details.launchWindow.title")} />
            <LaunchWindowChart
              net={launch.net}
              windowStart={launch.window_start}
              windowEnd={launch.window_end}
              precisionName={precisionName}
            />
          </View>

          {probability != null && (
            <View style={launchDetailsScreenStyles.probabilityCard}>
              <CircularGauge value={probability} progressColor={app_colors.primary.main} trackColor={withOpacity(app_colors.primary.main, 0.15)} size={70}>
                <Text style={launchDetailsScreenStyles.probabilityCard.value}>{probability}%</Text>
              </CircularGauge>
              <View style={launchDetailsScreenStyles.probabilityCard.text}>
                <Text style={launchDetailsScreenStyles.probabilityCard.text.title}>{t("details.probability.title")}</Text>
                <Text style={launchDetailsScreenStyles.probabilityCard.text.description}>
                  {launch.weather_concerns || t("details.probability.noConcerns")}
                </Text>
              </View>
            </View>
          )}

          {launch.mission && (
            <View style={launchDetailsScreenStyles.missionCard}>
              <Text style={globalStyles.categoryTitle}>{t("details.mission.title")}</Text>
              {/* mission.type / mission.orbit.name viennent tels quels de LL2 (ex: "LEO", "Communications") :
                  pas de dictionnaire de traduction exhaustif disponible, affichés bruts. */}
              <View style={launchDetailsScreenStyles.missionCard.tags}>
                {launch.mission.type && (
                  <Badge text={launch.mission.type} backgroundColor={app_colors.accent.light} foregroundColor={app_colors.primary.main} />
                )}
                {launch.mission.orbit?.name && (
                  <Badge text={launch.mission.orbit.name} backgroundColor={app_colors.accent.light} foregroundColor={app_colors.primary.main} />
                )}
              </View>
              <Text style={launchDetailsScreenStyles.missionCard.description}>
                {launch.mission.description || t("details.mission.noDescription")}
              </Text>
            </View>
          )}

          <View style={launchDetailsScreenStyles.section}>
            <SectionHeader title={t("details.rocket.title")} />
            <View style={launchDetailsScreenStyles.rocketRow}>
              <View style={launchDetailsScreenStyles.rocketCard}>
                <View>
                  <Text style={launchDetailsScreenStyles.rocketCard.name}>{launch.rocket.configuration.name}</Text>
                  <Text style={launchDetailsScreenStyles.rocketCard.subtitle}>
                    {launch.rocket.configuration.variant
                      ? t("details.rocket.variant", { variant: launch.rocket.configuration.variant })
                      : launch.rocket.configuration.full_name}
                  </Text>
                </View>
                {/* orbital_launch_attempt_count_year compte tous les lancements orbitaux (toutes
                    agences confondues), pas seulement ceux de ce lanceur — pas de compteur par
                    fusée côté API, on affiche donc ce repère-là plutôt qu'un chiffre inventé. */}
                {launch.orbital_launch_attempt_count_year != null && (
                  <Text style={launchDetailsScreenStyles.rocketCard.highlight}>
                    {t("details.rocket.orbitalRank", {
                      rank: launch.orbital_launch_attempt_count_year,
                      year: formatDate(launch.net).format("YYYY"),
                    })}
                  </Text>
                )}
              </View>

              <AgencyCard launch={launch} />
            </View>
          </View>

          <View style={launchDetailsScreenStyles.section}>
            <SectionHeader title={t("details.pad.title")} />
            {launch.pad.id != null && (
              <InfoCard
                variant="light"
                icon={MapPin}
                title={launch.pad.name}
                description={launch.pad.location?.name ?? t("details.pad.noLocation")}
                internalLink={`/tools/space-launches/pad/${launch.pad.id}`}
              />
            )}
            {launch.pad.latitude != null && launch.pad.longitude != null ? (
              <LocationMapCard latitude={launch.pad.latitude} longitude={launch.pad.longitude} terrain="satellite" type="view" />
            ) : (
              <ListCard items={[{ title: launch.pad.name, value: launch.pad.location?.name ?? t("details.pad.noLocation") }]} />
            )}
          </View>
        </View>
      </ImageHeaderScrollView>
    </View>
  );
}

// Carte agence de la section "Le lanceur" : hooks propres (logo), d'où un composant séparé plutôt
// qu'inliné dans LaunchDetailsScreen (qui a déjà un retour anticipé avant ce point du rendu).
const AgencyCard = ({ launch }: { launch: Launch }) => {
  const { t } = useTranslation("tools/spaceLaunches");
  const logoUrl = useAgencyLogo(launch.launch_service_provider.id);
  // Repli si l'agence n'a pas de logo (ou le temps qu'il arrive) : `abbrev` est déjà un code court
  // (ex: "SpaceX" -> "SX"), pas besoin d'un vrai calcul d'initiales.
  const providerInitials = launch.launch_service_provider.abbrev.slice(0, 2).toUpperCase();

  return (
    <TouchableOpacity
      style={launchDetailsScreenStyles.agencyCard}
      onPress={() => router.push(`/tools/space-launches/agency/${launch.launch_service_provider.id}`)}
    >
      <View style={launchDetailsScreenStyles.agencyCard.avatar}>
        {logoUrl ? (
          <Image source={{ uri: logoUrl }} style={launchDetailsScreenStyles.agencyCard.avatar.logo} resizeMode="cover" />
        ) : (
          <Text style={launchDetailsScreenStyles.agencyCard.avatar.text}>{providerInitials}</Text>
        )}
      </View>

      <View>
        <Text style={launchDetailsScreenStyles.agencyCard.name}>{launch.launch_service_provider.name}</Text>
        <Text style={launchDetailsScreenStyles.agencyCard.subtitle}>
          {launch.launch_service_provider.type?.name ?? launch.launch_service_provider.abbrev}
        </Text>
      </View>

      <Text style={launchDetailsScreenStyles.agencyCard.link}>{t("details.agency.viewAgency")}</Text>
    </TouchableOpacity>
  );
}

export default LaunchDetailsScreen;
