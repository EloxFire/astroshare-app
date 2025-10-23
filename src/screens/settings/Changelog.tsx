import React, { useEffect, useState } from "react";
import { globalStyles } from "../../styles/global";
import { i18n } from "../../helpers/scripts/i18n";
import { ScrollView, Text, View } from "react-native";
import { changelogStyles } from "../../styles/screens/settings/changelog";
import { NewsLog } from "../../helpers/types/NewsLog";
import PageTitle from "../../components/commons/PageTitle";
import axios from "axios";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import dayjs from "dayjs";
import {app_colors} from "../../helpers/constants";
import { useSettings } from "../../contexts/AppSettingsContext";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuth } from "../../contexts/AuthContext";
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics";
import { eventTypes } from "../../helpers/constants/analytics";

export default function ChangelogScreen({ navigation }: any) {

  const {currentUser} = useAuth()
  const { currentLocale } = useTranslation()
  const { currentUserLocation } = useSettings()

  const [news, setNews] = useState<NewsLog[]>([])

  useEffect(() => {
     (async () => {
        const news = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/changelog/app`)

        const visibleNews = news.data.data.filter((n: NewsLog) => n.visible)
        setNews(visibleNews)
     })()
  }, [])

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'view_changelog_screen', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])


  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('settings.buttons.changelog.title')}
        subtitle={i18n.t('settings.buttons.changelog.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={changelogStyles.content}>
          {
            news.length === 0 ?
            <SimpleButton textColor={app_colors.white} align={'center'} disabled text={i18n.t('changelog.noData')} small />
            :
            news.map((change, index) => {
              return (
                <View key={`change-log-${index}`} style={changelogStyles.content.change}>
                  <View style={changelogStyles.content.change.header}>
                    <View>
                      <Text style={changelogStyles.content.change.header.title}>{change.version}</Text>
                      {change.version_name && <Text style={changelogStyles.content.change.header.subtitle}>{change.version_name}</Text>}
                    </View>
                    <View>
                      <Text style={changelogStyles.content.change.header.date_title}>Publication :</Text>
                      <Text style={changelogStyles.content.change.header.date}>{dayjs(change.date).format('DD MMM YYYY')}</Text>
                    </View>
                  </View>

                  <View style={changelogStyles.content.change.list}>
                    {
                      change.changes.length === 0 ?
                      <Text style={changelogStyles.content.change.list.item}>{i18n.t('changelog.noData')}</Text>
                      :
                      change.changes.map((change, index) => {
                        return <Text key={`change-${index}`} style={changelogStyles.content.change.list.item}>- {change}</Text>
                      })
                    }
                  </View>
                </View>
              )
            })
          }
        </View>
      </ScrollView>
    </View>
  );
}
