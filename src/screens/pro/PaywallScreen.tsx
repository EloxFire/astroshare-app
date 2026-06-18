import React, { useEffect } from "react";
import { View} from "react-native";
import {globalStyles} from "../../styles/global";
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics";
import { eventTypes } from "../../helpers/constants/analytics";
import { useSettings } from "../../contexts/AppSettingsContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";

export default function PaywallScreen({ navigation }: any) {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth();
  const { currentLocale } = useTranslation();

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'paywall_screen_view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])

  return (
    <View style={globalStyles.body}>

    </View>
  );
}
