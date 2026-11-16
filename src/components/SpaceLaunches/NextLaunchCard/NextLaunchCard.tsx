import { Image, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { getLaunchImageUrl } from "../../../helpers/spaceLaunches/launchImage";
import { useAgencyLogo } from "../../../hooks/useAgencyLogo";
import { Launch } from "../../../types/spaceLaunches/Launch";
import LaunchStatusBadge from "../LaunchStatusBadge/LaunchStatusBadge";
import NextLaunchCountdown from "../NextLaunchCountdown/NextLaunchCountdown";
import { nextLaunchCardStyles } from "./NextLaunchCard.styles";

interface NextLaunchCardProps {
  launch: Launch;
  onPress?: () => void;
}

// Hero "prochain décollage" de l'écran principal : statut, compteur (NextLaunchCountdown en
// variant="inline", posé directement sur le fond sombre), puis le nom/lanceur en pied de carte.
const NextLaunchCard = ({ launch, onPress }: NextLaunchCardProps) => {
  const { t } = useTranslation("tools/spaceLaunches");
  const imageUrl = getLaunchImageUrl(launch.image);
  const Container = onPress ? TouchableOpacity : View;
  const providerLogoUrl = useAgencyLogo(launch.launch_service_provider.id);
  // Repli si l'agence n'a pas de logo (ou le temps qu'il arrive) : `abbrev` est déjà un code court
  // (ex: "SpaceX" -> "SX"), pas besoin d'un vrai calcul d'initiales.
  const providerInitials = launch.launch_service_provider.abbrev.slice(0, 2).toUpperCase();

  return (
    <Container style={nextLaunchCardStyles.container} {...(onPress ? { onPress } : {})}>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={nextLaunchCardStyles.container.backgroundImage} resizeMode="cover" />
      )}
      <View style={nextLaunchCardStyles.container.scrim} />

      <View style={nextLaunchCardStyles.container.headerRow}>
        {/* <Text style={nextLaunchCardStyles.container.headerRow.heading}>{t("nextLaunch.heading")}</Text> */}
        <LaunchStatusBadge status={launch.status} />
      </View>

      <NextLaunchCountdown launch={launch} variant="inline" />

      <View style={nextLaunchCardStyles.container.divider} />

      <View style={nextLaunchCardStyles.container.footerRow}>
        <View style={nextLaunchCardStyles.container.footerRow.avatar}>
          {providerLogoUrl ? (
            <Image source={{ uri: providerLogoUrl }} style={nextLaunchCardStyles.container.footerRow.avatar.logo} resizeMode="cover" />
          ) : (
            <Text style={nextLaunchCardStyles.container.footerRow.avatar.text}>{providerInitials}</Text>
          )}
        </View>
        <View style={nextLaunchCardStyles.container.footerRow.texts}>
          <Text style={nextLaunchCardStyles.container.footerRow.texts.name} numberOfLines={1}>{launch.name}</Text>
          <Text style={nextLaunchCardStyles.container.footerRow.texts.subtitle} numberOfLines={1}>
            {launch.rocket.configuration.name} · {launch.launch_service_provider.abbrev}
          </Text>
        </View>
      </View>
    </Container>
  );
}

export default NextLaunchCard;
