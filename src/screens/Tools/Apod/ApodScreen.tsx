import { ActivityIndicator, Alert, Image, InteractionManager, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import RenderHTML from "@native-html/render";
import { globalStyles } from "../../../helpers/globalStyles";
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader";
import { useTranslation } from "react-i18next";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { apodScreenStyles } from "./ApodScreen.styles";
import { getCurrentApod, getFutureApod } from "../../../helpers/api/apod/apod";
import { Apod } from "../../../types/apod/Apod";
import dayjs from "dayjs";
import { app_colors, spacing, flattenOpacity } from "../../../helpers/variables";
import { Bookmark, CalendarClockIcon, ChevronRightIcon, Download, ExternalLink, Languages } from "lucide-react-native";
import { FutureApod } from "../../../types/apod/FutureApod";
import * as Linking from "expo-linking";
import { MediaLibraryPermissionDeniedError, saveImageToGallery } from "../../../helpers/images/saveImageToGallery";
import { useVideoPlayer, VideoView } from "expo-video";
import { WebView } from "react-native-webview";

// L'API APOD ne distingue pas un fichier vidéo direct (.mp4...) d'une page embarquable en iframe
// (YouTube, Vimeo...) au-delà du media_type "video" — on se base donc sur l'extension de l'URL
// pour choisir le bon lecteur : expo-video pour un fichier direct, WebView pour une iframe.
const DIRECT_VIDEO_FILE_EXTENSIONS = [".mp4", ".mov", ".webm", ".m3u8"];
const isDirectVideoFile = (url: string) => {
  const pathWithoutQuery = url.split("?")[0].toLowerCase();
  return DIRECT_VIDEO_FILE_EXTENSIONS.some((extension) => pathWithoutQuery.endsWith(extension));
};

// Couleur solide du fond derrière l'icône de nextImage.iconContainer : lui-même un fond
// semi-transparent (accent.light à 20%) posé sur le fond de l'écran — il faut le fond RÉEL,
// déjà aplati, pour que flattenOpacity de l'icône donne la bonne teinte.
const NEXT_IMAGE_ICON_CONTAINER_BACKGROUND = flattenOpacity(app_colors.accent.light, 0.2, app_colors.primary.main);

// Composant à part car useVideoPlayer est un hook : il ne doit être appelé que lorsque ce
// lecteur est effectivement monté (cas "fichier vidéo direct"), pas à chaque rendu d'ApodScreen.
const ApodVideoPlayer = ({ uri }: { uri: string }) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
  });

  return (
    <VideoView
      player={player}
      style={apodScreenStyles.screen.video}
      nativeControls
      allowsPictureInPicture
    />
  );
};

