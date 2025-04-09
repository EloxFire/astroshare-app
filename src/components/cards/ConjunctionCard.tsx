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
      <Text style={conjunctionCardStyles.card.title}>{dayjs(conjunction.datetime).format('DD MMMM YYYY')}</Text>
    </View>
  );
}
