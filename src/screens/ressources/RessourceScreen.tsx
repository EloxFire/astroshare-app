import React, {useEffect, useState} from 'react';
import {ImageBackground, ScrollView, View} from "react-native";
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
// @ts-ignore
import readingTime from 'reading-time/lib/reading-time';
import dayjs from "dayjs";

function CategoryScreen({route, navigation}: any) {
  const ressource: Ressource = route.params.ressource;

  const [readingStats, setReadingStats] = useState<any>({});

  console.log(ressource.filePreview)

  useEffect(() => {
    if(ressource.type !==  'pdf'){
      const stats = readingTime(ressource.mardownContent!);
      console.log(stats);
      setReadingStats(stats);
    }
  }, []);

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