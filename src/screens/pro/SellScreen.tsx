import React, {useEffect, useState} from 'react'
import {ScrollView, Text, View, TouchableOpacity, ActivityIndicator} from 'react-native'
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
import {PurchasesPackage} from "react-native-purchases";
import {app_colors} from "../../helpers/constants";
import {useTranslation} from "../../hooks/useTranslation";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import {proFeaturesList} from "../../helpers/constants/proFeatures";
import {getOfferings} from "../../helpers/api/revenuecat/getOfferings";
import {purchasePackage} from "../../helpers/api/revenuecat/purchasePackage";
import {restorePurchases} from "../../helpers/api/revenuecat/restorePurchases";
import {routes} from "../../helpers/routes";
import {showToast} from "../../helpers/scripts/showToast";
import {useSettings} from "../../contexts/AppSettingsContext";
import {sendAnalyticsEvent} from "../../helpers/scripts/analytics";
import {eventTypes} from "../../helpers/constants/analytics";
import Constants from 'expo-constants';

const packageTypeLabels: Record<string, 'monthly' | 'yearly' | 'lifetime'> = {
  MONTHLY: 'monthly',
  ANNUAL: 'yearly',
  LIFETIME: 'lifetime',
}

const packageTypeTitleKeys: Record<'monthly' | 'yearly' | 'lifetime', string> = {
  monthly: 'pro.sellScreen.offers.monthly',
  yearly: 'pro.sellScreen.offers.yearly',
  lifetime: 'pro.sellScreen.offers.lifetime',
}

const packageTypeOrder: Record<string, number> = {
  MONTHLY: 0,
  ANNUAL: 1,
  LIFETIME: 2,
}

