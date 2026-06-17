import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { Observatory } from '../../../helpers/types/Observatory';
import { ScrollView, Text, View } from 'react-native';
import ScreenInfo from '../../../components/ScreenInfo';
import SimpleButton from '../../../components/commons/buttons/SimpleButton';
import PageTitle from '../../../components/commons/PageTitle';
import { ObservatoryCard } from '../../../components/cards/observatories/ObservatoryCard';
import { useObservatories } from '../../../contexts/ObservatoriesContext';
import { useSettings } from '../../../contexts/AppSettingsContext';
import { useAuth } from '../../../contexts/AuthContext';
import { app_colors } from '../../../helpers/constants';
import { eventTypes } from '../../../helpers/constants/analytics';
import { routes } from '../../../helpers/routes';
import { sendAnalyticsEvent } from '../../../helpers/scripts/analytics';
import { i18n } from '../../../helpers/scripts/i18n';
import { useTranslation } from '../../../hooks/useTranslation';
import { globalStyles } from '../../../styles/global';
import { profileScreenStyles } from '../../../styles/screens/auth/profile';

export const ObservatoriesScreen = ({ navigation }: any) => {
  const { currentUser } = useAuth();
  const { currentUserLocation } = useSettings();
  const { currentLocale } = useTranslation();
  const { observatories, selectedObservatory, refreshObservatories } = useObservatories();
  const isFocused = useIsFocused();

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'observatories_screen_view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])

  useEffect(() => {
    if (!isFocused || !currentUser?.uid) return;
    refreshObservatories();
  }, [isFocused, currentUser?.uid]);

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('profile.observatories.list.title')}
        subtitle={i18n.t('profile.observatories.list.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={globalStyles.content}>
          <View style={profileScreenStyles.content.section}>
            <Text style={[profileScreenStyles.content.section.title, { marginBottom: 0 }]}>
              {i18n.t('profile.observatories.list.sectionTitle')}
            </Text>

            {observatories.length === 0 && (
              <Text style={profileScreenStyles.content.section.subtitle}>
                {i18n.t('profile.observatories.list.empty')}
              </Text>
            )}

            <View style={{ display: 'flex', gap: 10, marginVertical: 10 }}>
              {(observatories as Observatory[]).map((obs: Observatory, index: number) => (
                <ObservatoryCard
                  key={obs.id ?? index}
                  observatory={obs}
                  isActive={selectedObservatory?.id === obs.id}
                  navigation={navigation}
                />
              ))}
            </View>

            <SimpleButton
              withArrow
              fullWidth
              text={i18n.t('profile.observatories.list.add')}
              onPress={() => { sendAnalyticsEvent(currentUser, currentUserLocation, 'add_observatory_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale); navigation.navigate(routes.auth.profile.observatories.crud.path) }}
              textColor={app_colors.white}
              backgroundColor={app_colors.white_no_opacity}
              iconColor={app_colors.white}
              small
            />
          </View>
        </View>

        <ScreenInfo
          image={require('../../../../assets/icons/FiPinMap.png')}
          text={i18n.t('profile.observatories.list.info')}
        />
      </ScrollView>
    </View>
  );
};
