import React, { useState } from 'react'
import { FlatList, Keyboard, SafeAreaView, Text, TouchableWithoutFeedback, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { homeStyles } from '../styles/screens/home';
import LocationHeader from '../components/LocationHeader';
import InputWithIcon from '../components/forms/InputWithIcon';
import AppHeader from '../components/commons/AppHeader';
import BigButton from '../components/commons/BigButton';
import { routes } from '../helpers/routes';
import { DSO } from '../helpers/types/DSO';
import SearchResultCard from '../components/SearchResultCard';

export default function Home({ navigation }: any) {

  const [searchString, setSearchString] = useState('')

  const fixtures: DSO[] = [
    {
      name: "NGC1976",
      type: "Cl+N",
      ra: "05:35:16.48",
      dec: "-05:23:22.8",
      const: "Ori",
      maj_ax: 90,
      min_ax: 60,
      pos_ang: "",
      b_mag: 4,
      v_mag: 4,
      j_mag: "",
      h_mag: "",
      k_mag: "",
      surf_br: "",
      hubble: "",
      pax: "",
      pm_ra: 1.67,
      pm_dec: -0.3,
      rad_vel: 28,
      redshift: 0.000093,
      cstar_u_mag: "",
      cstar_b_mag: "",
      cstar_v_mag: "",
      m: 42,
      ngc: "",
      ic: "",
      cstar_name: "",
      identifiers: "LBN 974,MWSC 0582",
      common_names: "Great Orion Nebula,Orion Nebula",
      ned_notes: "",
      open_ngc_notes: "",
      sources: "Type:1|RA:1|Dec:1|Const:99|MajAx:9|MinAx:9|B-Mag:3|V-Mag:10|Pm-RA:2|Pm-Dec:2|RadVel:2|Redshift:2"
    },
    {
      name: "NGC976",
      type: "Cl+N",
      ra: "05:35:16.48",
      dec: "-05:23:22.8",
      const: "Ori",
      maj_ax: 90,
      min_ax: 60,
      pos_ang: "",
      b_mag: 4,
      v_mag: 4,
      j_mag: "",
      h_mag: "",
      k_mag: "",
      surf_br: "",
      hubble: "",
      pax: "",
      pm_ra: 1.67,
      pm_dec: -0.3,
      rad_vel: 28,
      redshift: 0.000093,
      cstar_u_mag: "",
      cstar_b_mag: "",
      cstar_v_mag: "",
      m: 42,
      ngc: "",
      ic: "",
      cstar_name: "",
      identifiers: "LBN 974,MWSC 0582",
      common_names: "Great Orion Nebula,Orion Nebula",
      ned_notes: "",
      open_ngc_notes: "",
      sources: "Type:1|RA:1|Dec:1|Const:99|MajAx:9|MinAx:9|B-Mag:3|V-Mag:10|Pm-RA:2|Pm-Dec:2|RadVel:2|Redshift:2"
    },
    {
      name: "NGC197",
      type: "Cl+N",
      ra: "05:35:16.48",
      dec: "-05:23:22.8",
      const: "Ori",
      maj_ax: 90,
      min_ax: 60,
      pos_ang: "",
      b_mag: 4,
      v_mag: 4,
      j_mag: "",
      h_mag: "",
      k_mag: "",
      surf_br: "",
      hubble: "",
      pax: "",
      pm_ra: 1.67,
      pm_dec: -0.3,
      rad_vel: 28,
      redshift: 0.000093,
      cstar_u_mag: "",
      cstar_b_mag: "",
      cstar_v_mag: "",
      m: 42,
      ngc: "",
      ic: "",
      cstar_name: "",
      identifiers: "LBN 974,MWSC 0582",
      common_names: "Great Orion Nebula,Orion Nebula",
      ned_notes: "",
      open_ngc_notes: "",
      sources: "Type:1|RA:1|Dec:1|Const:99|MajAx:9|MinAx:9|B-Mag:3|V-Mag:10|Pm-RA:2|Pm-Dec:2|RadVel:2|Redshift:2"
    }
  ]

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={globalStyles.body}>
        <AppHeader navigation={navigation} />
        <LocationHeader />
        <InputWithIcon
          placeholder="Rechercher un objet céleste"
          changeEvent={(string: string) => setSearchString(string)}
          icon={require('../../assets/icons/FiSearch.png')}
          search={() => { console.log('Search pressed') }}
          value={searchString}
        />
        {
          fixtures.length > 0 &&
          <View>
            <Text style={globalStyles.sections.title}>Objets trouvés</Text>
            <SafeAreaView style={homeStyles.searchResults}>
              <FlatList
                data={fixtures}
                renderItem={({item}) => <SearchResultCard title={item.name} />}
                keyExtractor={item => item.name}
              />
            </SafeAreaView>
          </View>
        }
        <View style={homeStyles.toolsSuggestions}>
          <Text style={globalStyles.sections.title}>Vos outils</Text>
          <Text style={globalStyles.sections.subtitle}>Votre caisse à outils personnalisée</Text>
          <View style={homeStyles.toolsSuggestions.buttons}>
            <BigButton navigation={navigation} targetScreen={routes.compass} text="Boussole & Niveau" subtitle='// Pour une mise en station précise' icon={require('../../assets/icons/FiCompass.png')} />
            <BigButton navigation={navigation} targetScreen='MoonScreen' text="Phases de la Lune" subtitle='// Calculez les phases de la Lune' icon={require('../../assets/icons/FiMoon.png')} />
            <BigButton navigation={navigation} targetScreen='WeatherScreen' text="Météo en direct" subtitle="// C'est le moment de sortir le téléscope !" icon={require('../../assets/icons/FiSun.png')} />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