const ApodScreen = () => {

  const { i18n, t } = useTranslation("tools/apod");
  const { width } = useWindowDimensions();

  const [asset, setAsset] = useState<Apod | null>(null);
  const [nextAsset, setNextAsset] = useState<FutureApod | null>(null);
  // Ratio réel (largeur/hauteur) de l'image courante, récupéré de façon async via Image.getSize
  // ci-dessous — null tant qu'il n'est pas connu, l'affichage retombe alors sur le ratio 16:9 de
  // secours défini dans ApodScreen.styles.ts.
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);

  // Largeur dispo pour le HTML rendu : largeur d'écran moins le padding du screen (des deux
  // côtés) et celui du container description (lui aussi des deux côtés).
  const descriptionContentWidth = width - spacing.screen.horizontal * 2 - apodScreenStyles.screen.content.description.padding * 2;

  // Largeur réellement dispo pour l'image hero (juste le padding du screen, pas de container
  // supplémentaire ici) — sert à calculer sa hauteur en pixels, voir imageHeight ci-dessous.
  // Pas de plafond : l'objectif est d'afficher l'image dans ses vraies dimensions (ratio réel),
  // pas de la recadrer.
  const imageContentWidth = width - spacing.screen.horizontal * 2;
  const FALLBACK_IMAGE_ASPECT_RATIO = 16 / 9; // tant que le vrai ratio n'est pas encore connu
  const imageHeight = imageContentWidth / (imageAspectRatio ?? FALLBACK_IMAGE_ASPECT_RATIO);

  useEffect(() => {
    if (!asset || asset.media_type !== "image") {
      setImageAspectRatio(null);
      return;
    }

    const imageUrl = asset.hdurl ?? asset.url;
    Image.getSize(
      imageUrl,
      (naturalWidth, naturalHeight) => setImageAspectRatio(naturalWidth / naturalHeight),
      (error) => console.error("[ApodScreen] Impossible de récupérer les dimensions de l'image :", error)
    );
  }, [asset]);

  useFocusEffect(
      useCallback(() => {
        StatusBar.setStyle("light");
        return () => StatusBar.setStyle("light");
      }, [])
    );

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(async () => {
      const apod = await getCurrentApod();
      const futureApod = await getFutureApod();
      setAsset(apod);
      setNextAsset(futureApod);
    });
    return () => task.cancel();
  }, []);

  const handleDownloadPress = async () => {
    if (!asset || asset.media_type !== "image") return;

    try {
      await saveImageToGallery(asset.hdurl ?? asset.url);
      Alert.alert(t('screen.content.buttons.downloadSuccessTitle'), t('screen.content.buttons.downloadSuccessMessage'));
    } catch (error) {
      if (error instanceof MediaLibraryPermissionDeniedError) {
        Alert.alert(t('screen.content.buttons.downloadPermissionDeniedTitle'), t('screen.content.buttons.downloadPermissionDeniedMessage'));
        return;
      }

      console.error("[ApodScreen] Erreur lors du téléchargement de l'image :", error);
      Alert.alert(t('screen.content.buttons.downloadErrorTitle'), t('screen.content.buttons.downloadErrorMessage'));
    }
  }


  return (
    <View style={[globalStyles.screen, apodScreenStyles.screen]}>
      <ScreenHeader title={t('screen.title')} main={false} noBackground={true} />

      <ScrollView>
        <View style={globalStyles.content}>

          {
            asset ? (
              <>
                {
                  asset.media_type === "image" && (
                    <Image
                      source={{ uri: asset.hdurl ?? asset.url }}
                      style={[apodScreenStyles.screen.image, { height: imageHeight }]}
                    />
                  )
                }
                {
                  asset.media_type === "video" && (
                    isDirectVideoFile(asset.url) ? (
                      <ApodVideoPlayer uri={asset.url} />
                    ) : (
                      <WebView
                        source={{ uri: asset.url }}
                        style={apodScreenStyles.screen.video}
                        allowsFullscreenVideo
                      />
                    )
                  )
                }
              </>
            ) : (
              <Image
                source={require('../../../../assets/images/placeholders/apod-placeholder.png')}
                style={apodScreenStyles.screen.placeholderImage}
              />
            )
          }

          {
            asset ? (
              <>
                <View style={apodScreenStyles.screen.content.header}>
                  <Text style={apodScreenStyles.screen.content.header.date}>{dayjs(asset?.date).format("dddd D MMMM YYYY")}</Text>
                  <Text style={apodScreenStyles.screen.content.header.title}>{asset?.title}</Text>
                  <Text style={apodScreenStyles.screen.content.header.copyright}>{asset?.copyright}</Text>
                </View>
    
                <View style={apodScreenStyles.screen.content.buttons}>
                  <TouchableOpacity style={[apodScreenStyles.screen.content.buttons.button, apodScreenStyles.screen.content.buttons.button.active]} onPress={handleDownloadPress}>
                    <Download size={20} color={app_colors.white} />
                    <Text style={apodScreenStyles.screen.content.buttons.button.text}>{t('screen.content.buttons.download')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={apodScreenStyles.screen.content.buttons.button}>
                    <Bookmark size={20} color={app_colors.white} />
                    <Text style={apodScreenStyles.screen.content.buttons.button.text}>{t('screen.content.buttons.save')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={apodScreenStyles.screen.content.buttons.button} onPress={() => Linking.openURL(asset?.permalink || "")}>
                    <ExternalLink size={20} color={app_colors.white} />
                    <Text style={apodScreenStyles.screen.content.buttons.button.text}>{t('screen.content.buttons.article')}</Text>
                  </TouchableOpacity>
                </View>
    
                <View style={apodScreenStyles.screen.content.description}>
                  <View style={apodScreenStyles.screen.content.description.header}>
                    <Text style={apodScreenStyles.screen.content.description.header.title}>{t('screen.content.description.title')}</Text>
                    <View style={apodScreenStyles.screen.content.description.header.translate}>
                      {/* <Languages size={12} color={app_colors.accent.main} /> */}
                      <Text style={apodScreenStyles.screen.content.description.header.translate.text}>{t('screen.content.description.language')}</Text>
                    </View>
                  </View>
    
                  {asset?.explanation && (
                    <RenderHTML
                      source={{ html: asset.explanation }}
                      contentWidth={descriptionContentWidth}
                      baseStyle={apodScreenStyles.screen.content.description.text}
                      // Les liens (<a>) ouvrent déjà le navigateur système par défaut (comportement
                      // natif de la lib) — seul le style visuel est à préciser ici.
                      tagsStyles={{ a: { color: app_colors.accent.main, textDecorationLine: "underline" } }}
                    />
                  )}
                </View>
    
                <TouchableOpacity style={apodScreenStyles.screen.content.nextImage} onPress={() => router.push({pathname: "/tools/apod/upcoming", params: {nextAsset: JSON.stringify(nextAsset)}})}>
                  <View style={apodScreenStyles.screen.content.nextImage.iconContainer}>
                    <CalendarClockIcon size={25} color={flattenOpacity(app_colors.white, 0.5, NEXT_IMAGE_ICON_CONTAINER_BACKGROUND)} />
                  </View>
                  <View style={apodScreenStyles.screen.content.nextImage.textContainer}>
                    <Text style={apodScreenStyles.screen.content.nextImage.date}>{dayjs(nextAsset?.post_date).format("ddd D MMM YYYY")}</Text>
                    <Text style={apodScreenStyles.screen.content.nextImage.title}>{nextAsset ? nextAsset.title : t('screen.content.nextImage.loading')}</Text>
                  </View>
                  <ChevronRightIcon size={25} color={flattenOpacity(app_colors.white, 0.5, app_colors.primary.main)} />
                </TouchableOpacity>
              </>
            ) : (
              <ActivityIndicator size="large" color={app_colors.accent.main} style={{ marginTop: 20 }} />
            )
          }
        </View>
      </ScrollView>
    </View>
  );
};

export default ApodScreen;