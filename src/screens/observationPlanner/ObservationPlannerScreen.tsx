import React, {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, Platform, ScrollView, Text, TextInput, View} from "react-native";
import {globalStyles} from "../../styles/global";
import PageTitle from "../../components/commons/PageTitle";
import {i18n} from "../../helpers/scripts/i18n";
import {observationPlannerScreenStyles} from "../../styles/screens/observationPlanner/observationPlannerScreen";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import dayjs, {Dayjs} from "dayjs";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import {app_colors, sampleDSO} from "../../helpers/constants";
import ToggleButton from "../../components/commons/buttons/ToggleButton";
import {useTranslation} from "../../hooks/useTranslation";
import {useSettings} from "../../contexts/AppSettingsContext";
import {useSolarSystem} from "../../contexts/SolarSystemContext";
import {useStarCatalog} from "../../contexts/StarsContext";
import {calculateHorizonAngle} from "../../helpers/scripts/astro/calculateHorizonAngle";
import {extractNumbers} from "../../helpers/scripts/extractNumbers";
import {useSpot} from "../../contexts/ObservationSpotContext";
import {convertHMSToDegreeFromString} from "../../helpers/scripts/astro/HmsToDegree";
import {convertDMSToDegreeFromString} from "../../helpers/scripts/astro/DmsToDegree";
import {
  convertEquatorialToHorizontal,
  EquatorialCoordinate,
  GeographicCoordinate
} from "@observerly/astrometry";
import {DSO} from "../../helpers/types/DSO";
import {Star} from "../../helpers/types/Star";
import {GlobalPlanet} from "../../helpers/types/GlobalPlanet";
import {getObjectName} from "../../helpers/scripts/astro/objects/getObjectName";
import {getObjectType} from "../../helpers/scripts/astro/objects/getObjectType";
import {getObjectFamily} from "../../helpers/scripts/astro/objects/getObjectFamily";
import {getPlanetMagnitude} from "../../helpers/scripts/astro/objects/getPlanetMagnitude";
import {observationPlannerComponentsStyles} from "../../styles/components/observationPlanner/planner";
import SimpleBadge from "../../components/badges/SimpleBadge";
import {astroImages} from "../../helpers/scripts/loadImages";
import {getWindDir} from "../../helpers/scripts/getWindDir";
import VisibilityGraph from "../../components/graphs/VisibilityGraph";
import {routes} from "../../helpers/routes";

type PlannerFilters = {
  magnitudeLimit: number;
  minAltitude: number;
  maxSizeArcmin?: number | null;
  includePlanets: boolean;
  includeStars: boolean;
  includeDSO: boolean;
  fovWidth?: number | null; // in degrees
  fovHeight?: number | null; // in degrees
}

type NumericFilterKeys = 'magnitudeLimit' | 'minAltitude' | 'maxSizeArcmin' | 'fovWidth' | 'fovHeight';

type PlannedObject = {
  object: DSO | Star | GlobalPlanet;
  peakAltitude: number;
  peakAzimuth: number;
  peakTime: Dayjs;
  visibilityPercent: number;
  visibilityGraph: { altitudes: number[]; hours: string[] };
  magnitude?: number;
  angularSizeDeg?: number | null;
  fitsInFov?: boolean | null;
}

