import React from 'react'
import {Image, Text, TouchableOpacity, View} from 'react-native'
import {conjunctionCardStyles} from "../../styles/components/cards/conjunctionCard";
import {astroImages} from "../../helpers/scripts/loadImages";
import {Conjunction} from "@observerly/astrometry";
import {i18n} from "../../helpers/scripts/i18n";
import dayjs from "dayjs";

interface ConjunctionCardProps {
  conjunction: Conjunction;
}

export default function ConjunctionCard({conjunction}: ConjunctionCardProps) {

  return (
    <TouchableOpacity style={conjunctionCardStyles.card}>
      <View style={conjunctionCardStyles.card.main}>
        <View>
          <Image style={conjunctionCardStyles.card.images} source={astroImages[conjunction.targets[0].name.toUpperCase()]} />
        </View>
        <View style={conjunctionCardStyles.card.main.middle}>
          <Text style={conjunctionCardStyles.card.main.middle.title}>Conjonction</Text>
          <Text style={conjunctionCardStyles.card.main.middle.subtitle}>{i18n.t(`common.planets.${conjunction.targets[0].name}`)} - {i18n.t(`common.planets.${conjunction.targets[1].name}`)}</Text>
        </View>
        <View>
          <Image style={conjunctionCardStyles.card.images} source={astroImages[conjunction.targets[1].name.toUpperCase()]} />
        </View>
      </View>
      <View style={conjunctionCardStyles.card.separator}></View>
      <View style={conjunctionCardStyles.card.infos}>
        <View style={conjunctionCardStyles.card.infos.info}>
          <Image style={conjunctionCardStyles.card.infos.info.icon} source={require('../../../assets/icons/FiCalendar.png')} />
          <Text style={{color: 'white'}}>{dayjs(conjunction.datetime).format('DD MMM YYYY')}</Text>
        </View>

        <View style={conjunctionCardStyles.card.infos.info}>
          <Image style={conjunctionCardStyles.card.infos.info.icon} source={require('../../../assets/icons/FiCalendar.png')} />
          <Text style={{color: 'white'}}>{dayjs(conjunction.datetime).format('HH:mm').replace(':', 'h')}</Text>
        </View>

        <View style={conjunctionCardStyles.card.infos.info}>
          <Image style={conjunctionCardStyles.card.infos.info.icon} source={require('../../../assets/icons/FiAngleRight.png')} />
          <Text style={{color: 'white'}}>{conjunction.angularSeparation.toFixed(2)}°</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
