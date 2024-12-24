import React from "react";
import {Dimensions, Image, Text, View, TouchableOpacity} from "react-native";
import { conjunctionCardStyles } from "../../styles/components/cards/conjunctionCard";
import { astroImages } from "../../helpers/scripts/loadImages";
import { Conjunction } from "@observerly/astrometry";
import dayjs from "dayjs";
import DSOValues from "../commons/DSOValues";
import PlanetaryConjunctionMap from "../maps/PlanetaryConjunctionMap";

interface ConjunctionCardProps {
  conjunction: Conjunction;
}

export default function ConjunctionCard({ conjunction }: ConjunctionCardProps) {
  return (
    <View style={conjunctionCardStyles.card}>
      <View style={conjunctionCardStyles.card.header}>
        <Text style={conjunctionCardStyles.card.header.title}>Conjonction</Text>
        <Text style={conjunctionCardStyles.card.header.subtitle}>
          {dayjs(conjunction.datetime).format("DD MMMM YYYY - HH:mm").replace(":", "h")}
        </Text>
      </View>
      <View style={conjunctionCardStyles.card.body}>
        <View style={conjunctionCardStyles.card.body.images}>
          <Image
            source={astroImages[conjunction.targets[0].name.toUpperCase()]}
            style={conjunctionCardStyles.card.body.images.image}
          />
          <Image
            source={astroImages[conjunction.targets[1].name.toUpperCase()]}
            style={conjunctionCardStyles.card.body.images.image}
          />
        </View>
        <Text style={conjunctionCardStyles.card.body.subtitle}>
          {conjunction.targets[0].name} - {conjunction.targets[1].name}
        </Text>
      </View>

      {/* Carte du ciel pour la conjonction */}
      <PlanetaryConjunctionMap
        ra={conjunction.ra}
        dec={conjunction.dec}
        width={Dimensions.get('window').width - 80}
        height={190}
        conjunctionDate={new Date(conjunction.datetime)}
        targetNames={conjunction.targets.map((target) => target.name)}
      />

      <TouchableOpacity style={conjunctionCardStyles.card.body.planetariumRedirect}>
        <Text style={conjunctionCardStyles.card.body.planetariumRedirect.text}>Voir dans le planétarium</Text>
      </TouchableOpacity>

      <DSOValues title={`Magnitude ${conjunction.targets[0].name}`} value={1.8} />
      <DSOValues title={`Magnitude ${conjunction.targets[1].name}`} value={1.8} />
      <DSOValues title={`Séparation angulaire`} value={`${conjunction.angularSeparation.toFixed(2)}°`} />
    </View>
  );
}
