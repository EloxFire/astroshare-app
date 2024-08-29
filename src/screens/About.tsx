import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../styles/global";
import { settingsStyles } from "../styles/screens/settings";
import { aboutStyles } from "../styles/screens/about";
import * as Linking from 'expo-linking';
import PageTitle from "../components/commons/PageTitle";
import dayjs from "dayjs";
import { app_colors } from "../helpers/constants";
import { i18n } from "../helpers/scripts/i18n";

export default function About({ navigation }: any) {
  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('settings.buttons.about.title')}
        subtitle={i18n.t('settings.buttons.about.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={settingsStyles.content}>
          <Text style={aboutStyles.title}>{i18n.t('about.app.title')}</Text>
          <View style={aboutStyles.row}>
            <Text style={[aboutStyles.text, { marginRight: 10 }]}>{i18n.t('about.app.version')}</Text>
            <Text style={aboutStyles.chip}>{process.env.EXPO_PUBLIC_APP_VERSION}</Text>
          </View>
          <View style={aboutStyles.row}>
            <Text style={[aboutStyles.text, { marginRight: 10 }]}>{i18n.t('about.app.lastUpdate')}</Text>
            <Text style={aboutStyles.chip}>{dayjs(process.env.EXPO_PUBLIC_LAST_UPDATE).format('DD MMMM YYYY')}</Text>
          </View>

          <Text style={[aboutStyles.title, { marginTop: 30 }]}>{i18n.t('about.contact.title')}</Text>
          <Text style={[aboutStyles.text, { marginBottom: 10 }]}>{i18n.t('about.contact.description')}</Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:contact@enzoavagliano.fr')}>
            <Text style={[aboutStyles.text, { marginBottom: 10, textDecorationLine: "underline" }]}>contact@enzoavagliano.fr</Text>
          </TouchableOpacity>

          <Text style={[aboutStyles.title, { marginTop: 30 }]}>{i18n.t('about.legal.title')}</Text>
          <Text style={[aboutStyles.text, { marginBottom: 10 }]}>{i18n.t('about.legal.editor')}</Text>
          <Text style={[aboutStyles.text, { marginBottom: 10 }]}>{i18n.t('about.legal.address')}</Text>
          <Text style={[aboutStyles.text, { marginBottom: 10 }]}>{i18n.t('about.legal.phone')}</Text>
          <Text style={[aboutStyles.text, { marginBottom: 10 }]}>{i18n.t('about.legal.siret')}</Text>

          <Text style={[aboutStyles.title, { marginTop: 30 }]}>{i18n.t('about.privacy.title')}</Text>
          <Text style={[aboutStyles.text, { marginBottom: 10 }]}>{i18n.t('about.privacy.description')}</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.astroshare.fr/application-mobile/politique-de-confidentialite')}>
            <Text style={[aboutStyles.text, { marginBottom: 10, textDecorationLine: "underline" }]}>{i18n.t('about.privacy.linkTitle')}</Text>
          </TouchableOpacity>


          <Text style={[aboutStyles.title, { marginTop: 30 }]}>{i18n.t('about.license.title')}</Text>
          <Text style={aboutStyles.subtitle}>MIT License</Text>
          <Text style={[aboutStyles.text, { marginBottom: 10 }]}>Copyright (©) {dayjs().year()} Enzo Avagliano</Text>
          <Text style={[aboutStyles.text, { marginBottom: 10 }]}>
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
          <Image source={require('../../assets/logos/astroshare_logo_white.png')} resizeMode="contain" style={{ width: '50%', alignSelf: "center" }} />
        </View>
      </ScrollView>
    </View>
  );
}
