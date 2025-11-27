import { useEffect, useMemo, useState } from "react";
import { useSettings } from "../../contexts/AppSettingsContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics";
import { eventTypes } from "../../helpers/constants/analytics";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../styles/global";
import { i18n } from "../../helpers/scripts/i18n";
import { clockHomeStyles } from "../../styles/screens/clock/home";
import PageTitle from "../../components/commons/PageTitle";
import dayjs, { Dayjs } from "dayjs";
import { ClockCard } from "../../components/clock/ClockCard";

export const ClockHome = ({ navigation }: any) => {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()
  const [now, setNow] = useState<Dayjs>(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Clock Home screen view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])

  const timezoneLabel = useMemo(() => {
    try {
      const parts = Intl.DateTimeFormat(undefined, { timeZoneName: 'short' }).formatToParts(new Date());
      return parts.find((part) => part.type === 'timeZoneName')?.value ?? dayjs().format('z');
    } catch (error) {
      return dayjs.tz?.guess()?.replace(/_/g, ' ') ?? 'Local';
    }
  }, []);

  const localTitle = i18n.t('clock.home.cards.local.title');
  const utcTitle = i18n.t('clock.home.cards.utc.title');
  const utcSubtitle = i18n.t('clock.home.cards.utc.subtitle');
  const utcTime = useMemo(() => now.utc(), [now]);

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.clock.title')}
        subtitle={i18n.t('home.buttons.clock.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView contentContainerStyle={clockHomeStyles.content}>
        <Text style={[clockHomeStyles.card.meta, {opacity: 0.9}]}>{i18n.t('clock.home.intro')}</Text>

        <ClockCard
          time={now}
          timezone={`${localTitle} • ${timezoneLabel}`}
          showAnalog
        />
        <ClockCard
          time={utcTime}
          timezone={`${utcTitle} • ${utcSubtitle}`}
          showAnalog
        />
      </ScrollView>
    </View>
  );
};
