import { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import { Maximize2, Pause, Play, Radio } from "lucide-react-native";
import { globalStyles } from "../../../../../helpers/globalStyles";
import { app_colors } from "../../../../../helpers/variables";
import Badge from "../../../../../components/Badges/Badge/Badge";
import SunAnimationPlayer from "../../../../../components/media/SunAnimationPlayer/SunAnimationPlayer";
import FullscreenImageModal from "../../../../../components/overlays/FullscreenImageModal/FullscreenImageModal";
import { getSunImagery } from "../../../../../helpers/api/spaceWeather/sunImagery";
import type { SunImage, SunImagery } from "../../../../../types/spaceWeather/SunImagery";
import { sunImageryCardStyles } from "./SunImageryCard.styles";

/**
 * Image du Soleil courante (SDO/SWPC) + sélecteur de longueur d'onde. Rafraîchi au focus de
 * l'écran plutôt qu'en continu (images/animations CDN NASA/NOAA, pas besoin de polling — voir la
 * doc de l'API). Le choix de la vignette sélectionnée est préservé d'un focus à l'autre tant que la
 * longueur d'onde existe encore dans la nouvelle réponse.
 */
const SunImageryCard = () => {
  const { t } = useTranslation("tools/spaceWeather");
  const [sunImagery, setSunImagery] = useState<SunImagery | null>(null);
  const [selectedImage, setSelectedImage] = useState<SunImage | null>(null);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Retombe sur l'image statique à chaque changement de vignette plutôt que de garder l'animation
  // précédente en train de jouer sur le nouveau choix.
  useEffect(() => {
    setIsPlayingAnimation(false);
  }, [selectedImage?.wavelength]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const imagery = await getSunImagery();
        setSunImagery(imagery);
        setSelectedImage((current) => {
          const stillAvailable = imagery?.images.find((image) => image.wavelength === current?.wavelength);
          return stillAvailable ?? imagery?.images.find((image) => image.wavelength === "HMIIC") ?? imagery?.images[0] ?? null;
        });
      })();
    }, [])
  );

  return (
    <View style={globalStyles.defaultCard}>
      <View style={globalStyles.defaultCard.header}>
        <Text style={globalStyles.categoryTitle}>{t("imagery.title")}</Text>
        <Badge
          text={t("sumary.badge")}
          icon={Radio}
          borderColor={app_colors.red.main}
          backgroundColor="transparent"
          foregroundColor={app_colors.red.main}
        />
      </View>

      <View style={sunImageryCardStyles.imageryContainer}>
        <View>
          {
            isPlayingAnimation && selectedImage?.animationUrl ? (
              <SunAnimationPlayer uri={selectedImage.animationUrl} style={sunImageryCardStyles.imageryContainer.image} />
            ) : (
              <Image
                style={sunImageryCardStyles.imageryContainer.image}
                src={selectedImage?.imageUrl}
              />
            )
          }

          <View style={sunImageryCardStyles.imageryContainer.imageActions}>
            {
              selectedImage?.animationUrl && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={sunImageryCardStyles.imageryContainer.imageActions.button}
                  onPress={() => setIsPlayingAnimation((playing) => !playing)}
                >
                  {
                    isPlayingAnimation
                      ? <Pause color={app_colors.white} size={16} fill={app_colors.white} />
                      : <Play color={app_colors.white} size={16} fill={app_colors.white} />
                  }
                </TouchableOpacity>
              )
            }
            {
              selectedImage?.imageUrl && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={sunImageryCardStyles.imageryContainer.imageActions.button}
                  onPress={() => setIsFullscreen(true)}
                >
                  <Maximize2 color={app_colors.white} size={16} />
                </TouchableOpacity>
              )
            }
          </View>
        </View>

        <View>
          <Text style={sunImageryCardStyles.imageryContainer.image.caption}>
            {selectedImage ? t(`imagery.wavelengths.${selectedImage.label}`) : t("imagery.caption")}
          </Text>
        </View>
      </View>

      <Text style={[globalStyles.categoryTitle, { marginTop: 20 }]}>{t("imagery.otherWavelengths")}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={sunImageryCardStyles.wavelengthsRow.content}
      >
        {
          [...(sunImagery?.images ?? []), sunImagery?.corona && { ...sunImagery.corona, wavelength: "CORONA" }]
            .filter((image): image is SunImage => !!image)
            .map((image) => (
              <TouchableOpacity key={image.wavelength} style={sunImageryCardStyles.wavelengthsRow.item} onPress={() => setSelectedImage(image)}>
                <Image
                  style={[
                    sunImageryCardStyles.wavelengthsRow.item.thumbnail,
                    selectedImage?.wavelength === image.wavelength && sunImageryCardStyles.wavelengthsRow.item.thumbnailActive,
                  ]}
                  src={image.imageUrl}
                />
                <Text style={sunImageryCardStyles.wavelengthsRow.item.label}>{t(`imagery.wavelengths.${image.label}`)}</Text>
              </TouchableOpacity>
            ))
        }
      </ScrollView>

      <FullscreenImageModal
        visible={isFullscreen}
        imageUrl={selectedImage?.imageUrl}
        onClose={() => setIsFullscreen(false)}
      />
    </View>
  );
};

export default SunImageryCard;
