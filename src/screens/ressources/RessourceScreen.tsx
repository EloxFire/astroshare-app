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
import * as IntentLauncher from 'expo-intent-launcher';
// @ts-ignore
import readingTime from 'reading-time/lib/reading-time';
import dayjs from "dayjs";
import {showToast} from "../../helpers/scripts/showToast";

function CategoryScreen({route, navigation}: any) {
  const ressource: Ressource = route.params.ressource;

  const [readingStats, setReadingStats] = useState<any>({});

  useEffect(() => {
    if(ressource.type !==  'pdf'){
      const stats = readingTime(ressource.mardownContent!);
      console.log(stats);
      setReadingStats(stats);
    }
  }, []);

  const handleDownload = async () => {
    if(!ressource.files || ressource.files.length === 0) {
      console.log("No file to download");
      return;
    }
    const fileName = ressource.downloadNames[0];
    const fileUrl = ressource.files[0];
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if(!permissions.granted){
      showToast({message: "Vous devez autoriser l'accès au stockage pour télécharger le fichier", type: "error"});
      return;
    }

    try {
      const response = await FileSystem.downloadAsync(fileUrl, `${permissions.directoryUri}/${fileName}`);

      try{
        if (Platform.OS === "android") {
          const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
          if (permissions.granted) {
            const base64 = await FileSystem.readAsStringAsync(response.uri, {encoding: FileSystem.EncodingType.Base64});
            await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, response.headers['content-type'])
              .then(async (uri) => {
                await FileSystem.writeAsStringAsync(uri, base64, {encoding: FileSystem.EncodingType.Base64});
              })
              .catch(e => console.log(e));
          } else {
            showToast({message: "IOS not supported", type: "error"});
          }
        }
      } catch (e) {
        showToast({message: "Une erreur est survenue lors de la création du fichier", type: "error"});
      }
    } catch (e) {
      console.log(e)
      showToast({message: "Une erreur est survenue lors du téléchargement du fichier", type: "error"});
    }
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title={ressource.name} subtitle={ressource.subtitle} />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
          <ScrollView>
            <View style={ressourceStyles.content}>
              <View style={ressourceStyles.content.infoBox}>
                <ImageBackground source={{uri: ressource.filePreview}} style={ressourceStyles.content.infoBox.imageContainer} imageStyle={ressourceStyles.content.infoBox.imageContainer.image}/>
                <View style={ressourceStyles.content.infoBox.body}>
                  <DSOValues title={"Niveau"} value={getRessourceLevel(ressource).element}/>
                  <DSOValues title={"Tags"} value={getRessourcesTags(ressource)}/>
                  <DSOValues title={"Temps de lecture"} value={`${Math.ceil(dayjs.duration(readingStats.time).asMinutes())} min`}/>
                </View>
                {
                  ressource.files && ressource.files.length > 0 &&
                    <TouchableOpacity style={ressourceStyles.content.infoBox.downloadButton} onPress={handleDownload}>
                        <Text style={ressourceStyles.content.infoBox.downloadButton.label}>Télécharger {ressource.type === 'pdf' ? "le document" : "la fiche mémo"}</Text>
                    </TouchableOpacity>
                }
              </View>
              {
                ressource.type !== 'pdf' &&
                  <View style={ressourceStyles.content.markdownContent}>
                      <Markdown style={markdownStyles.global} rules={markdownRules} debugPrintTree>{ressource.mardownContent}</Markdown>
                  </View>
              }
            </View>
          </ScrollView>
      </ScrollView>
    </View>
  );
}

export default CategoryScreen;