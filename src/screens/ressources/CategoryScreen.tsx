import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
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
import {routes} from "../../helpers/routes";
import ScreenInfo from "../../components/ScreenInfo";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import {truncate} from "../../helpers/scripts/utils/formatters/truncate";

function CategoryScreen({route, navigation}: any) {

  const {ressources} = useRessources();
  const category: Category = route.params.category;

  const [ressourcesList, setRessourcesList] = useState<Ressource[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if(search === ''){
      setRessourcesList(ressources.filter(ressource => ressource.category === category.slug));
    }else{
      setRessourcesList(ressources.filter(ressource => ressource.category === category.slug && (ressource.name.toLowerCase().includes(search.toLowerCase()) || ressource.tags?.includes(search.toLowerCase()))));
    }
  }, [search]);


  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title={category.name} subtitle={category.description.length > 50 ? truncate(category.description, 50) : ""} />
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
              <InputWithIcon type='text' placeholder={i18n.t('ressourcesScreen.categoryScreen.searchPlaceholder')} changeEvent={(e) => setSearch(e)} search={() => {}} icon={require('../../../assets/icons/FiSearch.png')} value={search}/>
            </View>
            {
              ressourcesList.length === 0 ? <SimpleButton disabled text={i18n.t('ressourcesScreen.categoryScreen.noRessources')} /> :
              ressourcesList.map((ressource: Ressource, index: number) => {
                return (
                  <TouchableOpacity key={index} style={categoriesScreenStyles.content.ressourceCard} onPress={() => navigation.navigate(routes.ressource.path, {ressource: ressource})}>
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
            <ScreenInfo image={require('../../../assets/icons/FiInfo.png')} text={i18n.t('ressourcesScreen.ressourcesInfoText')} />
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

export default CategoryScreen;