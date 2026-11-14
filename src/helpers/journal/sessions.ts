import { AstronomySession, SessionObservedObject } from "../../types/statistics/AstronomySession";

export const getSessionMinutes = (session: AstronomySession): number => (session.endTime - session.startTime) / 60_000

export const getTotalObservationDuration = (sessions: AstronomySession[]): number => {
  return sessions.reduce((acc, session) => acc + getSessionMinutes(session), 0)
}

export const getTotalObservedObjects = (sessions: AstronomySession[]): number => {
  const totalObjects = sessions.reduce((acc, session) => {
    const sessionObjectsCount = session.observedObjects ? session.observedObjects.length : 0;
    return acc + sessionObjectsCount;
  }, 0);

  return totalObjects;
}