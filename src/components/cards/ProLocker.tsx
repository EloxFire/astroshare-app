import React from "react";
import {ImageBackground, ImageSourcePropType, Text, TouchableOpacity, View} from "react-native";
import {proLockerStyles} from "../../styles/components/cards/proLocker";
import ProBadge from "../badges/ProBadge";
import {app_colors} from "../../helpers/constants";
import {routes} from "../../helpers/routes";

interface ProLockerProps {
  navigation: any;
  image: ImageSourcePropType;
  darker?: boolean;
  small?: boolean;
}

export default function ProLocker({ navigation, image, darker, small }: ProLockerProps) {

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
            <Text style={proLockerStyles.locker.text}>Voici une fonctionnalité Astroshare Pro.</Text>
            <Text style={proLockerStyles.locker.text}>Mettez à niveau votre application pour y accéder !</Text>
          </>
        ) :
          (
            <>
              <Text style={[proLockerStyles.locker.text, {marginBottom: 10}]}>Envie d'explorer le ciel encore plus précisément ?</Text>
            </>
          )
      }

      <TouchableOpacity onPress={() => navigation.push(routes.sellScreen.path)} style={[proLockerStyles.locker.button, {marginTop: small ? 0 : 20}]}>
        <Text style={proLockerStyles.locker.button.text}>Passer à Astroshare</Text>
        <ProBadge additionalStyles={{marginLeft: 4, marginRight: 10}} customColor={app_colors.black}/>
      </TouchableOpacity>
    </ImageBackground>
  );
}
