import React, {useEffect, useState} from 'react';
import {ImageBackground, ScrollView, Text, View} from "react-native";
import {globalStyles} from "../../styles/global";
import PageTitle from "../../components/commons/PageTitle";
import {i18n} from "../../helpers/scripts/i18n";
import {ressourcesScreenStyles} from "../../styles/screens/ressources/ressourcesScreen";
import {useRessources} from "../../contexts/RessourcesContext";
import {Category} from "../../helpers/types/ressources/Category";
import ToolButton from "../../components/commons/buttons/ToolButton";
import {routes} from "../../helpers/routes";
import ScreenInfo from "../../components/ScreenInfo";
import InputWithIcon from "../../components/forms/InputWithIcon";

function RessourcesScreen({navigation}: any) {

  const {categories} = useRessources();

  const [list, setList] = useState<Category[]>(categories);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if(search === ''){
      setList(categories);
    }else{
      setList(categories.filter(category => category.name.toLowerCase().includes(search.toLowerCase())));
    }
  }, [search]);

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title={i18n.t('home.buttons.ressources.title')} subtitle={i18n.t('home.buttons.ressources.subtitle')} />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <InputWithIcon placeholder={"Recherchez une catégorie"} changeEvent={(e) => setSearch(e)} search={() => {}} icon={require('../../../assets/icons/FiSearch.png')} value={search}/>
        <View style={ressourcesScreenStyles.content}>
          {/*<Text style={ressourcesScreenStyles.content.title}>Sélectionnez une catégorie</Text>*/}
          {
            list.length > 0 ?
              list.map((category: Category, index: number) => {
                return (
                  <ToolButton
                    key={index}
                    text={category.name}
                    subtitle={`// ${category.description}`}
                    navigation={navigation}
                    targetScreen={routes.categoryScreen.path}
                    routeParams={{category: category}}
                    image={{uri: category.image}}
                  />
                )
              }) : <Text>{i18n.t('home.buttons.ressources.noRessources')}</Text>
          }
          <ScreenInfo image={require('../../../assets/icons/FiInfo.png')} text={i18n.t('ressourcesScreen.infoText')} />
        </View>
      </ScrollView>
    </View>
  );
}

export default RessourcesScreen;