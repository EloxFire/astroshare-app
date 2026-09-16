import { getLunarAge, LUNAR_SYNODIC_MONTH, type Phase } from "@observerly/astrometry";
import i18next from "../../../i18n";

const DAY_MS = 24 * 60 * 60 * 1000;
const QUARTER_SEARCH_STEP_MS = 6 * 60 * 60 * 1000; // pas de balayage grossier : 6h
const QUARTER_SEARCH_PRECISION_MS = 60 * 60 * 1000; // précision finale visée : 1h
const QUARTER_SEARCH_ESTIMATE_MARGIN_DAYS = 2; // marge de sécurité, vérifiée empiriquement (voir findNextAgeCrossing)

// Affine par dichotomie l'intervalle [before, after] (où l'on sait que l'âge cherché se trouve)
// jusqu'à obtenir la précision voulue.
const bisectAgeCrossing = (before: Date, after: Date, targetAgeDays: number): Date => {
  let low = before;
  let high = after;
  while (high.getTime() - low.getTime() > QUARTER_SEARCH_PRECISION_MS) {
    const middle = new Date((low.getTime() + high.getTime()) / 2);
    if (getLunarAge(middle).age < targetAgeDays) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return high;
};

// La lib expose getNextNewMoon/getNextFullMoon mais pas d'équivalent pour les quartiers.
// getLunarAge(date).age donne l'âge de la Lune en jours DEPUIS LA DERNIÈRE NOUVELLE LUNE (borné
// entre 0 et LUNAR_SYNODIC_MONTH, retombe à ~0 à chaque nouvelle lune) : Premier Quartier ≈ 1/4
// de cycle, Dernier Quartier ≈ 3/4. On cherche donc "la prochaine date où cet âge atteint X jours".
//
// Le balayage part d'une estimation (plutôt que de `date` directement) : getLunarAge donne déjà
// l'âge exact à `date`, ce qui permet d'estimer combien de jours nous séparent de la cible (en
// supposant une progression ~linéaire, 1 jour d'âge par jour réel). Cette hypothèse n'est pas
// exacte (l'excentricité de l'orbite lunaire fait légèrement varier le rythme), d'où la marge de
// sécurité avant l'estimation — le Math.max(date, ...) garantit qu'on ne recule jamais avant
// `date`, donc qu'on ne peut jamais renvoyer une occurrence antérieure à la vraie "prochaine".
// Vérifié empiriquement (16 000 dates entre 1990 et 2040, comparé à un balayage naïf) : 0 écart,
// ~7x moins d'itérations en moyenne.
const findNextAgeCrossing = (date: Date, targetAgeDays: number): Date => {
  const currentAge = getLunarAge(date).age;
  let ageGap = targetAgeDays - currentAge;
  if (ageGap <= 0) ageGap += LUNAR_SYNODIC_MONTH; // cible déjà passée dans le cycle courant

  const estimate = new Date(date.getTime() + ageGap * DAY_MS);
  let previousDate = new Date(Math.max(date.getTime(), estimate.getTime() - QUARTER_SEARCH_ESTIMATE_MARGIN_DAYS * DAY_MS));
  let previousAge = getLunarAge(previousDate).age;

  // Balayage grossier jusqu'à repérer l'intervalle où l'âge franchit la cible. Deux cas
  // possibles à chaque pas :
  // - l'âge dépasse la cible normalement (on a trouvé l'intervalle, on arrête ici) ;
  // - l'âge retombe brutalement (une Nouvelle Lune a eu lieu entre les deux dates) : la cible
  //   est déjà passée dans le cycle actuel, elle ne reviendra qu'au cycle suivant — on continue
  //   simplement le balayage, l'âge repart de ~0.
  for (;;) {
    const nextDate = new Date(previousDate.getTime() + QUARTER_SEARCH_STEP_MS);
    const nextAge = getLunarAge(nextDate).age;

    if (previousAge < targetAgeDays && nextAge >= targetAgeDays) {
      return bisectAgeCrossing(previousDate, nextDate, targetAgeDays);
    }

    previousDate = nextDate;
    previousAge = nextAge;
  }
};

/**
 * getNextFirstMoonQuarter()
 *
 * Le prochain Premier Quartier (≈ 1/4 du cycle lunaire après la dernière Nouvelle Lune).
 */
export const getNextFirstMoonQuarter = (date: Date): Date => findNextAgeCrossing(date, LUNAR_SYNODIC_MONTH / 4);

/**
 * getNextLastMoonQuarter()
 *
 * Le prochain Dernier Quartier (≈ 3/4 du cycle lunaire après la dernière Nouvelle Lune).
 */
export const getNextLastMoonQuarter = (date: Date): Date => findNextAgeCrossing(date, (LUNAR_SYNODIC_MONTH * 3) / 4);

/**
 * getNextFullMoon()
 *
 * La prochaine Pleine Lune (≈ 1/2 du cycle lunaire après la dernière Nouvelle Lune), via la même
 * recherche par âge que les quartiers — remplace observerlyGetNextFullMoon, dont le balayage à
 * pas de 10s sur 24h coûte ~150-300ms par appel (mesuré), quel que soit le point de départ. La
 * Pleine Lune tombe loin de la discontinuité de reset de l'âge lunaire (qui n'a lieu qu'à la
 * Nouvelle Lune), donc pas de cas limite comme celui trouvé pour getNextNewMoon (voir plus bas
 * pourquoi celle-ci, elle, reste sur la lib). Vérifié : écart moyen 0,4h, max 1h sur 3000 dates
 * entre 1990 et 2040 contre l'implémentation de la lib, ~700x plus rapide.
 */
export const getNextFullMoon = (date: Date): Date => findNextAgeCrossing(date, LUNAR_SYNODIC_MONTH / 2);

// getNextNewMoon N'A PAS d'équivalent rapide ici, volontairement : au voisinage immédiat d'une
// vraie Nouvelle Lune, getLunarAge().age met jusqu'à ~1h à "retomber" à 0 après l'instant réel du
// croisement. Si `date` tombe dans ce court intervalle, une recherche par détection de chute
// d'âge peut croire qu'une Nouvelle Lune est imminente alors qu'elle vient de se produire, et
// renvoyer une date en avance d'un cycle complet (~29,5 jours, testé et reproduit sur un cas réel).
// Pas de solution par âge fiable trouvée pour ce cas précis — utiliser observerlyGetNextNewMoon
// (lente mais correcte) directement pour la Nouvelle Lune.

/**
 * getLunarPhaseLabel()
 *
 * Traduit une Phase (valeur renvoyée par getLunarPhase) via i18next — namespace "moon", clé
 * "phases.<Phase>". Voir src/i18n/locales/{fr,en,it}/moon.json pour les libellés. i18next.t()
 * marche hors composant React (pas de hook nécessaire) ; la réactivité au changement de langue
 * vient du composant appelant, qui doit lui-même utiliser useTranslation() pour se re-render.
 */
export const getLunarPhaseLabel = (phase: Phase): string => i18next.t(`phases.${phase}`, { ns: "moon" });
