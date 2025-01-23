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

export default function SellScreen({ navigation }: any) {

  const proPackages: ProPackage[] = [
    {
      title: i18n.t('pro.sellScreen.offers.monthlyTitle'),
      description: i18n.t('pro.sellScreen.offers.monthlyDescription'),
      price: 2.49,
      stripePrice: 249,
      displayType: i18n.t('pro.sellScreen.offers.monthly'),
      type: 'monthly'
    },
    {
      title: i18n.t('pro.sellScreen.offers.yearlyTitle'),
      description: i18n.t('pro.sellScreen.offers.yearlyDescription'),
      price: 23.90,
      stripePrice: 2390,
      displayType: i18n.t('pro.sellScreen.offers.yearly'),
      type: 'yearly'
    },
  ]

  const {currentUser} = useAuth()
  const [activeOffer, setActiveOffer] = useState<'monthly' | 'yearly'>('yearly')
  const [selectedOffer, setSelectedOffer] = useState<ProPackage | null>(proPackages.find(proPackage => proPackage.type === activeOffer) || null)
  const [stripePublishableKey, setStripePublishableKey] = useState<string>('')
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false)

  const hilightFeature: ProFeature[] = [
    {
      name: "Planétarium 3D avancé",
      description: "Simulez le FOV de votre matériel et plus encore avec le planétarium 3D avancé.",
      image: require('../../../assets/images/tools/skymap.png')
    },
    {
      name: "Prédictions passages ISS",
      description: "Calculez les prochains passage de l'ISS au dessus de votre position",
      image: require('../../../assets/images/tools/isstracker.png')
    },
    {
      name: "Météo solaire avancée",
      description: "Analyser notre étoile avec des données encore plus précises et complètes.",
      image: require('../../../assets/images/tools/sun.png')
    },
    {
      name: "Outils de calculs",
      description: "Calculez le FOV, les tailles apparentes, les transits et bien plus avec nos outils de calculs.",
      image: require('../../../assets/images/tools/isstransit.png')
    },
    {
      name: "Lieux d'observation",
      description: "Gérez et ajouter des lieux d'observation. Effectuez des simulations de visibilité à différents endroits.",
      image: require('../../../assets/images/tools/skymap.png')
    },
    {
      name: "Et bien plus !",
      description: "Astroshare est mis à jour régulièrement avec de nouvelles fonctionnalités.",
      image: require('../../../assets/images/tools/skymap.png')
    },
  ]

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
          amount: selectedOffer?.stripePrice,
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
              <ProBadge additionalStyles={{transform: [{scale: 2.8}], marginLeft: 30}}/>
            </View>
            <Text style={sellScreenStyles.content.subtitle}>{i18n.t('pro.sellScreen.subtitle')}</Text>
            <View style={sellScreenStyles.content.offers}>
              {
                proPackages.map((proPackage, index) => {
                  return <ProOfferCard
                    key={index}
                    onClick={() => {
                      setActiveOffer(proPackage.type as 'monthly' | 'yearly');
                      setSelectedOffer(proPackage)
                    }}
                    active={activeOffer === proPackage.type}
                    price={proPackage.price}
                    type={proPackage.displayType}
                    hasDiscount={proPackage.type === 'yearly'}
                    badgeText={proPackage.type === 'yearly' ? i18n.t('pro.sellScreen.offers.discount') : ''}
                    description={proPackage.description}
                  />
                })
              }
            </View>
            {
              currentUser ?
                <TouchableOpacity style={sellScreenStyles.content.offers.button} onPress={() => handlePayment()}>
                  <Text style={sellScreenStyles.content.offers.button.text}>{i18n.t('pro.sellScreen.offers.proceedToPayment')}</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={sellScreenStyles.content.offers.button} onPress={() => navigation.push(routes.auth.login.path)}>
                  <Text style={sellScreenStyles.content.offers.button.text}>{i18n.t('pro.sellScreen.noUser')}</Text>
                </TouchableOpacity>
            }
            <View style={sellScreenStyles.content.features}>
              <Text style={sellScreenStyles.content.features.title}>Des fonctionnalités exclusives :</Text>
              {
                hilightFeature.map((feature, index) => {
                  return <ProFeatureCard key={index} feature={feature}/>
                })
              }
            </View>
          </View>
        </ScrollView>
      </View>
    </StripeProvider>
  )
}
