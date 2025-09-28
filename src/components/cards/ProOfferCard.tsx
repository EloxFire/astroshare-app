import React from 'react'
import {Image, ImageBackground, Text, TouchableOpacity, View} from 'react-native'
import {sellScreenStyles} from "../../styles/screens/pro/sellScreen";
import {app_colors} from "../../helpers/constants";
import {i18n} from "../../helpers/scripts/i18n";
import {formatEuro} from "../../helpers/scripts/utils/formatters/formaters";
import {useTranslation} from "../../hooks/useTranslation";
import {ProPackage} from "../../helpers/types/ProPackage";

interface ProOfferCardProps {
  name: string;
  features: string[];
  price: number;
  type: string;
  active: boolean;
  discount?: string;
  onClick: () => void
}

export default function ProOfferCard({name, features, price, discount, type, active, onClick}: ProOfferCardProps) {

  const { currentLCID } = useTranslation()

  const typesTranslations: any = {
    'monthly': i18n.t('pro.sellScreen.offers.cards.priceMonthly'),
    'yearly': i18n.t('pro.sellScreen.offers.cards.priceYearly')
  }

  return (
    <TouchableOpacity onPress={onClick} style={[sellScreenStyles.content.offers.offerCard, {borderColor: active ? app_colors.yellow : 'transparent'}]}>
      <View>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <View style={[sellScreenStyles.content.offers.offerCard.selected, {backgroundColor: active ? app_colors.yellow : 'transparent'}]}/>
          <Text style={sellScreenStyles.content.offers.offerCard.title}>{name}</Text>
          {
            discount && (
              <Text style={sellScreenStyles.content.offers.offerCard.discount}>{discount}</Text>
            )
          }
        </View>
        {
          active && (
            <View style={{marginTop: 10, opacity: .8, gap: 5}}>
              {
                features.map((feature: string, index: number) => {
                  return (
                    <View key={index} style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 5}}>
                      <Image source={require('../../../assets/icons/FiCheck.png')} style={{width: 15, height: 15}}/>
                      <Text style={{color: app_colors.white, fontSize: 14, fontFamily: 'DMMonoRegular'}}>{feature}</Text>
                    </View>
                  )
                })
              }
            </View>
          )
        }
      </View>
      <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flex: 1}}>
        <Text style={sellScreenStyles.content.offers.offerCard.price}>{formatEuro(price, currentLCID)} {typesTranslations[type]}</Text>

      </View>
    </TouchableOpacity>
  )
}
