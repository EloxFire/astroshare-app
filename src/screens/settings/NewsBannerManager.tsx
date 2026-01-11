import React, { useEffect, useState } from "react";
import { globalStyles } from "../../styles/global";
import { i18n } from "../../helpers/scripts/i18n";
import { ScrollView, Text, View } from "react-native";
import PageTitle from "../../components/commons/PageTitle";
import { BannerNews } from "../../helpers/types/utils/BannerNews";
import NewsBar from "../../components/banners/NewsBar";
import { useSettings } from "../../contexts/AppSettingsContext";
import axios from "axios";
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";
import { eventTypes } from "../../helpers/constants/analytics";
import ToolButton from "../../components/commons/buttons/ToolButton";

export default function NewsBannerManager({ navigation }: any) {

  const { homeNewsBannerVisible, handleHomeNewsBanner, currentUserLocation } = useSettings()
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  const [banners, setBanners] = useState<BannerNews[]>([])

  useEffect(() => {
    (async () => {
      const news = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/news`)
      setBanners(news.data.data.filter((banner: BannerNews) => banner.visible === true))
    })()
  }, [])

  useEffect(() => {
    sendAnalyticsEvent(
      currentUser,
      currentUserLocation,
      'News Banner Manager Screen',
      eventTypes.SCREEN_VIEW,
      { bannerNewsVisible: homeNewsBannerVisible },
      currentLocale
    )
  }, [])

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('settings.buttons.newsBannerManager.title')}
        subtitle={i18n.t('settings.buttons.newsBannerManager.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <View style={{marginVertical: 10}}>
        <ToolButton icon={require('../../../assets/icons/FiNewspaper.png')} text={i18n.t('settings.buttons.newsBannerManager.title')} hasCheckbox isChecked={homeNewsBannerVisible} onPress={() => handleHomeNewsBanner()} />
      </View>
      <Text style={[globalStyles.sections.title, {marginBottom: 10}]}>Les dernières actualités</Text>
      <ScrollView>
        <View style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {
            banners.length === 0 &&
            <Text style={{fontSize: 16, color: '#666666', fontStyle: 'italic'}}>{i18n.t('settings.screens.newsBannerManager.noNews')}</Text>
          }
          {
            banners.map((banner, index) => {
              return (
                <NewsBar
                  key={`banner-${index}`}
                  title={banner.title}
                  colors={banner.colors}
                  description={banner.description}
                  icon={banner.icon}
                  type={banner.type}
                  externalLink={banner.externalLink}
                  internalRoute={banner.internalRoute}
                  navigation={navigation}
                  order={banner.order}
                />
              )
            })
          }
          {
            banners.length > 0 &&
            <Text style={{fontSize: 16, color: '#666666', fontStyle: 'italic'}}>{i18n.t('settings.screens.newsBannerManager.endNews')}</Text>
          }
        </View>
      </ScrollView>
    </View>
  );
}
