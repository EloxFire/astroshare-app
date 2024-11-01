import React, {useEffect, useState} from 'react';
import {ImageBackground, Platform, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {globalStyles} from "../../styles/global";
import PageTitle from "../../components/commons/PageTitle";
import {ressourceStyles} from "../../styles/screens/ressources/ressource";
import {Ressource} from "../../helpers/types/ressources/Ressource";
import Markdown from 'react-native-markdown-display';
import {markdownRules} from "../../helpers/scripts/ressources/markdownRules";
import {markdownStyles} from "../../styles/markdown";
import DSOValues from "../../components/commons/DSOValues";
import {getRessourceLevel} from "../../helpers/scripts/ressources/getRessourceLevel";
import {getRessourcesTags} from "../../helpers/scripts/ressources/getRessourcesTags";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
// @ts-ignore
import readingTime from 'reading-time/lib/reading-time';
import dayjs from "dayjs";
import {showToast} from "../../helpers/scripts/showToast";
import {i18n} from "../../helpers/scripts/i18n";
import DisclaimerBar from "../../components/banners/DisclaimerBar";
import {useTranslation} from "../../hooks/useTranslation";

function CategoryScreen({route, navigation}: any) {
  const ressource: Ressource = route.params.ressource;
  const {currentLocale} = useTranslation()

  const [readingStats, setReadingStats] = useState<any>({});

  useEffect(() => {
    if(ressource.type !==  'pdf'){
      const stats = readingTime(ressource.mardownContent!);
      setReadingStats(stats);
    }
  }, []);

  const handleDownload = async () => {
    try {
      // Vérifier s'il y a des fichiers disponibles
      if (!ressource.files || ressource.files.length === 0) {
        console.log("No file to download");
        return;
      }

      // Nom du fichier pour le stockage local
      let fileName = ressource.downloadNames[0].replaceAll(':', '').replaceAll(' ', '_').replaceAll('__', '_');
      if (!fileName.endsWith('.pdf')) {
        fileName = `${fileName}.pdf`;
      }

      // URL du fichier PDF
      const fileUrl = ressource.files[0];

      // Emplacement de téléchargement dans le répertoire de documents
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Télécharger le fichier
      const downloadResumable = FileSystem.createDownloadResumable(fileUrl, fileUri);
      const f = await downloadResumable.downloadAsync();

      if(!f){
        showToast({message: i18n.t('ressourcesScreen.ressourceScreen.errors.download'), type: "error"});
        return;
      }

      showToast({ message: i18n.t('ressourcesScreen.ressourceScreen.download.success'), type: "success" });

      // Proposer à l'utilisateur de visualiser le fichier si la plateforme le permet
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(f.uri);
        } else {
          showToast({ message: i18n.t('ressourcesScreen.ressourceScreen.errors.overviewNoSupport'), type: "error" });
        }
      }
    } catch (error) {
      showToast({ message: i18n.t('ressourcesScreen.ressourceScreen.error.download'), type: "error" });
    }
  };

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title={ressource.name} subtitle={ressource.subtitle} />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
          <ScrollView>
            <View style={ressourceStyles.content}>
              {
                currentLocale !== 'fr' &&
                <DisclaimerBar message={"This ressource is only available in French."} type={"warning"}/>
              }
              <View style={ressourceStyles.content.infoBox}>
                <ImageBackground source={{uri: ressource.filePreview}} style={ressourceStyles.content.infoBox.imageContainer} imageStyle={ressourceStyles.content.infoBox.imageContainer.image}/>
                <View style={ressourceStyles.content.infoBox.body}>
                  <DSOValues title={i18n.t('ressourcesScreen.ressourceScreen.level')} value={getRessourceLevel(ressource).element}/>
                  <DSOValues title={i18n.t('ressourcesScreen.ressourceScreen.tags')} value={getRessourcesTags(ressource)}/>
                  <DSOValues title={i18n.t('ressourcesScreen.ressourceScreen.readingTime')} value={`${Math.ceil(dayjs.duration(readingStats.time).asMinutes())} min`}/>
                </View>
                {
                  ressource.files && ressource.files.length > 0 &&
                    <TouchableOpacity style={ressourceStyles.content.infoBox.downloadButton} onPress={handleDownload}>
                        <Text style={ressourceStyles.content.infoBox.downloadButton.label}>{`${i18n.t('ressourcesScreen.ressourceScreen.download.main')} ${ressource.type === 'pdf' ? i18n.t('ressourcesScreen.ressourceScreen.download.pdf') : i18n.t('ressourcesScreen.ressourceScreen.download.memo')}`}</Text>
                    </TouchableOpacity>
                }
              </View>
              {
                ressource.type !== 'pdf' &&
                  <View style={ressourceStyles.content.markdownContent}>
                      <Markdown style={markdownStyles.global} rules={markdownRules}>{ressource.mardownContent}</Markdown>
                  </View>
              }
            </View>
          </ScrollView>
      </ScrollView>
    </View>
  );
}

export default CategoryScreen;