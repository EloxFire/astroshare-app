import React, {useEffect, useState} from 'react'
import {ScrollView, Text, View, TouchableOpacity, StatusBar} from 'react-native'
import { globalStyles } from '../../styles/global'
import { sellScreenStyles } from '../../styles/screens/pro/sellScreen'
import {pageTitleStyles} from "../../styles/components/commons/pageTitle";
import {Image} from "expo-image";
import {LinearGradient} from "expo-linear-gradient";
import ProFeatureCard from "../../components/cards/ProFeatureCard";
import {ProFeature} from "../../helpers/types/ProFeature";
import ProBadge from "../../components/badges/ProBadge";
import ProOfferCard from "../../components/cards/ProOfferCard";
import {i18n} from "../../helpers/scripts/i18n";
import {useAuth} from "../../contexts/AuthContext";
import {routes} from "../../helpers/routes";
import {initPaymentSheet, presentPaymentSheet, StripeProvider} from "@stripe/stripe-react-native";
import axios from "axios";
import {ProPackage} from "../../helpers/types/ProPackage";
import {app_colors} from "../../helpers/constants";
import {useTranslation} from "../../hooks/useTranslation";
import {astroshare_pro_packages} from "../../helpers/constants/proPackages";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import {proFeaturesList} from "../../helpers/constants/proFeatures";

export default function SellScreen({ navigation }: any) {

  const {currentUser} = useAuth()
  const {currentLocale} = useTranslation()

  const [activeOffer, setActiveOffer] = useState<'monthly' | 'yearly'>('yearly')
  const [selectedOffer, setSelectedOffer] = useState<ProPackage | null>(astroshare_pro_packages[currentLocale].find((proPackage: ProPackage) => proPackage.type === activeOffer) || null)
  const [stripePublishableKey, setStripePublishableKey] = useState<string>('')
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false)

  useEffect(() => {
    initStripe()
  }, []);

  const initStripe = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stripe/stripetoken`,
        {
          headers: {
            Authorization: process.env.EXPO_PUBLIC_ADMIN_KEY, // Pass the adminKey in the Authorization header
          },
        }
      );
      console.log("Test", response.data.publishableKey)
      setStripePublishableKey(response.data.publishableKey)
    } catch (e) {
      console.log("Error", e)
    }
  }

  const createPayment = async () => {
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stripe/create-payment-intent`, {
          subscriptionType: selectedOffer?.type,
        },
        {
          headers: {
            Authorization: process.env.EXPO_PUBLIC_ADMIN_KEY, // Pass the adminKey in the Authorization header
          },
        })
      const { paymentIntent, ephemeralKey, customer } = response.data

      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    }catch (e) {
      console.log("[ERROR] Error while creating payement intent", e)
    }
  }

  const handlePayment = async () => {
    if(stripePublishableKey === ''){
      console.log("Stripe publishable key is not set")
      return;
    }

    try {
      const response = await createPayment()

      if(!response){
        console.log("[ERROR] Error creating payment")
        return;
      }

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Astroshare",
        customerId: response.customer,
        customerEphemeralKeySecret: response.ephemeralKey,
        paymentIntentClientSecret: response.paymentIntent,
        allowsDelayedPaymentMethods: false, // SEPA or credit payment
        defaultBillingDetails: {
          name: currentUser.username,
          email: currentUser.email,
        },
        style: 'alwaysDark',
        returnURL: 'astroshare://payment',
      });
      if (!error) {
        setPaymentLoading(true);

        const {error} = await presentPaymentSheet()
        if(error) {
          console.log("[ERROR] Error while trying to present payment sheet to user", error)
        }

        await axios.post(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stripe/updateUser`, {
          userId: currentUser.uid,
          subscriptionType: selectedOffer?.type,
          subscriptionPrice: selectedOffer?.price,
        }, {
          headers: {
            Authorization: process.env.EXPO_PUBLIC_ADMIN_KEY, // Pass the adminKey in the Authorization header
          }
        })
        setPaymentLoading(false);
      }
    }catch (e) {
      console.log("[ERROR] Error in payment process", e)
    }
  }

  return (
    <StripeProvider
      publishableKey={stripePublishableKey}
      merchantIdentifier={"astroshare.fr"}
      urlScheme={"astroshare"}
    >
      <View style={[globalStyles.body, {paddingTop: 0, paddingHorizontal: 0}]}>
        <ScrollView contentContainerStyle={{paddingHorizontal: 10, paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 20}}>
          <Image style={sellScreenStyles.backgroundImage} source={require('../../../assets/images/tools/ressources.png')}/>
          <LinearGradient
            // Background Linear Gradient
            colors={['rgba(0,0,0,1)', 'transparent']}
            style={sellScreenStyles.backgroundImage.bgFilter}
            locations={[0, 1]}
          />

          <View style={pageTitleStyles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image style={pageTitleStyles.container.icon} source={require('../../../assets/icons/FiChevronDown.png')}/>
            </TouchableOpacity>
          </View>
          <View style={sellScreenStyles.content}>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Text style={sellScreenStyles.content.title}>Astroshare</Text>
              <ProBadge additionalStyles={{transform: [{scale: 2.8}], marginLeft: 30}} customColor={app_colors.yellow}/>
            </View>
            <Text style={sellScreenStyles.content.subtitle}>{i18n.t('pro.sellScreen.subtitle')}</Text>
            <Text style={sellScreenStyles.content.description}>{i18n.t('pro.sellScreen.description')}</Text>
            <View style={sellScreenStyles.content.offers}>
              {
                astroshare_pro_packages[currentLocale].map((proPackage: ProPackage, index: number) => {
                  return <ProOfferCard
                    key={index}
                    onClick={() => {
                      setActiveOffer(proPackage.type as 'monthly' | 'yearly');
                      setSelectedOffer(proPackage)
                    }}
                    active={selectedOffer === proPackage}
                    proPackage={proPackage}
                  />
                })
              }
            </View>

            <View style={{borderTopColor: app_colors.white_twenty, borderTopWidth: 1}}>
              <Text style={sellScreenStyles.content.highlightTitle}>Les fonctionnalités en détail</Text>
              <View style={sellScreenStyles.content.highlightFeatures}>
                {
                  proFeaturesList[currentLocale].map((feature: ProFeature, index: number) => {
                    return <ProFeatureCard key={index} feature={feature}/>
                  })
                }
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={{backgroundColor: app_colors.white_no_opacity, height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
          <SimpleButton
            text={i18n.t('pro.sellScreen.toPayment')}
            onPress={() => handlePayment()}
            disabled={paymentLoading}
            backgroundColor={app_colors.white}
            textColor={app_colors.black}
            width={'80%'}
            align={'center'}
            textAdditionalStyles={{fontFamily: 'GilroyBlack', fontSize: 20}}
          />
        </View>
      </View>
    </StripeProvider>
  )
}
