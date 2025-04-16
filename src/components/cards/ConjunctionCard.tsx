import React from "react";
import {Dimensions, Text, View} from "react-native";
import { conjunctionCardStyles } from "../../styles/components/cards/conjunctionCard";
import { Conjunction } from "@observerly/astrometry";
import dayjs from "dayjs";
import DSOValues from "../commons/DSOValues";
import {convertDegreesRaToHMS} from "../../helpers/scripts/astro/coords/convertDegreesRaToHMS";
import {convertDegreesDecToDMS} from "../../helpers/scripts/astro/coords/convertDegreesDecToDms";
import {i18n} from "../../helpers/scripts/i18n";
import PlanetaryConjunctionMap from "../maps/PlanetaryConjunctionMap";

interface ConjunctionCardProps {
  conjunction: Conjunction;
}

export default function ConjunctionCard({ conjunction }: ConjunctionCardProps) {

  console.log('ConjunctionCard', conjunction);

  return (
    <View style={conjunctionCardStyles.card}>
      <Text style={conjunctionCardStyles.card.title}>{dayjs(conjunction.datetime).format('DD MMMM YYYY à hh:mm z').replace(':', 'h')}</Text>
      <View style={{marginVertical: 10}}>
        <DSOValues title={i18n.t('common.coordinates.angularSeparation')} value={conjunction.angularSeparation.toFixed(2) + "°"} chipValue/>
        <DSOValues title={i18n.t('common.coordinates.rightAscension')} value={`${convertDegreesRaToHMS(conjunction.ra)}`} chipValue/>
        <DSOValues title={i18n.t('common.coordinates.declination')} value={`${convertDegreesDecToDMS(conjunction.dec)}`} chipValue/>
      </View>
      <PlanetaryConjunctionMap ra={conjunction.ra} dec={conjunction.dec} width={Dimensions.get('window').width - 40} height={150} conjunctionDate={conjunction.datetime} targetNames={[conjunction.targets[0].name, conjunction.targets[1].name]}/>
    </View>
  );
}
