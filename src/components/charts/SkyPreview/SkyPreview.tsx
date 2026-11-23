import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Svg, { Circle, Line, Polyline, Rect, Text as SvgText, TSpan } from "react-native-svg";
import type { Constellation } from "@observerly/astrometry";
import { app_colors, withOpacity } from "../../../helpers/variables";
import { formatLocaleNumber } from "../../../helpers/format";
import { listObjects } from "../../../helpers/api/catalog/objects";
import type { CatalogObjectSummary } from "../../../types/catalog/CatalogObject";
import { BACKGROUND_STAR_POSITIONS, skyPreviewStyles } from "./SkyPreview.styles";

interface SkyPreviewProps {
  constellation: Constellation;
  // Position à repérer dans la figure (ex: object.position, ou la position en direct d'une planète).
  target: { ra: number; dec: number; label: string };
  // Centre de la carte (ra/dec, degrés). Absent par défaut : centre alors automatiquement sur la
  // constellation (centre "circulaire" de son tracé + de la cible, voir circularMeanRa) — variante
  // d'origine conservée. Un centre explicite permet d'ancrer la carte ailleurs (ex: un simple aperçu
  // du ciel autour d'un point donné, la figure de la constellation n'étant alors plus forcément
  // cadrée/centrée).
  center?: { ra: number; dec: number };
  // Champ affiché, en degrés (étendue de ciel visible, carrée). Absent par défaut : s'ajuste alors
  // automatiquement à l'étendue du tracé + de la cible (variante d'origine conservée). Un champ
  // explicite fixe le niveau de zoom indépendamment de ce qui est dessiné (la figure peut alors
  // déborder du cadre ou y tenir très petite).
  fieldDegrees?: number;
  // Grille d'ascension droite/déclinaison (lignes + repères). Activée par défaut.
  showGrid?: boolean;
  // Carré fixe si fourni ; sinon mesuré sur la largeur du conteneur (même principe que chartWidth
  // d'AltitudeChart), pour occuper toute la largeur de la carte comme les autres cartes de l'écran.
  size?: number;
}

const PADDING_RATIO = 0.18; // marge autour de la figure, en fraction du côté du carré
// Limite de magnitude des étoiles de fond réelles (voir l'effet de récupération plus bas) : un peu
// au-delà de la limite à l'œil nu (~6), pour un ciel visuellement assez dense sans non plus noyer la
// figure de la constellation sous des points trop nombreux.
const BACKGROUND_STAR_MAX_MAGNITUDE = 7;
const BACKGROUND_STAR_LIMIT = 300; // plafond de sécurité côté requête, voir listObjects

// Libellé de la cible (DMMonoMedium) : taille, interligne, et nombre de lignes max avant ellipse.
const TARGET_LABEL_FONT_SIZE = 11;
const TARGET_LABEL_LINE_HEIGHT = 13;
const TARGET_LABEL_MAX_LINES = 2;
// Ratio largeur/hauteur approximatif d'un caractère DM Mono (police à chasse fixe, chaque caractère
// a la même largeur) : sert à estimer combien de caractères tiennent sur une ligne, faute de vraie
// mesure de texte disponible pour un <SvgText> (contrairement à <Text> RN, un <SvgText> ne retourne
// jamais à la ligne tout seul).
const TARGET_LABEL_CHAR_WIDTH_RATIO = 0.62;

type Point = { x: number; y: number };

// Écart de deux ascensions droites (degrés), ramené dans [-180, 180] : une simple soustraction se
// trompe pour une constellation qui chevauche 0h/24h (ex: Pégase, Poissons) — deux points proches
// dans le ciel mais de part et d'autre de 360°/0° donneraient sinon un écart énorme.
const raDelta = (ra: number, centerRa: number): number => {
  const delta = ra - centerRa;
  return ((delta + 540) % 360) - 180;
};

// Centre "circulaire" d'un ensemble d'ascensions droites (moyenne des vecteurs unitaires plutôt
// qu'une simple moyenne arithmétique) : nécessaire pour la même raison que raDelta (moyenner 359°
// et 1° doit donner 0°, pas 180°).
const circularMeanRa = (raDegrees: number[]): number => {
  const toRad = Math.PI / 180;
  const sinSum = raDegrees.reduce((sum, ra) => sum + Math.sin(ra * toRad), 0);
  const cosSum = raDegrees.reduce((sum, ra) => sum + Math.cos(ra * toRad), 0);
  return ((Math.atan2(sinSum, cosSum) * 180) / Math.PI + 360) % 360;
};

