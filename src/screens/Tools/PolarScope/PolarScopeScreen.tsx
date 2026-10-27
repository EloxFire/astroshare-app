import { ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { useEffect, useState } from "react";
import { globalStyles } from "../../../helpers/globalStyles";
import { polarScopeScreenStyles } from "./PolarScopeScreen.styles";
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader";
import { useTranslation } from "react-i18next";
import ValueCard from "../../../components/cards/ValueCard/ValueCard";
import { useLocation } from "../../../context/LocationContext";
import { convertDecimalLatitudeToDMS } from "../../../helpers/location/convert";
import dayjs, { Dayjs } from "dayjs";
import { getConstellation, getHourAngle, getLocalSiderealTime } from "@observerly/astrometry";
import PolarScopeReticle from "../../../components/PolarScopeReticle/PolarScopeReticle";
import { app_colors, spacing, withOpacity } from "../../../helpers/variables";
import TabSwitch from "../MoonCalendar/components/TabSwitch/TabSwitch";
import { router } from "expo-router";
import InfoCard from "../../../components/cards/InfoCard/InfoCard";
import { Stars } from "lucide-react-native";

// Ascension droite de Polaris (alpha Ursae Minoris), en degrés. 37.9546° (2h 31m 49s) est la
// valeur catalogue J2000.0 ; 45.27° (valeur reprise de la V2) donne un résultat qui correspond à
// celui de SynScan (référence terrain validée) — on garde donc cette dernière plutôt que la
// valeur J2000 brute.
const POLARIS_RIGHT_ASCENSION_DEGREES = 45.27;

// σ Octantis : étoile de référence pour l'alignement polaire austral (pas d'étoile polaire
// brillante au pôle sud céleste). Coordonnées également quasi-fixes sur l'échelle de temps de
// cette fonctionnalité.
const SIGMA_OCTANTIS_RIGHT_ASCENSION_DEGREES = 317.19; // 21h 08m 47s
const SIGMA_OCTANTIS_DECLINATION_DEGREES = -88.9566;

// Nom de la constellation dérivé d'Observerly (getConstellation) plutôt que codé en dur, pour
// rester cohérent avec son propre référentiel (limites IAU) plutôt qu'une source séparée.
const SOUTH_CONSTELLATION_LABEL = (() => {
  const constellation = getConstellation({ ra: SIGMA_OCTANTIS_RIGHT_ASCENSION_DEGREES, dec: SIGMA_OCTANTIS_DECLINATION_DEGREES });
  return constellation ? `σ ${constellation.abbreviation}` : "";
})();

// Convertit des heures décimales (0–24, ou un angle en heures hors de cette plage) en "HH:MM:SS".
const formatHoursAsClock = (hoursDecimal: number): string => {
  const normalizedHours = ((hoursDecimal % 24) + 24) % 24;
  const totalSeconds = Math.round(normalizedHours * 3600);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => value.toString().padStart(2, "0")).join(":");
};

