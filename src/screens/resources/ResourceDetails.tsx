import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View, NativeSyntheticEvent, NativeScrollEvent, Linking, Touchable, TouchableOpacity, Image, Platform } from "react-native";
import { globalStyles } from "../../styles/global";
import { ImageBackground } from "expo-image";
import { resourceDetailsStyles } from "../../styles/screens/resources/details";
import { LinearGradient } from "expo-linear-gradient";
import { app_colors } from "../../helpers/constants";
import { markdownStyles } from "../../styles/markdown";
import { StatusBar } from "expo-status-bar";
import { generateResourceLevelText } from "../../helpers/scripts/resources/generateResourceLevelText";
import { readingTime } from "reading-time-estimator";
import { useTranslation } from "../../hooks/useTranslation";
import { fr } from 'reading-time-estimator/i18n/fr'
import { pageTitleStyles } from "../../styles/components/commons/pageTitle";
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/AppSettingsContext";
import { eventTypes } from "../../helpers/constants/analytics";
import { Paths, Directory, File } from "expo-file-system";
import * as Sharing from "expo-sharing";
import Markdown from 'react-native-markdown-display';
import Constants from "expo-constants";
import DSOValues from "../../components/commons/DSOValues";
import SimpleButton from "../../components/commons/buttons/SimpleButton";

const markdownRules = {
  image: (node: any, children: any, parent: any, styles: any) => {
    const { src = "", alt = "" } = node.attributes || {};

    if (!src) {
      return null;
    }

    const imageProps = {
      source: { uri: src },
      style: styles?.image,
      resizeMode: "contain" as const,
      accessible: true,
      accessibilityLabel: alt || "image",
    };

    return (
      <Image
        key={node.key}
        {...imageProps}
      />
    );
  },
};

export default function ResourceDetails({ navigation, route }: any) {

  const {currentUser} = useAuth()
  const {currentLocale} = useTranslation()
  const {currentUserLocation} = useSettings()

  const { resource } = route.params;
  const [statusBarOpaque, setStatusBarOpaque] = useState(false);

  const [readTime, setReadTime] = useState<string>("");
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentLocale === "fr") {
      const frenchResult = readingTime(resource.content || "", {language: 'fr', translations: {fr}}).text;
      setReadTime(frenchResult);
    } else {
      const result = readingTime(resource.content || "").text;
      setReadTime(result);
    }
  }, [currentLocale])

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const shouldBeOpaque = event.nativeEvent.contentOffset.y > 40;
    if (shouldBeOpaque !== statusBarOpaque) {
      setStatusBarOpaque(shouldBeOpaque);
    }
  }, [statusBarOpaque]);

  const handleGoBack = () => {
    const prevRoute = navigation.getState().routes[navigation.getState().index - 1].name
    sendAnalyticsEvent(currentUser, currentUserLocation, 'back_button_pressed', eventTypes.BUTTON_CLICK, { from: resource.title, to: prevRoute }, currentLocale)
    navigation.goBack()
  }

  const handleDownloadResource = async (isPdf: boolean) => {
    const url = isPdf ? resource.pdfUrl : resource.memoUrl;
    const directory = new Directory(Paths.document, "astroshare_downloads");
    setDownloadLoading(true);
  
    try {
      // 1. Création idempotente du dossier (ne plante pas s’il existe)
      directory.create({
        idempotent: true,
        intermediates: true,
      });
  
      // 2. Déduire le nom du fichier depuis l’URL
      const filename = url.split("/").pop() ?? "resource.pdf";
  
      // 3. Référence vers le fichier final
      const file = new File(directory, filename);
  
      // 4. Télécharger seulement si absent
      if (!file.exists) {
        console.log("Fichier absent → téléchargement…");
  
        const downloadResult = await File.downloadFileAsync(url, file);
  
        console.log("Téléchargé :", downloadResult.uri);
      } else {
        console.log("Fichier déjà existant → pas de téléchargement");
      }

      sendAnalyticsEvent(currentUser, currentUserLocation, 'resource_downloaded', eventTypes.FILE_DOWNLOAD, { resource: resource.title, file_type: isPdf ? 'pdf' : 'memo' }, currentLocale)
  
      // 5. Ouvrir le fichier via le share sheet (fiable iOS + Android)
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/pdf",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      sendAnalyticsEvent(currentUser, currentUserLocation, 'resource_download_error', eventTypes.ERROR, { resource: resource.title, file_type: isPdf ? 'pdf' : 'memo', error: JSON.stringify(error) }, currentLocale)
      console.error("Erreur lors du téléchargement/lecture :", error);
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <View style={[globalStyles.body, resourceDetailsStyles.page]}>
      <StatusBar
        animated
        translucent
        style="light"
        backgroundColor={statusBarOpaque ? app_colors.black : 'transparent'}
      />
      <View
        pointerEvents="none"
        style={[
          resourceDetailsStyles.statusBarOverlay,
          {
            height: Constants.statusBarHeight,
            backgroundColor: statusBarOpaque ? app_colors.black : 'transparent',
          }
        ]}
      />
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        <ImageBackground source={{ uri: resource.illustrationUrl }} style={{ width: '100%', height: 230 }} imageStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20, }}>
          <LinearGradient colors={['transparent', app_colors.black]} locations={[0, 0.9]} style={resourceDetailsStyles.gradientContainer}>
            <TouchableOpacity>
              <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => handleGoBack()}>
                <Image style={pageTitleStyles.container.icon} source={require('../../../assets/icons/FiChevronDown.png')}/>
              </TouchableOpacity>
            </TouchableOpacity>
            <Text style={resourceDetailsStyles.title}>{resource.title}</Text>
            <Text style={resourceDetailsStyles.description}>{resource.description}</Text>
          </LinearGradient>
        </ImageBackground>

        <View style={resourceDetailsStyles.infoBox}>
          <DSOValues title="Durée de lecture" value={readTime} />
          <DSOValues title="Niveau" value={generateResourceLevelText(resource.level)} />
          <DSOValues title="Tags" value={
            <View style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
              {resource.tags.map((tag: string, index: number) => (
                <Text key={index} style={{ fontSize: 12, color: app_colors.white, backgroundColor: app_colors.white_no_opacity, borderRadius: 5, padding: 5 }}>{tag}</Text>
              ))}
            </View>
          } />
          {/* <DSOValues title="Téléchargements" value={resource.downloads} /> */}

          <View style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {
              resource.pdfUrl &&
                <SimpleButton
                  text={downloadLoading ? "Téléchargement..." : "Télécharger le PDF"}
                  onPress={() => handleDownloadResource(true)}
                  backgroundColor={app_colors.white}
                  fullWidth
                  textAdditionalStyles={{ color: app_colors.black, fontFamily: 'GilroyBlack', textTransform: 'uppercase' }}
                  align="center"
                  disabled={downloadLoading}
                />
            }
            {
              resource.memoUrl &&
                <SimpleButton
                  text={downloadLoading ? "Téléchargement..." : "Télécharger la fiche mémo"}
                  onPress={() => handleDownloadResource(false)}
                  backgroundColor={app_colors.white}
                  fullWidth
                  textAdditionalStyles={{ color: app_colors.black, fontFamily: 'GilroyBlack', textTransform: 'uppercase' }}
                  align="center"
                  disabled={downloadLoading}
                />
            }
          </View>
        </View>

        <View style={{ paddingHorizontal: 10, paddingBottom: 50}}>
          <Markdown style={markdownStyles} rules={markdownRules}>
            {resource.content}
          </Markdown>
        </View>
      </ScrollView>
    </View>
  );
}
