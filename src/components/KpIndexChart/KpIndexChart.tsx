import { Text, View } from "react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { kpIndexChartStyles } from "./KpIndexChart.styles";
import { useAppUnits, type FormatDate } from "../../hooks/useAppUnits";
import { app_colors } from "../../helpers/variables";
import type { KpData, KpPoint } from "../../types/spaceWeather/KpIndex";

interface KpIndexChartProps {
  data: KpData | null;
}

const BUCKET_HOURS = 3; // cadence native de l'indice Kp — pas une valeur continue
const WINDOW_PAST_HOURS = 6; // 2 tranches de recul
const WINDOW_FUTURE_HOURS = 9; // la prévision NOAA de ce fournisseur ne démarre qu'à demain 00h : voir
// le commentaire de buildBuckets — la fenêtre glissante est ce qui permet de l'atteindre malgré tout.
const KP_MAX = 9; // échelle officielle de l'indice Kp (0-9) — plafond, jamais dépassé par l'échelle affichée
const Y_TICK_STEPS = [1, 2, 3, 5]; // pas candidats pour l'échelle Y, du plus fin au plus large
const MAX_Y_TICKS = 4;
const STORM_THRESHOLD_KP = 5; // seuil officiel NOAA G1 (tempête géomagnétique mineure)
const CHART_HEIGHT = 90; // doit rester synchronisé avec CHART_HEIGHT dans KpIndexChart.styles.ts

interface Bucket {
  index: number;
  startTime: Date;
  kp: number | null;
  isCurrent: boolean;
  isPast: boolean;
  isForecast: boolean; // futur avec une valeur prévue (par opposition à futur sans donnée)
}

// Fenêtre glissante (maintenant -6h → maintenant +9h, 15h/3h = 5 tranches) plutôt qu'une grille figée
// sur le jour civil (00h→00h) : la prévision NOAA de ce fournisseur démarre toujours au lendemain
// 00h UTC, jamais dans les heures qui suivent "maintenant" — une grille figée sur aujourd'hui ne
// l'aurait donc presque jamais affichée. La fenêtre glissante la couvre dès que `now + 9h` déborde
// sur le lendemain (le cas typique en fin de journée).
//
// Les bornes de tranches s'alignent sur la grille 3h native des données (00h/03h/06h...) en reculant
// heure par heure via dayjs plutôt qu'en millisecondes brutes — même raison que buildHourTicks dans
// AltitudeChart.tsx : un jour de changement d'heure dure 23h ou 25h en réel, et un calcul en ms sur
// l'époque décale alors les tranches d'une heure (vérifié empiriquement sur le 25 octobre, jour du
// changement d'heure d'hiver).
const buildBuckets = (data: KpData | null, now: Date, formatDate: FormatDate): Bucket[] => {
  const windowStart = new Date(now.getTime() - WINDOW_PAST_HOURS * 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + WINDOW_FUTURE_HOURS * 60 * 60 * 1000);

  let cursor = formatDate(windowStart).startOf("hour");
  while (cursor.hour() % BUCKET_HOURS !== 0) cursor = cursor.subtract(1, "hour");

  const points: KpPoint[] = data ? [...data.history, ...data.forecast] : [];
  const buckets: Bucket[] = [];
  let index = 0;

  while (cursor.toDate().getTime() < windowEnd.getTime()) {
    const startTime = cursor.toDate();
    const next = cursor.add(BUCKET_HOURS, "hour");
    const endTime = next.toDate();

    const isCurrent = now >= startTime && now < endTime;
    const isPast = endTime <= now;

    let kp: number | null = null;
    if (isCurrent && data?.current) {
      kp = data.current.kp;
    } else {
      const match = points.find((point) => {
        const pointTime = new Date(point.time_tag).getTime();
        return pointTime >= startTime.getTime() && pointTime < endTime.getTime();
      });
      kp = match?.kp ?? null;
    }

    buckets.push({ index, startTime, kp, isCurrent, isPast, isForecast: !isPast && !isCurrent && kp !== null });
    cursor = next;
    index++;
  }

  return buckets;
};

// Échelle Y dynamique plutôt que fixe 0-9 : l'indice Kp passe l'essentiel de son temps entre 0 et 2-3,
// ce qui écrase toutes les barres (observées comme prévues) en traits de quelques pixels sur une
// échelle fixe jusqu'à 9. On recale donc sur la valeur la plus haute RÉELLEMENT visible (passé +
// actuel + prévision), avec une marge, plafonné à KP_MAX — même esprit que buildAltitudeTicks dans
// AltitudeChart.tsx (choisir le premier pas qui tient en MAX_Y_TICKS graduations).
const buildYAxis = (maxVisibleKp: number): { ticks: number[]; max: number } => {
  const target = Math.max(maxVisibleKp, 0.1) * 1.2; // marge au-dessus de la barre la plus haute
  const step = Y_TICK_STEPS.find((s) => target / s <= MAX_Y_TICKS) ?? Y_TICK_STEPS[Y_TICK_STEPS.length - 1];
  const max = Math.min(Math.max(Math.ceil(target / step) * step, step), KP_MAX);

  const ticks: number[] = [];
  for (let value = 0; value <= max; value += step) ticks.push(value);
  return { ticks, max };
};

