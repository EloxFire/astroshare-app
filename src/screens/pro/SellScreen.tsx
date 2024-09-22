import React, { useEffect, useState } from 'react'
import { Platform, ScrollView, Text, View } from 'react-native'
import { i18n } from '../../helpers/scripts/i18n'
import { globalStyles } from '../../styles/global'
import { sellScreenStyles } from '../../styles/screens/pro/sellScreen'
import { useTranslation } from '../../hooks/useTranslation'
import PageTitle from '../../components/commons/PageTitle'
import Purchases, { PurchasesOffering } from 'react-native-purchases';

export default function SellScreen({ navigation }: any) {

  const { currentLocale } = useTranslation();
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);


  useEffect(() => {
    const setup = async () => {
      const offerings = await Purchases.configure({ apiKey: "goog_xItcRBDSytVPVcnwcPZPLkqmfYg" });

      const offerings = await Purchases.getOfferings();
      setCurrentOffering(offerings.current);
    };

    setup().catch(console.log);
  }, []);

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('pro.sellScreen.title')}
        subtitle={i18n.t('pro.sellScreen.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={sellScreenStyles.imageContainer}>
          {
            currentOffering &&
            <View>
              <Text>Current Offering: {currentOffering.identifier}</Text>
              <Text>Package Count: {currentOffering.availablePackages.length}</Text>
              {
                currentOffering.availablePackages.map((pkg) => {
                  return <Text>{pkg.product.identifier}</Text>
                })
              }
            </View>
          }
          {/* <Image source={require(`../../../assets/images/pro/presentation_${currentLocale}.png`)} style={{ width: '100%', height: 300 }} /> */}
        </View>
      </ScrollView>
    </View>
  )
}
