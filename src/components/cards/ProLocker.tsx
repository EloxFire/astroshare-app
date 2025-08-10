import React from "react";
import {ImageBackground, ImageSourcePropType, Text, TouchableOpacity, View} from "react-native";
import {proLockerStyles} from "../../styles/components/cards/proLocker";
import ProBadge from "../badges/ProBadge";
import {app_colors} from "../../helpers/constants";
import {routes} from "../../helpers/routes";
import {i18n} from "../../helpers/scripts/i18n";
import {sendAnalyticsEvent} from "../../helpers/scripts/analytics";
import {useSettings} from "../../contexts/AppSettingsContext";
import {useAuth} from "../../contexts/AuthContext";
import {useTranslation} from "../../hooks/useTranslation";
import {eventTypes} from "../../helpers/constants/analytics";

interface ProLockerProps {
  navigation: any;
  image: ImageSourcePropType;
  multipleFeatures?: boolean;
  darker?: boolean;
  small?: boolean;
}

export default function ProLocker({ navigation, image, darker, small, multipleFeatures }: ProLockerProps) {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  const handleLockerPress = () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Pro locker pressed', eventTypes.BUTTON_CLICK, {}, currentLocale);
    navigation.push(routes.sellScreen.path);
  }

  return (
    <ImageBackground blurRadius={15} resizeMode={"cover"} source={image} imageStyle={proLockerStyles.locker.image} style={[proLockerStyles.locker, {height: small ? 100 : 200}]}>
      <View style={[proLockerStyles.locker.image.dark, {backgroundColor: darker ? app_colors.black_eighty : app_colors.black_sixty}]} />
      {
        !small ? (
          <>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: small ? 5 : 15}}>
              <Text style={proLockerStyles.locker.title}>Astroshare</Text>
              <ProBadge additionalStyles={{transform: [{scale: 2.1}], marginLeft: 22}} customColor={app_colors.yellow}/>
            </View>
            {
              multipleFeatures ?
                <Text style={proLockerStyles.locker.text}>{i18n.t('cards.proLocker.text.multiple')}</Text>
                :
                <Text style={proLockerStyles.locker.text}>{i18n.t('cards.proLocker.text.single')}</Text>
            }
            <Text style={proLockerStyles.locker.text}>{i18n.t('cards.proLocker.text.upgrade')}</Text>
          </>
        ) :
          (
            <>
              <Text style={[proLockerStyles.locker.text, {marginBottom: 10}]}>{i18n.t('cards.proLocker.text.extra')}</Text>
            </>
          )
      }

      <TouchableOpacity onPress={() => handleLockerPress()} style={[proLockerStyles.locker.button, {marginTop: small ? 0 : 20}]}>
        <Text style={proLockerStyles.locker.button.text}>{i18n.t('cards.proLocker.button.generic')}</Text>
        <ProBadge additionalStyles={{marginLeft: 4, marginRight: 10}} customColor={app_colors.black}/>
      </TouchableOpacity>
    </ImageBackground>
  );
}
