import { useMemo } from "react";
import {
  getLunarAge,
  getLunarAngularDiameter,
  getLunarAnnualEquationCorrection,
  getLunarArgumentOfLatitude,
  getLunarBrownLunationNumber,
  getLunarCorrectedEclipticLongitudeOfTheAscendingNode,
  getLunarDistance,
  getLunarEclipticCoordinate,
  getLunarEclipticLatitude,
  getLunarEclipticLongitude,
  getLunarElongation,
  getLunarEquatorialCoordinate,
  getLunarEvectionCorrection,
  getLunarIllumination,
  getLunarMeanAnomaly,
  getLunarMeanAnomalyCorrection,
  getLunarMeanEclipticLongitude,
  getLunarMeanEclipticLongitudeOfTheAscendingNode,
  getLunarMeanGeometricLongitude,
  getLunarNextRise,
  getLunarNextSet,
  getLunarPhase,
  getLunarPhaseAngle,
  getLunarPhaseLabel,
  getLunarTrueAnomaly,
  getLunarTrueEclipticLongitude,
  getNextFullMoon,
  getNextNewMoon,
  isBlueMoon,
  isFullMoon,
  isNewMoon,
  type EclipticCoordinate,
  type EquatorialCoordinate,
  type LunarAge,
  type LunarAngularDiameterObserver,
  type Observer,
  type Phase,
  type TransitInstance,
} from "../helpers/astrometry/moon";

// Chaque valeur n'est calculée qu'à la première demande, puis mise en cache sur
// l'instance : `moon.getLunarPhase()` appelée plusieurs fois ne relance pas le calcul.
class Moon {
  private readonly date: Date;
  private readonly observer?: Observer;

  private annualEquationCorrection?: number;
  private meanAnomaly?: number;
  private meanGeometricLongitude?: number;
  private argumentOfLatitude?: number;
  private meanEclipticLongitude?: number;
  private evectionCorrection?: number;
  private meanEclipticLongitudeOfTheAscendingNode?: number;
  private meanAnomalyCorrection?: number;
  private trueAnomaly?: number;
  private trueEclipticLongitude?: number;
  private correctedEclipticLongitudeOfTheAscendingNode?: number;
  private eclipticLongitude?: number;
  private eclipticLatitude?: number;
  private eclipticCoordinate?: EclipticCoordinate;
  private equatorialCoordinate?: EquatorialCoordinate;
  private elongation?: number;
  private angularDiameter?: number;
  private distance?: number;
  private age?: LunarAge;
  private phaseAngle?: number;
  private illumination?: number;
  private phase?: Phase;
  private brownLunationNumber?: number;
  private newMoon?: boolean;
  private nextNewMoon?: Date;
  private fullMoon?: boolean;
  private nextFullMoon?: Date;
  private blueMoon?: boolean;
  private nextRise?: TransitInstance | false;
  private nextSet?: TransitInstance | boolean;

  constructor(date: Date, observer?: Observer) {
    this.date = date;
    this.observer = observer;
  }

  // Utilisée par les éphémérides (lever/coucher), qui ont besoin d'un observer
  // géographique — contrairement au reste des méthodes de cette classe.
  private requireObserver(method: string): Observer {
    if (!this.observer) {
      throw new Error(`useMoon: ${method}() nécessite un observer (useMoon(date, observer)).`);
    }
    return this.observer;
  }

  getLunarAnnualEquationCorrection(): number {
    if (this.annualEquationCorrection === undefined) {
      this.annualEquationCorrection = getLunarAnnualEquationCorrection(this.date);
    }
    return this.annualEquationCorrection;
  }

  getLunarMeanAnomaly(): number {
    if (this.meanAnomaly === undefined) {
      this.meanAnomaly = getLunarMeanAnomaly(this.date);
    }
    return this.meanAnomaly;
  }

  getLunarMeanGeometricLongitude(): number {
    if (this.meanGeometricLongitude === undefined) {
      this.meanGeometricLongitude = getLunarMeanGeometricLongitude(this.date);
    }
    return this.meanGeometricLongitude;
  }

  getLunarArgumentOfLatitude(): number {
    if (this.argumentOfLatitude === undefined) {
      this.argumentOfLatitude = getLunarArgumentOfLatitude(this.date);
    }
    return this.argumentOfLatitude;
  }

  getLunarMeanEclipticLongitude(): number {
    if (this.meanEclipticLongitude === undefined) {
      this.meanEclipticLongitude = getLunarMeanEclipticLongitude(this.date);
    }
    return this.meanEclipticLongitude;
  }

  getLunarEvectionCorrection(): number {
    if (this.evectionCorrection === undefined) {
      this.evectionCorrection = getLunarEvectionCorrection(this.date);
    }
    return this.evectionCorrection;
  }

  getLunarMeanEclipticLongitudeOfTheAscendingNode(): number {
    if (this.meanEclipticLongitudeOfTheAscendingNode === undefined) {
      this.meanEclipticLongitudeOfTheAscendingNode = getLunarMeanEclipticLongitudeOfTheAscendingNode(this.date);
    }
    return this.meanEclipticLongitudeOfTheAscendingNode;
  }

  getLunarMeanAnomalyCorrection(): number {
    if (this.meanAnomalyCorrection === undefined) {
      this.meanAnomalyCorrection = getLunarMeanAnomalyCorrection(this.date);
    }
    return this.meanAnomalyCorrection;
  }

  getLunarTrueAnomaly(): number {
    if (this.trueAnomaly === undefined) {
      this.trueAnomaly = getLunarTrueAnomaly(this.date);
    }
    return this.trueAnomaly;
  }