export default function SellScreen({ navigation }: any) {

  const {currentUser, updateCurrentUser} = useAuth()
  const {currentLocale} = useTranslation()
  const { currentUserLocation } = useSettings()

  const [offeringsLoading, setOfferingsLoading] = useState<boolean>(true)
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false)
  const [restoreLoading, setRestoreLoading] = useState<boolean>(false)
  const [packages, setPackages] = useState<PurchasesPackage[]>([])
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null)

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Sell screen view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, []);

  useEffect(() => {
    (async () => {
      const offeringPackages = await getOfferings()
      const sortedPackages = [...offeringPackages].sort((a, b) => {
        return (packageTypeOrder[a.packageType] ?? 99) - (packageTypeOrder[b.packageType] ?? 99)
      })

      const annualPackage = sortedPackages.find((pack) => pack.packageType === 'ANNUAL')

      setPackages(sortedPackages)
      setSelectedPackage(annualPackage || sortedPackages[0] || null)
      setOfferingsLoading(false)
    })()
  }, []);

  const getAnnualDiscountPercent = () => {
    const monthlyPackage = packages.find((pack) => pack.packageType === 'MONTHLY')
    const annualPackage = packages.find((pack) => pack.packageType === 'ANNUAL')

    if (!monthlyPackage || !annualPackage) return null

    const yearlyPriceIfMonthly = monthlyPackage.product.price * 12
    const discountPercent = Math.round((1 - (annualPackage.product.price / yearlyPriceIfMonthly)) * 100)

    return discountPercent > 0 ? discountPercent : null
  }

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    if (!currentUser) {
      showToast({
        message: "Vous devez être connecté pour acheter un abonnement",
        type: "success",
        duration: 3000
      });
      navigation.navigate(routes.auth.login.path);
      return;
    }

    setPurchaseLoading(true);

    sendAnalyticsEvent(currentUser, currentUserLocation, 'start_payment_process', eventTypes.BUTTON_CLICK, { selectedPackage: selectedPackage.identifier }, currentLocale);

    const result = await purchasePackage(selectedPackage);

    setPurchaseLoading(false);

    if (result.success) {
      await updateCurrentUser();
      showToast({ message: "Abonnement activé avec succès !", type: "success", duration: 3000 });
      sendAnalyticsEvent(currentUser, currentUserLocation, 'payment_successful', eventTypes.PURCHASE, { selectedPackage: selectedPackage.identifier }, currentLocale);
      navigation.goBack();
      return;
    }

    if ('userCancelled' in result && result.userCancelled) {
      showToast({ message: "Achat annulé", type: "error" });
      return;
    }

    showToast({ message: "Une erreur est survenue", type: "error" });
    sendAnalyticsEvent(currentUser, currentUserLocation, 'payment_failed', eventTypes.ERROR, { selectedPackage: selectedPackage.identifier, error: (result as any).error }, currentLocale);
  };

  const handleRestore = async () => {
    setRestoreLoading(true);

    sendAnalyticsEvent(currentUser, currentUserLocation, 'restore_purchases_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale);

    const isPro = await restorePurchases();

    setRestoreLoading(false);

    if (isPro) {
      await updateCurrentUser();
      showToast({ message: "Achats restaurés avec succès !", type: "success", duration: 3000 });
      navigation.goBack();
      return;
    }

    showToast({ message: "Aucun achat actif n'a été trouvé", type: "error" });
  };

  const annualDiscount = getAnnualDiscountPercent()

  return (
    <View style={[globalStyles.body, {paddingTop: 0, paddingHorizontal: 0}]}>
      <ScrollView contentContainerStyle={{paddingHorizontal: 10, paddingTop: Constants.statusBarHeight ? Constants.statusBarHeight + 20 : 20}}>
        <Image style={sellScreenStyles.backgroundImage} source={require('../../../assets/images/tools/resources.png')}/>
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
          <Text style={sellScreenStyles.content.descriptionLead}>{i18n.t('pro.sellScreen.descriptionLead')}</Text>
          <Text style={sellScreenStyles.content.description}>{i18n.t('pro.sellScreen.description')}</Text>
          <View style={sellScreenStyles.content.offers}>
            {
              offeringsLoading && packages.length === 0 &&
              <ActivityIndicator size="large" color={app_colors.yellow} style={{marginTop: 20, marginBottom: 50}}/>
            }
            {
              packages.map((pack: PurchasesPackage, index: number) => {
                const type = packageTypeLabels[pack.packageType] || 'monthly'
                return (
                  <ProOfferCard
                    key={index}
                    name={i18n.t(packageTypeTitleKeys[type])}
                    price={pack.product.priceString}
                    active={pack.identifier === selectedPackage?.identifier}
                    type={type}
                    highlight={type === 'yearly' ? (annualDiscount ? i18n.t('pro.sellScreen.offers.bestValueWithDiscount', {percent: annualDiscount}) : i18n.t('pro.sellScreen.offers.bestValue')) : undefined}
                    onClick={() => setSelectedPackage(pack)}
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
      <View style={{backgroundColor: app_colors.white_no_opacity, paddingVertical: 14, paddingHorizontal: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
        <SimpleButton
          text={currentUser ? i18n.t('pro.sellScreen.toPayment') : i18n.t('pro.sellScreen.toRegister')}
          onPress={() => {handlePurchase()}}
          disabled={offeringsLoading || purchaseLoading || !selectedPackage}
          loading={purchaseLoading}
          backgroundColor={app_colors.white}
          textColor={app_colors.black}
          iconColor={app_colors.black}
          width={'80%'}
          align={'center'}
          textAdditionalStyles={{fontFamily: 'GilroyBlack', fontSize: currentUser ? 20 : 16}}
        />
        <SimpleButton
          text={i18n.t('pro.sellScreen.restorePurchases')}
          onPress={() => {handleRestore()}}
          disabled={restoreLoading}
          loading={restoreLoading}
          backgroundColor={'transparent'}
          textColor={app_colors.white}
          iconColor={app_colors.white}
          width={'80%'}
          align={'center'}
          textAdditionalStyles={{fontFamily: 'GilroyRegular', fontSize: 14}}
          additionalStyles={{marginTop: 5}}
        />
        <Text style={{color: app_colors.white, opacity: 0.5, fontSize: 11, fontFamily: 'GilroyRegular', textAlign: 'center', marginTop: 10}}>
          Un compte est nécessaire pour activer votre abonnement PRO et retrouver vos données et achats sur tous vos appareils.
        </Text>
      </View>
    </View>
  )
}