const fallbackDSO: DSO = sampleDSO;
const curatedDSOList: DSO[] = [
  fallbackDSO,
  {
    name: "M31",
    type: "G",
    ra: "00:42:44.3",
    dec: "41:16:09",
    const: "And",
    maj_ax: 190,
    min_ax: 60,
    pos_ang: "",
    b_mag: 4.4,
    v_mag: 3.4,
    j_mag: "",
    h_mag: "",
    k_mag: "",
    surf_br: "",
    hubble: "",
    pax: "",
    pm_ra: 0,
    pm_dec: 0,
    rad_vel: -300,
    redshift: -0.001001,
    cstar_u_mag: "",
    cstar_b_mag: "",
    cstar_v_mag: "",
    m: 31,
    ngc: 224,
    ic: "",
    cstar_name: "",
    identifiers: "",
    common_names: "Andromeda Galaxy",
    ned_notes: "",
    open_ngc_notes: "",
    sources: "",
    image_url: "",
    distance: 2.5,
    dist_unit: "Mly",
    dimensions: "190 x 60",
    discovered_by: "",
    discovery_year: "",
    apparent_size: "190' x 60'",
    age: ""
  },
  {
    name: "M45",
    type: "OpC",
    ra: "03:47:00",
    dec: "24:07:00",
    const: "Tau",
    maj_ax: 110,
    min_ax: 100,
    pos_ang: "",
    b_mag: 1.6,
    v_mag: 1.6,
    j_mag: "",
    h_mag: "",
    k_mag: "",
    surf_br: "",
    hubble: "",
    pax: "",
    pm_ra: 0,
    pm_dec: 0,
    rad_vel: 0,
    redshift: 0,
    cstar_u_mag: "",
    cstar_b_mag: "",
    cstar_v_mag: "",
    m: 45,
    ngc: 1432,
    ic: "",
    cstar_name: "",
    identifiers: "",
    common_names: "Pleiades",
    ned_notes: "",
    open_ngc_notes: "",
    sources: "",
    image_url: "",
    distance: 0.444,
    dist_unit: "kly",
    dimensions: "110 x 100",
    discovered_by: "",
    discovery_year: "",
    apparent_size: "110'",
    age: ""
  }
];

const fallbackBrightStars: Star[] = [
  { ids: "Betelgeuse", ra: 88.7929, dec: 7.4071, V: 0.42, sp_type: "M2Iab" },
  { ids: "Rigel", ra: 78.6345, dec: -8.2016, V: 0.13, sp_type: "B8Ia" },
  { ids: "Vega", ra: 279.2347, dec: 38.7837, V: 0.03, sp_type: "A0V" },
  { ids: "Capella", ra: 79.1723, dec: 45.9979, V: 0.08, sp_type: "G8III" },
];

