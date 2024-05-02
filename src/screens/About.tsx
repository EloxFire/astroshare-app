import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../styles/global";
import { settingsStyles } from "../styles/screens/settings";
import { aboutStyles } from "../styles/screens/about";
import * as Linking from 'expo-linking';
import PageTitle from "../components/commons/PageTitle";
import dayjs from "dayjs";
import { app_colors } from "../helpers/constants";

export default function About({ navigation }: any) {
  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title="À propos"
        subtitle="// Version, contact, legal"
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={settingsStyles.content}>
          <Text style={aboutStyles.title}>Application</Text>
          <View style={aboutStyles.row}>
            <Text style={[aboutStyles.text, {marginRight: 10}]}>Version :</Text>
            <Text style={aboutStyles.chip}>{process.env.EXPO_PUBLIC_APP_VERSION}</Text>
          </View>
          <View style={aboutStyles.row}>
            <Text style={[aboutStyles.text, {marginRight: 10}]}>Dernière mise à jour :</Text>
            <Text style={aboutStyles.chip}>{dayjs(process.env.EXPO_PUBLIC_LAST_UPDATE).format('DD MMMM YYYY')}</Text>
          </View>

          <Text style={[aboutStyles.title, {marginTop: 30}]}>Contact</Text>
          <Text style={[aboutStyles.text, {marginBottom: 10}]}>Pour tout renseignement, ou afin de reporter un bug, merci de me contacter directement par mail à l'adresse suivante :</Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:contact@enzoavagliano.fr')}>
            <Text style={[aboutStyles.text, {marginBottom: 10, textDecorationLine: "underline"}]}>contact@enzoavagliano.fr</Text>
          </TouchableOpacity>

          <Text style={[aboutStyles.title, {marginTop: 30}]}>Mentions légales</Text>
          <Text style={[aboutStyles.text, { marginBottom: 10 }]}>Éditeur : Enzo Avagliano</Text>
          <Text style={[aboutStyles.text, { marginBottom: 10 }]}>Siège social : 36 rue Mignet, 13100 Aix-en-Provence, France</Text>
          <Text style={[aboutStyles.text, { marginBottom: 10 }]}>Téléphone : 06.69.07.42.59</Text>
          <Text style={[aboutStyles.text, { marginBottom: 10 }]}>SIRET : 89122657300014</Text>

          {/* <Text style={[aboutStyles.title, {marginTop: 30}]}>Conditions d'utilisation</Text>
          <Text style={[aboutStyles.text, {marginBottom: 10}]}>Les CGU sont disponible en téléchargement</Text>
          <TouchableOpacity style={{backgroundColor: app_colors.white_forty, width: '50%', borderRadius: 8}} onPress={() => Linking.openURL('mailto:contact@enzoavagliano.fr')}>
            <Text style={[aboutStyles.text, {textAlign: 'center'}]}>Télécharger le document</Text>
          </TouchableOpacity> */}

          <Text style={[aboutStyles.title, {marginTop: 30}]}>License</Text>
          <Text style={aboutStyles.subtitle}>MIT License</Text>
          <Text style={[aboutStyles.text, {marginBottom: 10}]}>Copyright (©) {dayjs().year()} Enzo Avagliano</Text>
          <Text style={[aboutStyles.text, {marginBottom: 10}]}>
            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:
          </Text>
          <Text style={[aboutStyles.text, { marginBottom: 10 }]}>
            The above copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software.
          </Text>
          <Text style={[aboutStyles.text, { marginBottom: 10, textTransform: 'uppercase' }]}>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </Text>
          <Image source={require('../../assets/logos/astroshare_logo_white.png')} resizeMode="contain" style={{width: '50%', alignSelf: "center"}} />
        </View>
      </ScrollView>
    </View>
  );
}
