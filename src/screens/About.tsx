import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { globalStyles } from "../styles/global";
import { i18n } from "../helpers/scripts/i18n";
import {localizedWhiteLogo} from "../helpers/scripts/loadImages";
import {useTranslation} from "../hooks/useTranslation";
import dayjs from "dayjs";
import PageTitle from "../components/commons/PageTitle";
import SimpleButton from "../components/commons/buttons/SimpleButton";
import * as Linking from 'expo-linking';
import {aboutStyles} from "../styles/screens/about";

export default function About({ navigation }: any) {

  const { currentLocale } = useTranslation();

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('settings.buttons.about.title')}
        subtitle={i18n.t('settings.buttons.about.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={aboutStyles.content}>
          <View style={aboutStyles.content.card}>
            <View style={aboutStyles.content.card.header}>
              <Image source={require('../../assets/icons/FiInfo.png')} style={aboutStyles.content.card.header.icon} />
              <Text style={aboutStyles.content.card.header.title}>{i18n.t('about.app.title')}</Text>
            </View>
            <View style={aboutStyles.content.card.separator} />
            <Text style={[aboutStyles.content.card.text, {lineHeight: 18}]}>{i18n.t('about.app.description')}</Text>
          </View>

          <View style={aboutStyles.content.card}>
            <View style={aboutStyles.content.card.header}>
              <Image source={require('../../assets/icons/FiFileText.png')} style={aboutStyles.content.card.header.icon} />
              <Text style={aboutStyles.content.card.header.title}>{i18n.t('about.version.title')}</Text>
            </View>
            <View style={aboutStyles.content.card.separator} />
            <Text style={aboutStyles.content.card.text}>{i18n.t('about.version.description', {version: process.env.EXPO_PUBLIC_APP_VERSION})}</Text>
            <Text style={aboutStyles.content.card.text}>{i18n.t('about.version.lastUpdate', {date: dayjs(process.env.EXPO_PUBLIC_LAST_UPDATE).format('DD MMMM YYYY')})}</Text>
          </View>

          <View style={aboutStyles.content.card}>
            <View style={aboutStyles.content.card.header}>
              <Image source={require('../../assets/icons/FiUser.png')} style={aboutStyles.content.card.header.icon} />
              <Text style={aboutStyles.content.card.header.title}>{i18n.t('about.legal.title')}</Text>
            </View>
            <View style={aboutStyles.content.card.separator} />
            <Text style={[aboutStyles.content.card.text, {textAlign: 'left'}]}>{i18n.t('about.legal.editor')}</Text>
            <Text style={[aboutStyles.content.card.text, {textAlign: 'left'}]}>{i18n.t('about.legal.address')}</Text>
            <Text style={[aboutStyles.content.card.text, {textAlign: 'left'}]}>{i18n.t('about.legal.phone')}</Text>
            <Text style={[aboutStyles.content.card.text, {textAlign: 'left'}]}>{i18n.t('about.legal.siret')}</Text>
          </View>
          <SimpleButton fullWidth text={i18n.t('about.contact.title')} icon={require('../../assets/icons/FiMail.png')} onPress={() => Linking.openURL('mailto:contact@enzoavagliano.fr')} />
          <SimpleButton fullWidth text={i18n.t('about.privacy.title')} icon={require('../../assets/icons/FiShield.png')} onPress={() => Linking.openURL('https://www.astroshare.fr/application-mobile/politique-de-confidentialite')} />
          {/*<SimpleButton fullWidth text={i18n.t('about.license.title')} icon={require('../../assets/icons/FiShield.png')} />*/}

          <Image source={localizedWhiteLogo[currentLocale]} resizeMode="contain" style={{ width: '50%', alignSelf: "center" }} />
        </View>
      </ScrollView>
    </View>
  );
}
