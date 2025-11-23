import { useEffect, useMemo, useRef, useState } from "react";
import { useSettings } from "../../contexts/AppSettingsContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics";
import { eventTypes } from "../../helpers/constants/analytics";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../styles/global";
import { i18n } from "../../helpers/scripts/i18n";
import PageTitle from "../../components/commons/PageTitle";
import dayjs, { Dayjs } from "dayjs";
import { clockHomeStyles } from "../../styles/screens/clock/home";
// import SelectDropdown from "react-native-select-dropdown";
import { getLocalSiderealTime } from "@observerly/astrometry";
import { convertDecimalHoursToTime } from "../../helpers/scripts/astro/decimalHourToTime";
import { getData, storeData } from "../../helpers/storage";
// import { timezonesList } from "../../helpers/constants/timezones";

export const ClockHome = ({ navigation }: any) => {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()
  const [now, setNow] = useState<Dayjs>(dayjs());
  // const [customTimezone, setCustomTimezone] = useState<string>(dayjs.tz?.guess() || 'UTC');

  // const timezoneSelectorRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   const loadStoredTimezone = async () => {
  //     const storedTz = await getData('customTimezone');
  //     if(storedTz){
  //       setCustomTimezone(storedTz);
  //     }
  //   }
  //   loadStoredTimezone();
  // }, []);

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Clock Home screen view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])

  const renderClockCard = (title: string, subtitle: string, time: string, meta: string, date: string) => (
    <View style={clockHomeStyles.card}>
      <View style={clockHomeStyles.card.overlay} />
      <View style={clockHomeStyles.card.body}>
        <Text style={clockHomeStyles.card.label}>{title}</Text>
        <Text style={clockHomeStyles.card.time}>{time}</Text>
        <Text style={clockHomeStyles.card.meta}>{meta}</Text>
        <Text style={clockHomeStyles.card.date}>{date}</Text>
      </View>
    </View>
  );

  const local = now;
  const localTime = local.format('HH:mm:ss');
  const localDate = local.format('dddd DD MMM YYYY');
  const localZoneLabel = useMemo(() => {
    try {
      const parts = Intl.DateTimeFormat(undefined, { timeZoneName: 'short' }).formatToParts(new Date());
      return parts.find((part) => part.type === 'timeZoneName')?.value ?? local.format('z');
    } catch (error) {
      return local.format('z') || 'Local';
    }
  }, [local]);

  const utc = now.utc();
  const utcTime = utc.format('HH:mm:ss');
  const utcDate = utc.format('dddd DD MMM YYYY');

  const lst = currentUserLocation?.lon !== undefined ? getLocalSiderealTime(now.toDate(), currentUserLocation.lon) : undefined;
  const lstTime = lst !== undefined ? convertDecimalHoursToTime(lst) : '--:--:--';
  const longitudeLabel = currentUserLocation?.lon !== undefined ? `${currentUserLocation.lon.toFixed(2)}°` : i18n.t('common.unknown');

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.clock.title')}
        subtitle={i18n.t('home.buttons.clock.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView contentContainerStyle={clockHomeStyles.content}>
        <Text style={[clockHomeStyles.card.meta, {opacity: 0.9}]}>{i18n.t('intro')}</Text>

        {renderClockCard(
          "Heure locale",
          "Fuseau déterminé automatiquement",
          localTime,
          localZoneLabel,
          localDate
        )}

        {renderClockCard(
          "Heure UTC",
          "Fuseau horaire fixe",
          utcTime,
          'UTC',
          utcDate
        )}

        {/* <View style={clockHomeStyles.card}>
          <View style={clockHomeStyles.card.overlay} />
          <View style={clockHomeStyles.card.body}>
            <View style={clockHomeStyles.card.section}>
              <Text style={clockHomeStyles.card.label}>Fuseau personnalisé</Text>
              <Text style={clockHomeStyles.card.time}>{customTime}</Text>
              <Text style={clockHomeStyles.card.meta}>{customTimezone}</Text>
              <Text style={clockHomeStyles.card.date}>{customDate}</Text>
            </View>
            <View style={clockHomeStyles.separator} />
            <View style={[clockHomeStyles.card.section, {gap: 10}]}>
              <Text style={clockHomeStyles.pickerLabel}>Sélectionnez un fuseau</Text>
              <SelectDropdown
                ref={timezoneSelectorRef}
                data={timezoneNames}
                defaultValue={customTimezone}
                onSelect={(selectedTimezone) => {
                  setCustomTimezone(selectedTimezone);
                  sendAnalyticsEvent(currentUser, currentUserLocation, 'Selected timezone', eventTypes.BUTTON_CLICK, {timezone: selectedTimezone}, currentLocale);
                }}
                renderButton={(selectedTimezone, isOpened: boolean) => {
                  if(selectedTimezone) {
                    return (
                      <View style={[clockHomeStyles.dropdown, clockHomeStyles.dropdown.withIcon, {borderBottomLeftRadius: isOpened ? 0 : 10, borderBottomRightRadius: isOpened ? 0 : 10}]}>
                        <Text style={clockHomeStyles.dropdown.text}>{selectedTimezone}</Text>
                      </View>
                    )
                  }else {
                    return (
                      <View style={[clockHomeStyles.dropdown, {borderBottomLeftRadius: isOpened ? 0 : 10, borderBottomRightRadius: isOpened ? 0 : 10}]}>
                        <Text style={clockHomeStyles.dropdown.text}>Planète 1</Text>
                      </View>
                    )
                  }
                }}
                renderItem={(item, index: number, isSelected: boolean) => {
                  return (
                    <TouchableOpacity style={[clockHomeStyles.dropdown.list.item, {backgroundColor: isSelected ? app_colors.white_twenty : app_colors.white_no_opacity, borderBottomWidth: index === timezoneNames.length - 1 ? 0 : 1}]}>
                      <Text style={clockHomeStyles.dropdown.list.item.value}>{item}</Text>
                    </TouchableOpacity>
                  )
                }}
                dropdownStyle={clockHomeStyles.dropdown.list}
              />
            </View>
          </View>
        </View> */}

        <View style={clockHomeStyles.card}>
          <View style={clockHomeStyles.card.overlay} />
          <View style={clockHomeStyles.card.body}>
            <Text style={clockHomeStyles.card.label}>Temps sidéral local</Text>
            <Text style={clockHomeStyles.card.time}>{lstTime}</Text>
            <Text style={clockHomeStyles.card.meta}>LST</Text>
            <Text style={clockHomeStyles.card.date}>{now.format('dddd DD MMM YYYY')}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