const PolarScopeScreen = () => {

  const { t } = useTranslation("tools/polarScope");
  const { location } = useLocation();
  const { width } = useWindowDimensions();

  const [date, setDate] = useState<Dayjs>(dayjs());
  const [lst, setLst] = useState<string | null>(null);
  const [polarisHourAngle, setPolarisHourAngle] = useState<string | null>(null);
  const [polarisHourAngleDegrees, setPolarisHourAngleDegrees] = useState<number | null>(null);
  // Angle horaire de σ Octantis (pôle sud céleste) — même principe que Polaris, calculé en
  // parallèle (coût négligeable) pour que le réticule austral soit prêt dès que l'hémisphère sud
  // est détecté.
  const [sigmaOctantisHourAngleDegrees, setSigmaOctantisHourAngleDegrees] = useState<number | null>(null);

  // Hémisphère déduit de la latitude : au nord on s'aligne sur Polaris, au sud sur l'astérisme de
  // σ Octantis (pas d'étoile brillante exactement sur le pôle sud céleste). Sert de valeur par
  // défaut au switch nord/sud ci-dessous, que l'utilisateur peut ensuite basculer manuellement
  // (ex: pour vérifier l'autre hémisphère, ou si la position n'est pas encore connue).
  const detectedHemisphere: "north" | "south" = (location?.latitude ?? 0) >= 0 ? "north" : "south";
  const [selectedHemisphere, setSelectedHemisphere] = useState<"north" | "south" | null>(null);

  useEffect(() => {
    if (location && selectedHemisphere === null) {
      setSelectedHemisphere(detectedHemisphere);
    }
  }, [location]);

  const hemisphere = selectedHemisphere ?? detectedHemisphere;

  useEffect(() => {
    if (!location) return;

    const updateSiderealValues = () => {
      const now = new Date();
      setDate(dayjs(now));

      const localSiderealTimeHours = getLocalSiderealTime(now, location.longitude);
      setLst(formatHoursAsClock(localSiderealTimeHours));

      // getHourAngle renvoie déjà LST - RA normalisé, en degrés — gardé tel quel pour l'affichage
      // en degrés, et reconverti en heures (÷15) pour l'affichage au format HH:MM:SS.
      const hourAngleDegrees = getHourAngle(now, location.longitude, POLARIS_RIGHT_ASCENSION_DEGREES);
      setPolarisHourAngleDegrees(hourAngleDegrees);
      setPolarisHourAngle(formatHoursAsClock(hourAngleDegrees / 15));

      setSigmaOctantisHourAngleDegrees(getHourAngle(now, location.longitude, SIGMA_OCTANTIS_RIGHT_ASCENSION_DEGREES));
    };

    updateSiderealValues();
    const intervalId = setInterval(updateSiderealValues, 1000);
    return () => clearInterval(intervalId);
  }, [location]);

  // Taille du réticule adaptée à la largeur d'écran, plafonnée pour rester raisonnable sur tablette.
  const reticleSize = Math.min(width - spacing.screen.horizontal * 2, 320);
  const referenceStarAngleDegrees = (hemisphere === "south" ? sigmaOctantisHourAngleDegrees : polarisHourAngleDegrees) ?? 0;


  return (
    <View style={[globalStyles.screen, polarScopeScreenStyles.screen]}>
      <ScreenHeader main={false} title={t("screen.title")} noBackground/>

      {/* <ScrollView> */}
        <View style={[globalStyles.content, {paddingBottom: 20}]}>
          <View style={polarScopeScreenStyles.infoHeader}>
            <View style={polarScopeScreenStyles.infoHeader.row}>
              <ValueCard
                small
                title={t('content.header.latitude')}
                value={location ? convertDecimalLatitudeToDMS(location.latitude) : ""}
                containerStyle={{backgroundColor: withOpacity(app_colors.white, 0.08)}}
                titleStyle={{color: app_colors.accent.light}}
                valueStyle={{color: app_colors.accent.light}}
              />
              <ValueCard
                small
                title={t('content.header.localTime')}
                value={date.format("HH:mm:ss")}
                containerStyle={{backgroundColor: withOpacity(app_colors.white, 0.08)}}
                titleStyle={{color: app_colors.accent.light}}
                valueStyle={{color: app_colors.accent.light}}
                />
            </View>
            <View style={polarScopeScreenStyles.infoHeader.row}>
              <ValueCard
                small
                title={t('content.header.LST')}
                value={lst ?? ""}
                containerStyle={{backgroundColor: withOpacity(app_colors.white, 0.08)}}
                titleStyle={{color: app_colors.accent.light}}
                valueStyle={{color: app_colors.accent.light}}
              />
              <ValueCard
                small
                title={t('content.header.hourAngle')}
                value={polarisHourAngleDegrees !== null ? `${polarisHourAngleDegrees.toFixed(2)}°` : ""}
                containerStyle={{backgroundColor: withOpacity(app_colors.white, 0.08)}}
                titleStyle={{color: app_colors.accent.light}}
                valueStyle={{color: app_colors.yellow.light}}
              />
            </View>
          </View>

          {/* <TabSwitch
            tabs={[
              { text: t('content.hemisphere.north') },
              { text: t('content.hemisphere.south') },
            ]}
            activeTab={hemisphere === "north" ? 0 : 1}
            onTabPress={(index) => setSelectedHemisphere(index === 0 ? "north" : "south")}
          /> */}

          <View style={polarScopeScreenStyles.scopeContainer}>
            <PolarScopeReticle
              size={reticleSize}
              hemisphere={hemisphere}
              referenceStarAngleDegrees={referenceStarAngleDegrees}
              southConstellationLabel={SOUTH_CONSTELLATION_LABEL}
            />

            <Text style={polarScopeScreenStyles.scopeContainer.subtitle}>{t('content.scopeContainer.subtitle')}</Text>
            <Text style={polarScopeScreenStyles.scopeContainer.value}>{polarisHourAngle?.slice(0, -3).replace(':', ' h ')}</Text>
            
            <InfoCard
              icon={Stars}
              title={t('content.infoCard.title')}
              description={t('content.infoCard.description')}
              variant="dark-light"
              internalLink="/"
            />
          
          </View>

          <View style={polarScopeScreenStyles.footer}>
            {/* <TouchableOpacity style={polarScopeScreenStyles.footer.button}>
              <Text style={polarScopeScreenStyles.footer.button.text}>{t('content.footer.previous')}</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={[polarScopeScreenStyles.footer.button, polarScopeScreenStyles.footer.button.active]} onPress={() => router.replace("/tools")}>
              <Text style={polarScopeScreenStyles.footer.button.text}>{t('content.footer.done')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      {/* </ScrollView> */}
    </View>
  )
}

export default PolarScopeScreen;