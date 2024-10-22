import React from 'react';
import {ImageBackground, ScrollView, Text, View} from "react-native";
import {globalStyles} from "../../styles/global";
import PageTitle from "../../components/commons/PageTitle";
import {i18n} from "../../helpers/scripts/i18n";
import {ressourcesScreenStyles} from "../../styles/screens/ressources/ressources";
import {useRessources} from "../../contexts/RessourcesContext";
import {Category} from "../../helpers/types/ressources/Category";

function RessourcesScreen({navigation}: any) {

  const {categories} = useRessources();

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title={i18n.t('home.buttons.ressources.title')} subtitle={i18n.t('home.buttons.ressources.subtitle')} />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={ressourcesScreenStyles.content}>
          <Text style={ressourcesScreenStyles.content.title}>Sélectionnez une catégorie</Text>
          {
            categories.length > 0 ?
              categories.map((category: Category, index: number) => {
                return (
                  <ImageBackground src={category.image} imageStyle={ressourcesScreenStyles.content.category.background} key={index} style={ressourcesScreenStyles.content.category}>
                    <Text style={ressourcesScreenStyles.content.category.title}>{category.name}</Text>
                  </ImageBackground>
                )
              }) : <Text>{i18n.t('home.buttons.ressources.noRessources')}</Text>
          }
        </View>
      </ScrollView>
    </View>
  );
}

export default RessourcesScreen;