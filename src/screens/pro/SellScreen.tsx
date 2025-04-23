import React, {useEffect, useState} from 'react'
import {ScrollView, Text, View, TouchableOpacity, StatusBar, ActivityIndicator} from 'react-native'
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
import {initPaymentSheet, presentPaymentSheet, StripeProvider} from "@stripe/stripe-react-native";
import {app_colors} from "../../helpers/constants";
import {useTranslation} from "../../hooks/useTranslation";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import {proFeaturesList} from "../../helpers/constants/proFeatures";
import {getStripeProducts} from "../../helpers/api/stripe/getProducts";
import {getStripePublishableKey} from "../../helpers/api/stripe/getStripePublishableKey";
import {routes} from "../../helpers/routes";
import {showToast} from "../../helpers/scripts/showToast";
import {createStripeSubscription} from "../../helpers/api/stripe/createStipePayment";
import {finishStripePayment} from "../../helpers/api/stripe/finishStripePayment";

export default function SellScreen({ navigation }: any) {

  const {currentUser, updateCurrentUser} = useAuth()
  const {currentLocale} = useTranslation()

  const [stripeLoading, setStripeLoading] = useState<boolean>(true)
  const [stripeProducts, setStripeProducts] = useState<any>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [stripePublishableKey, setStripePublishableKey] = useState<string>('')

  useEffect(() => {
    (async () => {
      const products = await getStripeProducts()
      const publishableKey: string = await getStripePublishableKey()

      const sortedProducts = products.sort((a: any, b: any) => {
        return a.prices[0].unit_amount - b.prices[0].unit_amount
      })

      // console.log("Stripe products: ", products[1].prices[0].unit_amount)
      setStripePublishableKey(publishableKey)
      setStripeProducts(sortedProducts)
      setSelectedProduct(products[1].prices[0].id)
      setStripeLoading(false)
    })()
  }, []);

  const handlePayment = async () => {
    if (!selectedProduct) return;

    if (!currentUser) {
      showToast({
        message: "Vous devez être connecté pour acheter un abonnement",
        type: "success",
        duration: 3000
      });
      navigation.navigate(routes.auth.login.path);
      return;
    }

    setStripeLoading(true);

    try {
      // 1. Crée la souscription
      const response = await createStripeSubscription(currentUser.uid, selectedProduct);
      const { subscriptionId, clientSecret, ephemeralKey, customerId, publishableKey } = await response.json();

      // 2. Initialise Stripe payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Astroshare",
        customerId,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: {
          name: currentUser.username,
          email: currentUser.email
        },
        style: 'alwaysDark',
        returnURL: 'astroshare://payment',
      });

      if (initError) {
        console.log("[ERROR] initPaymentSheet failed", initError);
        showToast({ message: "Erreur lors de l'initialisation du paiement", type: 'error' });
        setStripeLoading(false);
        return;
      }

      // 3. Affiche la sheet de paiement à l’utilisateur
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        console.log("[ERROR] Payment failed", paymentError);
        showToast({ message: "Le paiement a été annulé", type: 'error' });
        setStripeLoading(false);
        return;
      }

      // 4. Finalise côté Firestore
      const selectedStripeProduct = stripeProducts.find((p: any) =>
        p.prices.some((price: any) => price.id === selectedProduct)
      );

      const subscriptionType = selectedStripeProduct.prices[0].metadata.type;

      await finishStripePayment(
        currentUser.uid,
        selectedProduct,
        selectedStripeProduct.name,
        subscriptionType
      );

      await updateCurrentUser();

      showToast({ message: "Abonnement activé avec succès !", type: "success", duration: 3000 });

      setStripeLoading(false);
      navigation.goBack(); // ou vers une autre page ?
    } catch (error) {
      console.error("Error during payment flow:", error);
      showToast({ message: "Une erreur est survenue", type: "error" });
      setStripeLoading(false);
    }
  };

  return (
    <StripeProvider
      publishableKey={stripePublishableKey}
      merchantIdentifier={"astroshare.fr"}
      urlScheme={"astroshare://"}
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
                stripeLoading && !stripeProducts &&
                <ActivityIndicator size="large" color={app_colors.yellow} style={{marginTop: 20, marginBottom: 50}}/>
              }
              {
                stripeProducts && stripeProducts.map((product: any, index: number) => {
                  return (
                    <ProOfferCard
                      key={index}
                      name={product.name}
                      features={product.prices[0].metadata.features.split('; ')}
                      price={product.prices[0].unit_amount / 100}
                      active={product.prices[0].id === selectedProduct}
                      type={product.prices[0].metadata.type === 'monthly' ? i18n.t('pro.sellScreen.offers.cards.priceMonthly') : i18n.t('pro.sellScreen.offers.cards.priceYearly')}
                      discount={product.prices[0].metadata.discount}
                      onClick={() => setSelectedProduct(product.prices[0].id)}
                    />
                  )
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
            onPress={() => {handlePayment()}}
            disabled={stripeLoading}
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
