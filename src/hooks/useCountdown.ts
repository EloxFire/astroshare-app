import { useEffect, useState } from "react";

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

// Magnitude de l'écart (avant OU après target) : avant target, le compte à rebours descend vers 0
// (T-) ; après, il grandit depuis 0 (T+, temps écoulé). `isPast` dit au composant quel sens lire.
const computeCountdown = (target: Date): Countdown => {
  const diffMs = target.getTime() - Date.now();
  const totalSeconds = Math.floor(Math.abs(diffMs) / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isPast: diffMs <= 0,
  };
}

// Compte à rebours (ou compte écoulé, voir computeCountdown) qui se met à jour chaque seconde
// jusqu'à/depuis `targetDate`. Purement local (pas de dépendance au fuseau affiché) : un écart en
// secondes reste le même quel que soit le fuseau dans lequel on choisit de l'afficher.
// `paused` arrête l'intervalle (ex: issue de la mission déjà connue, plus rien à compter).
export const useCountdown = (targetDate: Date, paused = false): Countdown => {
  const [countdown, setCountdown] = useState<Countdown>(() => computeCountdown(targetDate));

  useEffect(() => {
    if (paused) return;

    setCountdown(computeCountdown(targetDate));
    const interval = setInterval(() => setCountdown(computeCountdown(targetDate)), 1000);
    return () => clearInterval(interval);
  }, [targetDate.getTime(), paused]);

  return countdown;
}