// Graphique Kp par tranches de 3h sur la journée en cours : plein pour les tranches déjà observées,
// surligné pour la tranche actuelle, rempli en plus clair pour les prévisions (jusqu'à T+9h), vide
// pour celles sans donnée. Axe Y dynamique (voir buildYAxis) et axe X (heure de chaque tranche) pour
// situer les valeurs. Ligne de repère au seuil de tempête (Kp = 5, G1), masquée si l'échelle du jour
// ne l'atteint pas — pas la peine de réserver de la place pour un seuil hors de portée du graphique.
const KpIndexChart = ({ data }: KpIndexChartProps) => {
  const { t } = useTranslation("tools/spaceWeather");
  const { formatDate } = useAppUnits();

  const buckets = useMemo(() => buildBuckets(data, new Date(), formatDate), [data, formatDate]);

  const maxVisibleKp = buckets.reduce((max, bucket) => Math.max(max, bucket.kp ?? 0), 0);
  const { ticks, max: yMax } = buildYAxis(maxVisibleKp);
  const showStormLine = STORM_THRESHOLD_KP <= yMax;
  const stormLineTop = (1 - STORM_THRESHOLD_KP / yMax) * CHART_HEIGHT;

  return (
    <View style={kpIndexChartStyles.container}>
      <View style={kpIndexChartStyles.chartRow}>
        <View style={kpIndexChartStyles.yAxis}>
          {
            [...ticks].reverse().map((value) => (
              <Text key={value} style={kpIndexChartStyles.yAxis.tick}>{value}</Text>
            ))
          }
        </View>

        <View style={kpIndexChartStyles.barsArea}>
          {
            showStormLine && (
              <>
                <View style={[kpIndexChartStyles.stormLine, { top: stormLineTop }]} />
                <Text style={[kpIndexChartStyles.stormLineLabel, { top: stormLineTop - 10 }]}>G1</Text>
              </>
            )
          }

          <View style={kpIndexChartStyles.bars}>
            {
              buckets.map((bucket) => (
                <View key={bucket.index} style={kpIndexChartStyles.column}>
                  {
                    bucket.kp !== null ? (
                      <View
                        style={[
                          kpIndexChartStyles.bar,
                          bucket.isCurrent
                            ? kpIndexChartStyles.barCurrent
                            : bucket.isForecast
                              ? kpIndexChartStyles.barForecast
                              : kpIndexChartStyles.barPast,
                          { height: Math.max((bucket.kp / yMax) * CHART_HEIGHT, 4) },
                        ]}
                      />
                    ) : (
                      <View style={[kpIndexChartStyles.bar, kpIndexChartStyles.barEmpty]} />
                    )
                  }
                </View>
              ))
            }
          </View>
        </View>
      </View>

      <View style={kpIndexChartStyles.xAxis}>
        {
          buckets.map((bucket) => (
            <View key={bucket.index} style={kpIndexChartStyles.xAxis.column}>
              <Text style={bucket.isCurrent ? kpIndexChartStyles.xAxis.labelCurrent : kpIndexChartStyles.xAxis.label}>
                {formatDate(bucket.startTime).format("HH")}h
              </Text>
            </View>
          ))
        }
      </View>

      <View style={kpIndexChartStyles.legend}>
        <View style={kpIndexChartStyles.legend.item}>
          <View style={[kpIndexChartStyles.legend.item.swatch, { backgroundColor: app_colors.white }]} />
          <Text style={kpIndexChartStyles.legend.item.label}>{t("kpIndex.chart.legend.observed")}</Text>
        </View>
        <View style={kpIndexChartStyles.legend.item}>
          <View style={[kpIndexChartStyles.legend.item.swatch, { backgroundColor: app_colors.yellow.main }]} />
          <Text style={kpIndexChartStyles.legend.item.label}>{t("kpIndex.chart.legend.current")}</Text>
        </View>
        <View style={kpIndexChartStyles.legend.item}>
          <View style={[kpIndexChartStyles.legend.item.swatch, { backgroundColor: app_colors.yellow.main, opacity: 0.4 }]} />
          <Text style={kpIndexChartStyles.legend.item.label}>{t("kpIndex.chart.legend.forecast")}</Text>
        </View>
      </View>
    </View>
  );
};

export default KpIndexChart;