  getLunarTrueEclipticLongitude(): number {
    if (this.trueEclipticLongitude === undefined) {
      this.trueEclipticLongitude = getLunarTrueEclipticLongitude(this.date);
    }
    return this.trueEclipticLongitude;
  }

  getLunarCorrectedEclipticLongitudeOfTheAscendingNode(): number {
    if (this.correctedEclipticLongitudeOfTheAscendingNode === undefined) {
      this.correctedEclipticLongitudeOfTheAscendingNode = getLunarCorrectedEclipticLongitudeOfTheAscendingNode(
        this.date
      );
    }
    return this.correctedEclipticLongitudeOfTheAscendingNode;
  }

  getLunarEclipticLongitude(): number {
    if (this.eclipticLongitude === undefined) {
      this.eclipticLongitude = getLunarEclipticLongitude(this.date);
    }
    return this.eclipticLongitude;
  }

  getLunarEclipticLatitude(): number {
    if (this.eclipticLatitude === undefined) {
      this.eclipticLatitude = getLunarEclipticLatitude(this.date);
    }
    return this.eclipticLatitude;
  }

  getLunarEclipticCoordinate(): EclipticCoordinate {
    if (this.eclipticCoordinate === undefined) {
      this.eclipticCoordinate = getLunarEclipticCoordinate(this.date);
    }
    return this.eclipticCoordinate;
  }

  getLunarEquatorialCoordinate(): EquatorialCoordinate {
    if (this.equatorialCoordinate === undefined) {
      this.equatorialCoordinate = getLunarEquatorialCoordinate(this.date);
    }
    return this.equatorialCoordinate;
  }

  getLunarElongation(): number {
    if (this.elongation === undefined) {
      this.elongation = getLunarElongation(this.date);
    }
    return this.elongation;
  }

  // Seule méthode qui tient compte de l'observer : dérivé de celui passé à useMoon,
  // avec une élévation par défaut de 0m (niveau de la mer) si non précisée.
  getLunarAngularDiameter(): number {
    if (this.angularDiameter === undefined) {
      const observer: LunarAngularDiameterObserver | undefined = this.observer
        ? {
            latitude: this.observer.latitude,
            longitude: this.observer.longitude,
            elevation: this.observer.elevation ?? 0,
          }
        : undefined;
      this.angularDiameter = getLunarAngularDiameter(this.date, observer);
    }
    return this.angularDiameter;
  }

  getLunarDistance(): number {
    if (this.distance === undefined) {
      this.distance = getLunarDistance(this.date);
    }
    return this.distance;
  }

  getLunarAge(): LunarAge {
    if (this.age === undefined) {
      this.age = getLunarAge(this.date);
    }
    return this.age;
  }

  getLunarPhaseAngle(): number {
    if (this.phaseAngle === undefined) {
      this.phaseAngle = getLunarPhaseAngle(this.date);
    }
    return this.phaseAngle;
  }

  getLunarIllumination(): number {
    if (this.illumination === undefined) {
      this.illumination = getLunarIllumination(this.date);
    }
    return this.illumination;
  }

  getLunarPhase(): Phase {
    if (this.phase === undefined) {
      this.phase = getLunarPhase(this.date);
    }
    return this.phase;
  }

  getLunarPhaseLabel(): string {
    return getLunarPhaseLabel(this.getLunarPhase());
  }

  getLunarBrownLunationNumber(): number {
    if (this.brownLunationNumber === undefined) {
      this.brownLunationNumber = getLunarBrownLunationNumber(this.date);
    }
    return this.brownLunationNumber;
  }

  isNewMoon(): boolean {
    if (this.newMoon === undefined) {
      this.newMoon = isNewMoon(this.date);
    }
    return this.newMoon;
  }

  getNextNewMoon(): Date {
    if (this.nextNewMoon === undefined) {
      this.nextNewMoon = getNextNewMoon(this.date);
    }
    return this.nextNewMoon;
  }

  isFullMoon(): boolean {
    if (this.fullMoon === undefined) {
      this.fullMoon = isFullMoon(this.date);
    }
    return this.fullMoon;
  }

  getNextFullMoon(): Date {
    if (this.nextFullMoon === undefined) {
      this.nextFullMoon = getNextFullMoon(this.date);
    }
    return this.nextFullMoon;
  }

  isBlueMoon(): boolean {
    if (this.blueMoon === undefined) {
      this.blueMoon = isBlueMoon(this.date);
    }
    return this.blueMoon;
  }

  getLunarNextRise(): TransitInstance | false {
    if (this.nextRise === undefined) {
      this.nextRise = getLunarNextRise(this.date, this.requireObserver("getLunarNextRise"));
    }
    return this.nextRise;
  }

  getLunarNextSet(): TransitInstance | boolean {
    if (this.nextSet === undefined) {
      this.nextSet = getLunarNextSet(this.date, this.requireObserver("getLunarNextSet"));
    }
    return this.nextSet;
  }
}

// Clé stable dérivée de l'observer : évite de recalculer juste parce que l'appelant
// a passé un nouvel objet littéral (même valeurs) à chaque render.
const getObserverKey = (observer?: Observer): string =>
  observer
    ? `${observer.latitude}:${observer.longitude}:${observer.elevation ?? ""}:${observer.datetime.getTime()}`
    : "";

// Donne accès aux infos de la Lune (phase, âge, illumination, ...) pour une date
// donnée, n'importe où dans l'app. Ne recalcule que ce qui est effectivement demandé,
// et met en cache tant que la date/l'observer ne changent pas entre deux renders.
export const useMoon = (date: Date, observer?: Observer): Moon => {
  const dateKey = date.getTime();
  const observerKey = getObserverKey(observer);

  return useMemo(
    () => new Moon(date, observer),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateKey, observerKey]
  );
};

export default useMoon;