function ObservationPlannerScreen({navigation}: any) {
  const { currentLocale } = useTranslation();
  const { currentUserLocation } = useSettings();
  const { selectedSpot, defaultAltitude } = useSpot();
  const { planets } = useSolarSystem();
  const { starsCatalog, starCatalogLoading } = useStarCatalog();

  const [startDate, setStartDate] = useState<Dayjs>(dayjs().minute(0));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs().add(3, 'hour').minute(0));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [filters, setFilters] = useState<PlannerFilters>({
    magnitudeLimit: 8,
    minAltitude: 20,
    maxSizeArcmin: 200,
    includePlanets: true,
    includeStars: true,
    includeDSO: true,
    fovWidth: 1.5,
    fovHeight: 1,
  });
  const [filterInputs, setFilterInputs] = useState<Record<NumericFilterKeys, string>>({
    magnitudeLimit: '8',
    minAltitude: '20',
    maxSizeArcmin: '200',
    fovWidth: '1.5',
    fovHeight: '1',
  });

  const [plannedObjects, setPlannedObjects] = useState<PlannedObject[]>([]);
  const [loadingPlan, setLoadingPlan] = useState<boolean>(false);

  const horizonAngle = useMemo(() => {
    const altitude = selectedSpot ? extractNumbers(selectedSpot.equipments.altitude) : extractNumbers(defaultAltitude);
    return calculateHorizonAngle(altitude || 341);
  }, [selectedSpot, defaultAltitude]);

  const handleDateChange = (type: 'start' | 'end', event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed') {
      type === 'start' ? setShowStartPicker(false) : setShowEndPicker(false);
      return;
    }

    if (!date) return;

    if (type === 'start') {
      const newStart = dayjs(date);
      setStartDate(newStart);
      if (newStart.isAfter(endDate)) {
        setEndDate(newStart.add(2, 'hour'));
      }
      if (Platform.OS === 'android') setShowStartPicker(false);
    } else {
      const newEnd = dayjs(date);
      if (newEnd.isBefore(startDate)) {
        setEndDate(startDate.add(1, 'hour'));
      } else {
        setEndDate(newEnd);
      }
      if (Platform.OS === 'android') setShowEndPicker(false);
    }
  };

  const parseEquatorialCoords = (object: DSO | Star | GlobalPlanet): EquatorialCoordinate | null => {
    const family = getObjectFamily(object);
    if (family === 'DSO') {
      const ra = convertHMSToDegreeFromString(object.ra as string);
      const dec = convertDMSToDegreeFromString(object.dec as string);
      if (!ra || !dec) return null;
      return { ra, dec };
    }
    if (family === 'Star' || family === 'Planet') {
      return { ra: object.ra as number, dec: object.dec as number };
    }
    return null;
  };

  const parseAngularSizeDeg = (object: DSO | Star | GlobalPlanet): number | null => {
    if (getObjectFamily(object) !== 'DSO') return null;
    const rawSize = (object as DSO).apparent_size || (object as DSO).dimensions;
    if (!rawSize || rawSize === "") return null;
    const matches = `${rawSize}`.match(/[\d.,]+/g);
    if (!matches || matches.length === 0) return null;
    const sizeValue = Math.max(...matches.map((value) => parseFloat(value.replace(',', '.'))));
    if (Number.isNaN(sizeValue)) return null;
    if (`${rawSize}`.includes('°')) return sizeValue;
    if (`${rawSize}`.includes('"')) return sizeValue / 3600;
    return sizeValue / 60;
  };

  const getMagnitude = (object: DSO | Star | GlobalPlanet): number | undefined => {
    const family = getObjectFamily(object);
    if (family === 'DSO') {
      const vMag = (object as DSO).v_mag;
      return typeof vMag === 'number' ? vMag : undefined;
    }
    if (family === 'Star') {
      return (object as Star).V;
    }
    if (family === 'Planet') {
      return getPlanetMagnitude((object as GlobalPlanet).name);
    }
    return undefined;
  };

  const buildCandidates = (): (DSO | Star | GlobalPlanet)[] => {
    const candidates: (DSO | Star | GlobalPlanet)[] = [];
    if (filters.includePlanets) {
      const visiblePlanets = planets.filter((planet: GlobalPlanet) => planet.name !== 'Earth');
      candidates.push(...visiblePlanets);
    }
    if (filters.includeDSO) {
      candidates.push(...curatedDSOList);
    }
    if (filters.includeStars) {
      const sourceStars = starsCatalog && starsCatalog.length > 0 ? starsCatalog : fallbackBrightStars;
      const brightStars = sourceStars
        .filter((star: Star) => !filters.magnitudeLimit || star.V <= filters.magnitudeLimit + 1)
        .sort((a: Star, b: Star) => a.V - b.V)
        .slice(0, 35);
      candidates.push(...brightStars);
    }
    return candidates;
  };

  const computeVisibilityProfile = (object: DSO | Star | GlobalPlanet): PlannedObject | null => {
    if (!currentUserLocation) return null;
    const coords = parseEquatorialCoords(object);
    if (!coords) return null;
    const minAltitude = Math.max(filters.minAltitude, horizonAngle);

    const observer: GeographicCoordinate = {
      latitude: currentUserLocation.lat,
      longitude: currentUserLocation.lon,
    };

    const minutesSpan = Math.max(30, endDate.diff(startDate, 'minute'));
    const stepMinutes = minutesSpan <= 120 ? 15 : 30;
    const samples: number = Math.ceil(minutesSpan / stepMinutes);

    const altitudes: number[] = [];
    const hours: string[] = [];
    let bestAltitude = -90;
    let bestAzimuth = 0;
    let bestTime = startDate;
    let visibleCount = 0;

    for (let i = 0; i <= samples; i++) {
      const currentTime = startDate.add(i * stepMinutes, 'minute');
      if (currentTime.isAfter(endDate)) break;
      const horizontal = convertEquatorialToHorizontal(currentTime.toDate(), observer, coords);
      altitudes.push(horizontal.alt);
      hours.push(currentTime.format('HH:mm'));

      if (horizontal.alt > bestAltitude) {
        bestAltitude = horizontal.alt;
        bestAzimuth = horizontal.az;
        bestTime = currentTime;
      }
      if (horizontal.alt >= minAltitude) visibleCount += 1;
    }

    if (altitudes.length === 0) return null;

    const visibilityPercent = Math.round((visibleCount / altitudes.length) * 100);
    if (visibleCount === 0) return null;

    const magnitude = getMagnitude(object);
    if (filters.magnitudeLimit && magnitude !== undefined && magnitude > filters.magnitudeLimit) {
      return null;
    }

    const angularSizeDeg = parseAngularSizeDeg(object);
    if (filters.maxSizeArcmin && angularSizeDeg && angularSizeDeg * 60 > filters.maxSizeArcmin) {
      return null;
    }

    let fitsInFov: boolean | null = null;
    if (filters.fovHeight && filters.fovWidth && angularSizeDeg) {
      const maxAllowed = Math.min(filters.fovHeight, filters.fovWidth);
      fitsInFov = angularSizeDeg <= maxAllowed;
    }

    return {
      object,
      peakAltitude: bestAltitude,
      peakAzimuth: bestAzimuth,
      peakTime: bestTime,
      visibilityPercent,
      visibilityGraph: { altitudes, hours },
      magnitude,
      angularSizeDeg,
      fitsInFov,
    };
  };

  const planObservations = () => {
    setLoadingPlan(true);
    const candidates = buildCandidates();
    const computed = candidates
      .map(computeVisibilityProfile)
      .filter((item): item is PlannedObject => item !== null)
      .sort((a, b) => {
        if (a.peakTime.isSame(b.peakTime)) {
          return b.peakAltitude - a.peakAltitude;
        }
        return a.peakTime.valueOf() - b.peakTime.valueOf();
      });

    setPlannedObjects(computed);
    setLoadingPlan(false);
  };

  useEffect(() => {
    planObservations();
  }, [startDate, endDate, filters, currentUserLocation, planets, starsCatalog, starCatalogLoading]);

  const handleFilterChange = (key: NumericFilterKeys, value: string) => {
    setFilterInputs((prev) => ({ ...prev, [key]: value }));
    if (value === '') {
      if (key === 'maxSizeArcmin' || key === 'fovHeight' || key === 'fovWidth') {
        setFilters((prev) => ({ ...prev, [key]: null } as PlannerFilters));
      }
      return;
    }
    const parsedValue = parseFloat(value.replace(',', '.'));
    if (Number.isNaN(parsedValue)) {
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: parsedValue } as PlannerFilters));
  };

  const resetFilters = () => {
    setFilters({
      magnitudeLimit: 8,
      minAltitude: 20,
      maxSizeArcmin: 200,
      includePlanets: true,
      includeStars: true,
      includeDSO: true,
      fovWidth: 1.5,
      fovHeight: 1,
    });
    setFilterInputs({
      magnitudeLimit: '8',
      minAltitude: '20',
      maxSizeArcmin: '200',
      fovWidth: '1.5',
      fovHeight: '1',
    });
  };

  const renderInput = (label: string, value: string, key: NumericFilterKeys, placeholder?: string) => (
    <View style={observationPlannerComponentsStyles.inputGroup}>
      <Text style={observationPlannerComponentsStyles.inputGroup.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={app_colors.white_sixty}
        style={observationPlannerComponentsStyles.inputGroup.input}
        value={value}
        keyboardType="decimal-pad"
        onChangeText={(text) => handleFilterChange(key, text)}
      />
    </View>
  );

  const renderPlannedCard = (item: PlannedObject, index: number) => {
    const objectName = getObjectName(item.object as any, 'all', true);
    const typeLabel = getObjectType(item.object as any);

    return (
      <View key={`${objectName}-${index}`} style={observationPlannerComponentsStyles.card}>
        <View style={observationPlannerComponentsStyles.card.header}>
          <View>
            <Text style={observationPlannerComponentsStyles.card.title}>{objectName}</Text>
            <Text style={observationPlannerComponentsStyles.card.subtitle}>{typeLabel}</Text>
          </View>
          <SimpleBadge
            text={`${i18n.t('observationPlanner.results.order')} #${index + 1}`}
            icon={astroImages['CONSTELLATION']}
            backgroundColor={app_colors.white_no_opacity}
            foregroundColor={app_colors.white}
            noBorder
            small
          />
        </View>
        <View style={observationPlannerComponentsStyles.card.badges}>
          <SimpleBadge
            text={`${i18n.t('observationPlanner.results.altitude')} ${item.peakAltitude.toFixed(1)}°`}
            icon={require('../../../assets/icons/FiTrendingUp.png')}
            backgroundColor={app_colors.green_eighty}
            foregroundColor={app_colors.white}
            small
          />
          <SimpleBadge
            text={`${i18n.t('observationPlanner.results.bestAt')} ${item.peakTime.locale(currentLocale).format('HH:mm')}`}
            icon={require('../../../assets/icons/FiClock.png')}
            backgroundColor={app_colors.white_no_opacity}
            foregroundColor={app_colors.white}
            small
          />
          <SimpleBadge
            text={`${i18n.t('observationPlanner.results.visibility', { percent: item.visibilityPercent })}`}
            icon={require('../../../assets/icons/FiEye.png')}
            backgroundColor={app_colors.white_no_opacity}
            foregroundColor={app_colors.white}
            small
          />
          <SimpleBadge
            text={`${getWindDir(item.peakAzimuth)} • ${Math.round(item.peakAzimuth)}°`}
            icon={require('../../../assets/icons/FiCompass.png')}
            backgroundColor={app_colors.white_no_opacity}
            foregroundColor={app_colors.white}
            small
          />
        </View>
        <View style={observationPlannerComponentsStyles.card.badges}>
          {item.magnitude !== undefined && (
            <SimpleBadge
              text={`${i18n.t('observationPlanner.results.magnitude')} ${item.magnitude.toFixed(1)}`}
              icon={require('../../../assets/icons/FiStar.png')}
              backgroundColor={app_colors.white_no_opacity}
              foregroundColor={app_colors.white}
              small
            />
          )}
          {item.angularSizeDeg && (
            <SimpleBadge
              text={`${i18n.t('observationPlanner.results.size')} ${(item.angularSizeDeg * 60).toFixed(0)}'`}
              icon={require('../../../assets/icons/FiRuler.png')}
              backgroundColor={app_colors.white_no_opacity}
              foregroundColor={app_colors.white}
              small
            />
          )}
          {item.fitsInFov !== null && (
            <SimpleBadge
              text={item.fitsInFov ? i18n.t('observationPlanner.results.fov.ok') : i18n.t('observationPlanner.results.fov.ko')}
              icon={require('../../../assets/icons/FiViewPoint.png')}
              backgroundColor={item.fitsInFov ? app_colors.green_eighty : app_colors.red_eighty}
              foregroundColor={app_colors.white}
              small
            />
          )}
        </View>
        <VisibilityGraph visibilityGraph={item.visibilityGraph} />
        <SimpleButton
          text={i18n.t('observationPlanner.results.details')}
          icon={require('../../../assets/icons/FiChevronRight.png')}
          onPress={() => navigation.push(routes.celestialBodies.details.path, { object: item.object })}
          fullWidth
          align="center"
          backgroundColor={app_colors.white_no_opacity}
        />
      </View>
    );
  };

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.observationPlanner.title')}
        subtitle={i18n.t('home.buttons.observationPlanner.subtitle')}
        backRoute={routes.home.path}
      />
      <View style={globalStyles.screens.separator} />

      {showStartPicker && (
        <DateTimePicker
          value={startDate.toDate()}
          mode="datetime"
          display="default"
          onChange={(event, date) => handleDateChange('start', event, date)}
          accentColor={app_colors.yellow}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate.toDate()}
          mode="datetime"
          display="default"
          onChange={(event, date) => handleDateChange('end', event, date)}
          accentColor={app_colors.yellow}
        />
      )}

      <ScrollView>
        <View style={observationPlannerScreenStyles.content}>
          <View style={globalStyles.globalContainer}>
            <Text style={observationPlannerComponentsStyles.sectionTitle}>{i18n.t('observationPlanner.window.title')}</Text>
            <Text style={observationPlannerComponentsStyles.sectionSubtitle}>{i18n.t('observationPlanner.window.subtitle')}</Text>
            <View style={observationPlannerComponentsStyles.row}>
              <SimpleButton
                icon={require('../../../assets/icons/FiCalendar.png')}
                text={`${i18n.t('observationPlanner.window.start')} • ${startDate.format('DD MMM HH:mm')}`}
                onPress={() => setShowStartPicker(true)}
                fullWidth
                align="flex-start"
                backgroundColor={app_colors.white_no_opacity}
              />
              <SimpleButton
                icon={require('../../../assets/icons/FiCalendar.png')}
                text={`${i18n.t('observationPlanner.window.end')} • ${endDate.format('DD MMM HH:mm')}`}
                onPress={() => setShowEndPicker(true)}
                fullWidth
                align="flex-start"
                backgroundColor={app_colors.white_no_opacity}
              />
            </View>
            <SimpleButton
              icon={require('../../../assets/icons/FiRepeat.png')}
              text={i18n.t('observationPlanner.window.resetTonight')}
              onPress={() => {
                const now = dayjs();
                setStartDate(now);
                setEndDate(now.add(3, 'hour'));
              }}
              align="flex-start"
              backgroundColor={app_colors.white_no_opacity}
            />
          </View>

          <View style={globalStyles.globalContainer}>
            <Text style={observationPlannerComponentsStyles.sectionTitle}>{i18n.t('observationPlanner.filters.title')}</Text>
            <Text style={observationPlannerComponentsStyles.sectionSubtitle}>{i18n.t('observationPlanner.filters.subtitle')}</Text>
            <View style={observationPlannerComponentsStyles.row}>
              <ToggleButton
                title={i18n.t('observationPlanner.filters.targets.planets')}
                toggled={filters.includePlanets}
                onToggle={() => setFilters((prev) => ({ ...prev, includePlanets: !prev.includePlanets }))}
              />
              <ToggleButton
                title={i18n.t('observationPlanner.filters.targets.stars')}
                toggled={filters.includeStars}
                onToggle={() => setFilters((prev) => ({ ...prev, includeStars: !prev.includeStars }))}
              />
              <ToggleButton
                title={i18n.t('observationPlanner.filters.targets.dso')}
                toggled={filters.includeDSO}
                onToggle={() => setFilters((prev) => ({ ...prev, includeDSO: !prev.includeDSO }))}
              />
            </View>

            <View style={observationPlannerComponentsStyles.inputsRow}>
              {renderInput(i18n.t('observationPlanner.filters.magnitude'), filterInputs.magnitudeLimit, 'magnitudeLimit')}
              {renderInput(i18n.t('observationPlanner.filters.minAltitude'), filterInputs.minAltitude, 'minAltitude')}
            </View>
            <View style={observationPlannerComponentsStyles.inputsRow}>
              {renderInput(i18n.t('observationPlanner.filters.maxSize'), filterInputs.maxSizeArcmin, 'maxSizeArcmin', "ex: 200")}
              {renderInput(i18n.t('observationPlanner.filters.fov.width'), filterInputs.fovWidth, 'fovWidth')}
              {renderInput(i18n.t('observationPlanner.filters.fov.height'), filterInputs.fovHeight, 'fovHeight')}
            </View>
            <View style={observationPlannerComponentsStyles.row}>
              <SimpleButton
                text={i18n.t('observationPlanner.filters.reset')}
                icon={require('../../../assets/icons/FiTrash.png')}
                onPress={resetFilters}
                backgroundColor={app_colors.white_no_opacity}
                align="flex-start"
              />
              <SimpleButton
                text={i18n.t('observationPlanner.filters.refresh')}
                icon={require('../../../assets/icons/FiFilter.png')}
                onPress={planObservations}
                backgroundColor={app_colors.white_no_opacity}
                align="flex-start"
              />
            </View>
            <Text style={observationPlannerComponentsStyles.helperText}>{i18n.t('observationPlanner.filters.helper')}</Text>
          </View>

          <View style={globalStyles.globalContainer}>
            <Text style={observationPlannerComponentsStyles.sectionTitle}>{i18n.t('observationPlanner.results.title')}</Text>
            <Text style={observationPlannerComponentsStyles.sectionSubtitle}>{i18n.t('observationPlanner.results.subtitle')}</Text>
            {loadingPlan && <ActivityIndicator color={app_colors.white} />}
            {!loadingPlan && plannedObjects.length === 0 && (
              <Text style={observationPlannerComponentsStyles.helperText}>{i18n.t('observationPlanner.results.empty')}</Text>
            )}
            {!loadingPlan && plannedObjects.map(renderPlannedCard)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default ObservationPlannerScreen;
