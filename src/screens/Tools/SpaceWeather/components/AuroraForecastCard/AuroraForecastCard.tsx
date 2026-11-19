import { useCallback, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import { MapPin } from "lucide-react-native";
import { globalStyles } from "../../../../../helpers/globalStyles";
import { app_colors } from "../../../../../helpers/variables";
import { useLocation } from "../../../../../context/LocationContext";
import { useAppUnits } from "../../../../../hooks/useAppUnits";
import { getAuroraForecast } from "../../../../../helpers/api/spaceWeather/aurora";
import type { AuroraForecast, AuroraImage, AuroraImageId, AuroraProbabilityLabel } from "../../../../../types/spaceWeather/AuroraForecast";
import { auroraForecastCardStyles } from "./AuroraForecastCard.styles";

// Même logique que auroraFavorable dans MagneticFieldCard : un niveau "favorable" (likely/high)
// ressort en accent, un niveau peu probable reste neutre.
const LOCAL_FORECAST_COLORS: Record<AuroraProbabilityLabel, { background: string; foreground: string }> = {
  unlikely: { background: app_colors.primary.light, foreground: app_colors.primary.medium },
  possible: { background: app_colors.primary.light, foreground: app_colors.primary.medium },
  likely: { background: app_colors.accent.light, foreground: app_colors.accent.main },
  high: { background: app_colors.accent.light, foreground: app_colors.accent.main },
};

/**
 * Prévision d'aurores (NOAA Ovation) : image principale + sélecteur modèle/carte × nord/sud, et
 * probabilité "ici" si la position est connue. Seule carte de cet écran dont les données dépendent
 * de la position (observatoire actif ou GPS) : refetch donc si elle change, contrairement aux
 * autres. Vignette sélectionnée par défaut sur l'hémisphère de l'utilisateur (rendu "carte", avec
 * côtes/labels, plus lisible que le rendu brut du modèle), préservée d'un focus à l'autre tant
 * qu'elle existe encore dans la nouvelle réponse.
 */
const AuroraForecastCard = () => {
  const { t } = useTranslation("tools/spaceWeather");
  const { location, isUsingObservatory, activeObservatory } = useLocation();
  const { formatDate } = useAppUnits();

  // Le titre du bloc "chez vous" doit refléter la position réellement utilisée pour la prévision
  // (observatoire actif prioritaire sur le GPS, voir LocationContext) plutôt qu'afficher "Chez vous"
  // alors que la position est celle d'un observatoire enregistré ailleurs.
  const localForecastTitle = isUsingObservatory && activeObservatory
    ? activeObservatory.display_name
    : t("auroraForecast.here.title");

  const [auroraForecast, setAuroraForecast] = useState<AuroraForecast | null>(null);
  const [selectedAuroraImage, setSelectedAuroraImage] = useState<AuroraImage | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const forecast = await getAuroraForecast(location?.latitude, location?.longitude);
        setAuroraForecast(forecast);
        setSelectedAuroraImage((current) => {
          const stillAvailable = forecast?.images.find((image) => image.id === current?.id);
          if (stillAvailable) return stillAvailable;
          const preferredId: AuroraImageId = (location?.latitude ?? 0) < 0 ? "dashboard.south" : "dashboard.north";
          return forecast?.images.find((image) => image.id === preferredId) ?? forecast?.images[0] ?? null;
        });
      })();
    }, [location?.latitude, location?.longitude])
  );

  return (
    <View style={globalStyles.defaultCard}>
      <View style={globalStyles.defaultCard.header}>
        <Text style={globalStyles.categoryTitle}>{t("auroraForecast.title")}</Text>
      </View>

      <View style={auroraForecastCardStyles.container}>

        {
          auroraForecast?.here && (() => {
            const colors = LOCAL_FORECAST_COLORS[auroraForecast.here.label];

            return (
              <View style={[auroraForecastCardStyles.container.localForecast, { backgroundColor: colors.background }]}>
                <View style={auroraForecastCardStyles.container.localForecast.info}>
                  <View style={auroraForecastCardStyles.container.localForecast.info.header}>
                    <MapPin color={colors.foreground} size={14} />
                    <Text style={[auroraForecastCardStyles.container.localForecast.info.title, { color: colors.foreground }]}>
                      {localForecastTitle}
                    </Text>
                  </View>
                  <Text style={[auroraForecastCardStyles.container.localForecast.info.label, { color: colors.foreground }]}>
                    {t(`auroraForecast.here.${auroraForecast.here.label}`)}
                  </Text>
                </View>

                <View style={auroraForecastCardStyles.container.localForecast.value}>
                  <Text style={[auroraForecastCardStyles.container.localForecast.value.main, { color: colors.foreground }]}>
                    {auroraForecast.here.probability}
                  </Text>
                  <Text style={[auroraForecastCardStyles.container.localForecast.value.unit, { color: colors.foreground }]}>%</Text>
                </View>
              </View>
            );
          })()
        }

        {
          selectedAuroraImage && (
            <Image
              style={auroraForecastCardStyles.container.image}
              src={selectedAuroraImage.imageUrl}
            />
          )
        }

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={auroraForecastCardStyles.container.imagesRow.content}
        >
          {
            auroraForecast?.images.map((image) => (
              <TouchableOpacity
                key={image.id}
                style={auroraForecastCardStyles.container.imagesRow.item}
                onPress={() => setSelectedAuroraImage(image)}
              >
                <Image
                  style={[
                    auroraForecastCardStyles.container.imagesRow.item.thumbnail,
                    selectedAuroraImage?.id === image.id && auroraForecastCardStyles.container.imagesRow.item.thumbnailActive,
                  ]}
                  src={image.imageUrl}
                />
                <Text style={auroraForecastCardStyles.container.imagesRow.item.label}>
                  {t(`auroraForecast.images.${image.id}`)}
                </Text>
              </TouchableOpacity>
            ))
          }
        </ScrollView>

        {
          auroraForecast && (
            <Text style={auroraForecastCardStyles.container.caption}>
              {t("auroraForecast.forecastTime", { time: formatDate(auroraForecast.forecastTime).format("HH:mm") })}
            </Text>
          )
        }
      </View>
    </View>
  );
};

export default AuroraForecastCard;
