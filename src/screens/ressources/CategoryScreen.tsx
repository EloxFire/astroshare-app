import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {globalStyles} from "../../styles/global";
import PageTitle from "../../components/commons/PageTitle";
import {i18n} from "../../helpers/scripts/i18n";
import {useRessources} from "../../contexts/RessourcesContext";
import {Category} from "../../helpers/types/ressources/Category";
import {categoriesScreenStyles} from "../../styles/screens/ressources/categoryScreen";
import {Ressource} from "../../helpers/types/ressources/Ressource";
import DSOValues from "../../components/commons/DSOValues";
import InputWithIcon from "../../components/forms/InputWithIcon";
import {getRessourceLevel} from "../../helpers/scripts/ressources/getRessourceLevel";
import {getRessourcesTags} from "../../helpers/scripts/ressources/getRessourcesTags";

function CategoryScreen({route, navigation}: any) {

  const {ressources} = useRessources();
  const category: Category = route.params.category;

  const [ressourcesList, setRessourcesList] = useState<Ressource[]>([]);

  useEffect(() => {
    setRessourcesList(ressources.filter(ressource => ressource.category === category.slug));
  }, []);

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title={category.name} subtitle={category.description} />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={categoriesScreenStyles.content}>
          <ScrollView>
            <View style={categoriesScreenStyles.content.categoryHeader}>
              <Text style={categoriesScreenStyles.content.categoryHeader.title}>{i18n.t('ressourcesScreen.categoryScreen.title')}</Text>
              <Text style={categoriesScreenStyles.content.categoryHeader.description}>{category.longDescription}</Text>
              <DSOValues title={i18n.t('ressourcesScreen.categoryScreen.availableRessources')} value={ressourcesList.length} />
            </View>
            <View>
              <InputWithIcon placeholder={"Rechercher une ressource"} changeEvent={() => {}} search={() => {}} icon={require('../../../assets/icons/FiSearch.png')} value={""}/>
            </View>
            {
              ressourcesList.map((ressource: Ressource, index: number) => {
                return (
                  <TouchableOpacity key={index} style={categoriesScreenStyles.content.ressourceCard}>
                    <Image source={{uri: ressource.filePreview}} style={categoriesScreenStyles.content.ressourceCard.image} blurRadius={6} />
                    <View key={index} style={categoriesScreenStyles.content.ressourceCard.content}>
                      <Text style={categoriesScreenStyles.content.ressourceCard.content.title}>{ressource.name}</Text>
                      <Text style={categoriesScreenStyles.content.ressourceCard.content.description}>{ressource.description}</Text>
                      <View style={{marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10}}>
                        <DSOValues title={"Niveau"} value={getRessourceLevel(ressource).element} />
                        <DSOValues title={"Tags"} value={getRessourcesTags(ressource)} />
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })

            }
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

export default CategoryScreen;