// "5h35" — ascension droite compacte pour un repère de grille (÷15, 360° = 24h), pas le format
// complet "05 h 35 min 12 s" de la fiche technique (ObjectDetailsScreen) : un repère de grille n'a
// pas besoin des secondes.
const formatRaTickLabel = (raDegrees: number): string => {
  const normalizedRa = ((raDegrees % 360) + 360) % 360;
  const totalMinutes = Math.round((normalizedRa / 15) * 60);
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${hours}h${String(minutes).padStart(2, "0")}`;
};

const formatDecTickLabel = (decDegrees: number): string => `${decDegrees >= 0 ? "+" : ""}${Math.round(decDegrees)}°`;

// Pas "ronds" (0.5°, 1°, 2°...) d'une grille RA/Dec, comme buildAltitudeTicks/buildHourTicks
// d'AltitudeChart : le plus fin qui tienne en MAX_GRID_LINES_PER_AXIS lignes sur le champ affiché.
const GRID_STEP_CANDIDATES_DEGREES = [0.5, 1, 2, 5, 10, 15, 20, 30, 45, 60, 90];
const MAX_GRID_LINES_PER_AXIS = 5;
const pickGridStep = (spanDegrees: number): number =>
  GRID_STEP_CANDIDATES_DEGREES.find((step) => spanDegrees / step <= MAX_GRID_LINES_PER_AXIS) ??
  GRID_STEP_CANDIDATES_DEGREES[GRID_STEP_CANDIDATES_DEGREES.length - 1];

// Découpe un libellé en plusieurs lignes (retour à la ligne manuel, voir TARGET_LABEL_CHAR_WIDTH_RATIO
// ci-dessus) : jamais un mot coupé en plein milieu (un mot à lui seul plus long que maxChars reste
// quand même sur sa propre ligne, juste plus large que prévu) ; au-delà de maxLines, la dernière
// ligne est tronquée avec une ellipse plutôt que de continuer à pousser des lignes hors du canevas.
const wrapLabel = (label: string, maxChars: number, maxLines: number): string[] => {
  const words = label.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);

  if (lines.length <= maxLines) return lines;
  const truncated = lines.slice(0, maxLines);
  const last = truncated[maxLines - 1];
  truncated[maxLines - 1] = last.length >= maxChars ? `${last.slice(0, maxChars - 1)}…` : `${last}…`;
  return truncated;
};

/**
 * Aperçu du ciel : trace de la constellation (étoiles reliées par des traits, comme sur une carte du
 * ciel) avec la position d'un objet repérée dedans — voir Constellation.feature d'@observerly/
 * astrometry : un MultiLineString de coordonnées [ra, dec] par segment du dessin, la même donnée que
 * celle utilisée par getConstellation pour la détection (point-in-shape), ici simplement tracée. Le
 * fond du ciel (étoiles hors figure) vient du catalogue (/v3/objects, kind "star") sur la zone
 * visible, pas d'un semis décoratif — voir l'effet de récupération plus bas.
 *
 * Cadrage modulable : `center`/`fieldDegrees` pilotent respectivement le point visé et le niveau de
 * zoom. Absents, ils retombent sur la variante d'origine (centrage + zoom automatiques sur la
 * constellation et la cible) ; fournis, ils permettent un simple aperçu du ciel autour d'un point
 * donné, la figure de la constellation n'étant alors plus forcément cadrée.
 *
 * Projection "petit champ" (équirectangulaire, cos(dec) pour ne pas étirer l'ascension droite à
 * mesure qu'on s'éloigne de l'équateur céleste) : largement suffisante pour l'étendue d'une
 * constellation ou d'un champ de quelques dizaines de degrés, pas une vraie projection de carte du
 * ciel complète. Est/Ouest inversés (x négatif) : le ciel se lit en levant les yeux vers lui, pas en
 * le regardant depuis l'extérieur de la sphère céleste.
 */
const SkyPreview = ({ constellation, target, center: centerProp, fieldDegrees, showGrid = true, size: sizeProp }: SkyPreviewProps) => {
  const { t, i18n } = useTranslation("common");
  const [measuredSize, setMeasuredSize] = useState(0);
  const size = sizeProp ?? measuredSize;

  const data = useMemo(() => {
    if (size === 0) return null;
    const segments: [number, number][][] = [];
    for (const feature of constellation.feature.features) {
      if (feature.geometry.type !== "MultiLineString") continue;
      for (const line of feature.geometry.coordinates) {
        segments.push(line.map(([ra, dec]) => [ra, dec]));
      }
    }
    if (segments.length === 0) return null;

    const vertexByKey = new Map<string, { ra: number; dec: number }>();
    for (const line of segments) {
      for (const [ra, dec] of line) vertexByKey.set(`${ra.toFixed(3)},${dec.toFixed(3)}`, { ra, dec });
    }
    const vertices = Array.from(vertexByKey.values());

    const allPoints = [...vertices, { ra: target.ra, dec: target.dec }];
    // Centre de projection : celui fourni en prop si explicite, sinon le centre "circulaire" du
    // tracé + de la cible (variante d'origine).
    const centerRa = centerProp ? centerProp.ra : circularMeanRa(allPoints.map((p) => p.ra));
    const centerDec = centerProp ? centerProp.dec : allPoints.reduce((sum, p) => sum + p.dec, 0) / allPoints.length;
    const cosCenterDec = Math.cos((centerDec * Math.PI) / 180);

    const projX = (ra: number) => -raDelta(ra, centerRa) * cosCenterDec;
    const projY = (dec: number) => -(dec - centerDec);

    const projected = allPoints.map((p) => ({ x: projX(p.ra), y: projY(p.dec) }));
    const minX = Math.min(...projected.map((p) => p.x));
    const maxX = Math.max(...projected.map((p) => p.x));
    const minY = Math.min(...projected.map((p) => p.y));
    const maxY = Math.max(...projected.map((p) => p.y));

    // Champ affiché : celui fourni en prop (span fixe) si explicite — projX/projY sont déjà des
    // écarts angulaires corrigés (cos(dec)), donc directement comparables à un champ en degrés —
    // sinon ajusté à l'étendue du tracé + de la cible (variante d'origine).
    const spanX = fieldDegrees ?? Math.max(maxX - minX, 0.5); // plancher : évite une division par ~0
    const spanY = fieldDegrees ?? Math.max(maxY - minY, 0.5);
    // Point recentré au milieu du canevas : (0,0) (le centre fourni, déjà à l'origine de la
    // projection) si explicite, sinon le milieu du tracé + de la cible — le centre "circulaire" ne
    // tombe pas forcément exactement au milieu visuel de la figure.
    const midX = centerProp ? 0 : (minX + maxX) / 2;
    const midY = centerProp ? 0 : (minY + maxY) / 2;

    const inner = size * (1 - PADDING_RATIO * 2);
    const scale = Math.min(inner / spanX, inner / spanY);
    const centerPixel = size / 2;

    const toPixel = (ra: number, dec: number): Point => ({
      x: centerPixel + (projX(ra) - midX) * scale,
      y: centerPixel + (projY(dec) - midY) * scale,
    });

    // Étendue visible de TOUT le canevas (pas juste le champ "nominal" ci-dessus, qui exclut la
    // marge) : canevas carré + `scale` unique pour les deux axes (voir toPixel) ⇒ la même valeur
    // s'applique en RA comme en Dec. Sert à la fois à la grille (pour qu'elle couvre toute la carte,
    // pas seulement les alentours du contenu) et à la boîte de requête des étoiles de fond (effet
    // plus bas).
    const visibleHalfSpanDeg = size / 2 / scale;
    const rawVisibleRaHalfSpan = visibleHalfSpanDeg / Math.max(cosCenterDec, 0.05); // plancher : cosCenterDec → 0 près d'un pôle céleste

    // Lignes de grille (RA verticales, Dec horizontales), UN SEUL pas en degrés pour les deux axes
    // (converti en RA "brute" via /cosCenterDec pour la boucle RA, mais la même valeur projetée que
    // le pas Dec) : avec `scale` déjà uniforme, ça garantit des cellules carrées plutôt qu'un pas
    // choisi indépendamment par axe (ex: 10° en Dec, 20° en RA, des cellules alors rectangulaires).
    // La projection garde un cos(dec) FIXE (celui du centre, pas par point), donc une RA constante
    // est exactement verticale et une Dec constante exactement horizontale — cohérent avec le reste
    // de la projection "petit champ", pas une grille de carte du ciel complète (qui, elle, courbe
    // les méridiens).
    const gridStep = pickGridStep(visibleHalfSpanDeg * 2);
    const gridStepRaw = gridStep / Math.max(cosCenterDec, 0.05);

    const decHalfSpan = visibleHalfSpanDeg + gridStep; // marge d'un pas : couvre jusqu'au bord du canevas
    const decGridLines: { y: number; dec: number }[] = [];
    for (let dec = Math.ceil((centerDec - decHalfSpan) / gridStep) * gridStep; dec <= centerDec + decHalfSpan; dec += gridStep) {
      if (dec < -90 || dec > 90) continue;
      decGridLines.push({ y: toPixel(centerRa, dec).y, dec });
    }

    const raHalfSpan = rawVisibleRaHalfSpan + gridStepRaw;
    const raGridLines: { x: number; ra: number }[] = [];
    for (let ra = Math.ceil((centerRa - raHalfSpan) / gridStepRaw) * gridStepRaw; ra <= centerRa + raHalfSpan; ra += gridStepRaw) {
      raGridLines.push({ x: toPixel(ra, centerDec).x, ra });
    }

    // Boîte ra/dec du canevas visible, pour interroger le catalogue d'étoiles réelles (effet plus
    // bas). raMin > raMax signale une boîte qui traverse 0°/360°, géré côté serveur (listObjects).
    const decMin = Math.max(centerDec - visibleHalfSpanDeg, -90);
    const decMax = Math.min(centerDec + visibleHalfSpanDeg, 90);
    const raMin = (((centerRa - rawVisibleRaHalfSpan) % 360) + 360) % 360;
    const raMax = (((centerRa + rawVisibleRaHalfSpan) % 360) + 360) % 360;

    return {
      lines: segments.map((line) => line.map(([ra, dec]) => toPixel(ra, dec))),
      stars: vertices.map((v) => toPixel(v.ra, v.dec)),
      targetPoint: toPixel(target.ra, target.dec),
      toPixel,
      centerRa,
      centerDec,
      fieldDisplayDegrees: Math.max(spanX, spanY),
      raGridLines,
      decGridLines,
      bbox: { raMin, raMax, decMin, decMax },
    };
  }, [constellation, target.ra, target.dec, size, centerProp?.ra, centerProp?.dec, fieldDegrees]);

  const [backgroundStars, setBackgroundStars] = useState<CatalogObjectSummary[]>([]);

  // Vraies étoiles de fond (pas un semis décoratif) : interroge le catalogue sur la boîte ra/dec du
  // canevas visible, plafonné à BACKGROUND_STAR_MAX_MAGNITUDE. Tant qu'aucune réponse n'est arrivée
  // (ou si le cadrage n'est pas encore connu), BACKGROUND_STAR_POSITIONS (semis fixe, voir
  // SkyPreview.styles.ts) sert de repli pour ne pas afficher un carré vide.
  useEffect(() => {
    if (!data) { setBackgroundStars([]); return; }
    let cancelled = false;
    (async () => {
      const result = await listObjects({ kind: "star", bbox: data.bbox, maxMag: BACKGROUND_STAR_MAX_MAGNITUDE, limit: BACKGROUND_STAR_LIMIT });
      if (cancelled) return;
      setBackgroundStars(result?.data ?? []);
    })();
    return () => { cancelled = true; };
  }, [data?.bbox.raMin, data?.bbox.raMax, data?.bbox.decMin, data?.bbox.decMax]);

  // Espacement manuel des lettres (react-native-svg ne garantit pas letterSpacing sur toutes les
  // plateformes) : purement cosmétique, pour un rendu "carte du ciel" façon nom de constellation.
  const spacedName = constellation.name.toUpperCase().split("").join(" ");
  const hasRealBackgroundStars = backgroundStars.length > 0;
  const targetLabelMaxChars = Math.max(6, Math.floor((size * 0.84) / (TARGET_LABEL_FONT_SIZE * TARGET_LABEL_CHAR_WIDTH_RATIO)));
  const targetLabelLines = wrapLabel(target.label, targetLabelMaxChars, TARGET_LABEL_MAX_LINES);

  return (
    <View style={skyPreviewStyles.card}>
      <Text style={skyPreviewStyles.title}>{t("skyPreview.title")}</Text>

      <View
        style={[skyPreviewStyles.chart, sizeProp === undefined && skyPreviewStyles.chart.fill]}
        onLayout={(e) => { if (sizeProp === undefined) setMeasuredSize(e.nativeEvent.layout.width); }}
      >
        {size > 0 && (
          <Svg width={size} height={size}>
            <Rect x={0} y={0} width={size} height={size} rx={12} fill={app_colors.black} />

            {!hasRealBackgroundStars && BACKGROUND_STAR_POSITIONS.map((star, index) => (
              <Circle key={index} cx={star.x * size} cy={star.y * size} r={star.r} fill={app_colors.white} opacity={star.opacity} />
            ))}
            {data && hasRealBackgroundStars && backgroundStars.map((star) => {
              if (!star.position) return null;
              const point = data.toPixel(star.position.ra, star.position.dec);
              const magnitude = star.magnitude ?? BACKGROUND_STAR_MAX_MAGNITUDE;
              return (
                <Circle
                  key={star.id}
                  cx={point.x}
                  cy={point.y}
                  r={Math.max(0.6, 2.6 - magnitude * 0.3)}
                  fill={app_colors.white}
                  opacity={Math.max(0.25, 1 - magnitude * 0.1)}
                />
              );
            })}

            {showGrid && data?.decGridLines.map((line) => (
              <Line key={`dec-${line.dec}`} x1={0} y1={line.y} x2={size} y2={line.y} stroke={withOpacity(app_colors.white, 0.20)} strokeWidth={1} strokeDasharray="2,4" />
            ))}
            {showGrid && data?.raGridLines.map((line) => (
              <Line key={`ra-${line.ra}`} x1={line.x} y1={0} x2={line.x} y2={size} stroke={withOpacity(app_colors.white, 0.20)} strokeWidth={1} strokeDasharray="2,4" />
            ))}
            {showGrid && data?.decGridLines.map((line) => (
              <SvgText key={`dec-label-${line.dec}`} x={4} y={line.y + 3} fontSize={7.5} fontFamily="DMMonoRegular" fill={withOpacity(app_colors.white, 1)} textAnchor="start">
                {formatDecTickLabel(line.dec)}
              </SvgText>
            ))}
            {showGrid && data?.raGridLines.map((line) => (
              <SvgText key={`ra-label-${line.ra}`} x={line.x} y={size - 4} fontSize={7.5} fontFamily="DMMonoRegular" fill={withOpacity(app_colors.white, 1)} textAnchor="middle">
                {formatRaTickLabel(line.ra)}
              </SvgText>
            ))}

            <SvgText x={size / 2} y={size * PADDING_RATIO} fontSize={12} fontFamily="DMMonoMedium" fill={withOpacity(app_colors.white, 0.8)} textAnchor="middle">
              {spacedName}
            </SvgText>

            {data?.lines.map((line, index) => (
              <Polyline
                key={index}
                points={line.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke={withOpacity(app_colors.white, 0.7)}
                strokeWidth={1.2}
              />
            ))}
            {data?.stars.map((star, index) => (
              <Circle key={index} cx={star.x} cy={star.y} r={2.4} fill={app_colors.white} />
            ))}

            {data?.targetPoint && (
              <>
                <Circle cx={data.targetPoint.x} cy={data.targetPoint.y} r={9} fill={app_colors.red.main} opacity={0.25} />
                <Circle cx={data.targetPoint.x} cy={data.targetPoint.y} r={4.5} fill={app_colors.red.main} stroke={app_colors.white} strokeWidth={1.5} />
                <SvgText
                  x={data.targetPoint.x}
                  y={data.targetPoint.y - 12 - (targetLabelLines.length - 1) * TARGET_LABEL_LINE_HEIGHT}
                  fontSize={TARGET_LABEL_FONT_SIZE}
                  fontFamily="DMMonoMedium"
                  fill={app_colors.white}
                  textAnchor="middle"
                >
                  {targetLabelLines.map((line, index) => (
                    <TSpan key={index} x={data.targetPoint.x} dy={index === 0 ? 0 : TARGET_LABEL_LINE_HEIGHT}>
                      {line}
                    </TSpan>
                  ))}
                </SvgText>
              </>
            )}
          </Svg>
        )}
      </View>

      {data && (
        <View style={skyPreviewStyles.footer}>
          <View>
            <Text style={skyPreviewStyles.footer.item.caption}>{t("skyPreview.center")}</Text>
            <Text style={skyPreviewStyles.footer.item.value}>{formatRaTickLabel(data.centerRa)} · {formatDecTickLabel(data.centerDec)}</Text>
          </View>
          <View style={skyPreviewStyles.footer.item.alignEnd}>
            <Text style={skyPreviewStyles.footer.item.caption}>{t("skyPreview.field")}</Text>
            <Text style={skyPreviewStyles.footer.item.value}>{formatLocaleNumber(data.fieldDisplayDegrees, i18n.language, data.fieldDisplayDegrees < 10 ? 1 : 0)}°</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default SkyPreview;
