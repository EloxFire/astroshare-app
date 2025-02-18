import React from "react";
import {Dimensions, Image, Text, View, TouchableOpacity} from "react-native";
import { conjunctionCardStyles } from "../../styles/components/cards/conjunctionCard";
import { astroImages } from "../../helpers/scripts/loadImages";
import { Conjunction } from "@observerly/astrometry";
import dayjs from "dayjs";
import DSOValues from "../commons/DSOValues";
import PlanetaryConjunctionMap from "../maps/PlanetaryConjunctionMap";
import {getObjectName} from "../../helpers/scripts/astro/objects/getObjectName";
import {GlobalPlanet} from "../../helpers/types/GlobalPlanet";
import {convertDegreesRaToHMS} from "../../helpers/scripts/astro/coords/convertDegreesRaToHMS";
import {convertDegreesDecToDMS} from "../../helpers/scripts/astro/coords/convertDegreesDecToDms";
import SimpleButton from "../commons/buttons/SimpleButton";
import {app_colors} from "../../helpers/constants";

interface ConjunctionCardProps {
  conjunction: Conjunction;
}

export default function ConjunctionCard({ conjunction }: ConjunctionCardProps) {
  return (
    <View style={conjunctionCardStyles.card}>
      <PlanetaryConjunctionMap
        ra={conjunction.ra}
        dec={conjunction.dec}
        width={(Dimensions.get('window').width - 60) /2}
        height={(Dimensions.get('window').width - 60) /2}
        conjunctionDate={new Date(conjunction.datetime)}
        targetNames={conjunction.targets.map((target) => target.name)}
      />

      <View style={conjunctionCardStyles.card.infos}>
        <Text style={conjunctionCardStyles.card.infos.title}>{dayjs(conjunction.datetime).format("DD MMMM YYYY")}</Text>
        <Text style={conjunctionCardStyles.card.infos.title}>{dayjs(conjunction.datetime).format("HH:mm").replace(':', 'h')}</Text>

        <View style={{marginTop: 10}}>
          <DSOValues small title={"AD"} value={convertDegreesRaToHMS(conjunction.ra)}/>
          <DSOValues small title={"Dec"} value={convertDegreesDecToDMS(conjunction.dec)}/>
          <DSOValues small title={"Sép"} value={`${conjunction.angularSeparation.toFixed(2)}°`}/>

          <View style={{marginTop: 10}}>
            <SimpleButton disabled fullWidth small backgroundColor={app_colors.white} textColor={app_colors.black} text={"Voir dans le planétarium"} onPress={() => {}}/>
          </View>
        </View>
      </View>
    </View>
  );
}
