import { Image, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useAppUnits } from "../../../hooks/useAppUnits";
import { useAgencyLogo } from "../../../hooks/useAgencyLogo";
import { getLaunchImageUrl } from "../../../helpers/spaceLaunches/launchImage";
import { Launch } from "../../../types/spaceLaunches/Launch";
import LaunchStatusBadge from "../LaunchStatusBadge/LaunchStatusBadge";
import { launchCardStyles } from "./LaunchCard.styles";

const LaunchCard = ({ launch }: { launch: Launch }) => {
  const { formatDate } = useAppUnits();
  const imageUrl = getLaunchImageUrl(launch.image);
  const providerLogoUrl = useAgencyLogo(launch.launch_service_provider.id);
  // Repli si l'agence n'a pas de logo (ou le temps qu'il arrive) : `abbrev` est déjà un code court
  // (ex: "SpaceX" -> "SX"), pas besoin d'un vrai calcul d'initiales.
  const providerInitials = launch.launch_service_provider.abbrev.slice(0, 2).toUpperCase();

  return (
    <TouchableOpacity style={launchCardStyles.card} onPress={() => router.push(`/tools/space-launches/${launch.id}`)}>
      <View style={launchCardStyles.card.imageContainer}>
        <Image
          source={imageUrl ? { uri: imageUrl } : require("../../../../assets/images/placeholders/no-picture.png")}
          style={launchCardStyles.card.imageContainer.image}
          resizeMode="cover"
        />
        <View style={launchCardStyles.card.imageContainer.overlay}>
          <View style={launchCardStyles.card.imageContainer.overlay.date}>
            <Text style={launchCardStyles.card.imageContainer.overlay.date.text}>
              {formatDate(launch.net).format("D MMM · HH:mm")}
            </Text>
          </View>
          <LaunchStatusBadge status={launch.status} />
        </View>
      </View>

      <View style={launchCardStyles.card.content}>
        <View style={launchCardStyles.card.content.avatar}>
          {providerLogoUrl ? (
            <Image source={{ uri: providerLogoUrl }} style={launchCardStyles.card.content.avatar.logo} resizeMode="cover" />
          ) : (
            <Text style={launchCardStyles.card.content.avatar.text}>{providerInitials}</Text>
          )}
        </View>
        <View style={launchCardStyles.card.content.texts}>
          <Text style={launchCardStyles.card.content.texts.title} numberOfLines={2}>{launch.name}</Text>
          <Text style={launchCardStyles.card.content.texts.subtitle} numberOfLines={1}>
            {launch.rocket.configuration.name} · {launch.launch_service_provider.abbrev}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default LaunchCard;
