import { v4 as uuidv4 } from 'uuid';
import {getData, storeData} from "../../storage";
import {storageKeys} from "../../constants";
import {TrackEvent} from "../../types/analytics/TrackEvent";
import {User} from "../../types/auth/User";
import * as Device from 'expo-device';
import {LocationObject} from "../../types/LocationObject";
import dayjs from "dayjs";
import {eventTypes} from "../../constants/analytics";

export const setupAnalytics = async () => {
  const newSessionId: string = uuidv4();
  console.log(`[Analytics] New session started with ID: ${newSessionId}`);
  await storeData(storageKeys.analytics.sessionId, newSessionId);

}

export const getAnalyticsSessionId = async (): Promise<string | null | undefined> => {
  const sessionId = await getData(storageKeys.analytics.sessionId);
  return sessionId;
}

export const sendAnalyticsEvent = async (
  user: User,
  location: LocationObject,
  eventName: string,
  eventType: string,
  eventData: Record<string, any> = {},
  locale?: string
) => {
  const sessionId = await getAnalyticsSessionId();
  if (!sessionId) {
    console.warn("[Analytics] No session ID found. Event not sent.");
    return;
  }

  console.log(`[Analytics] Sending event: ${eventName} for user: ${user ? user.uid : "anonymous"} with session ID: ${sessionId}`);

  const eventPayload: TrackEvent = {
    userId: user ? user.uid : null,
    userType: user ? user.role : "anonymous",
    sessionId: sessionId,
    deviceInfo: {
      os: `${Device.osName} ${Device.osVersion}` || "Unknown",
      appVersion: process.env.EXPO_PUBLIC_APP_VERSION,
      locale: locale || "Unknown",
      model: `${Device.brand} ${Device.modelName}` || "Unknown",
    },
    location: {
      latitude: location.lat,
      longitude: location.lon,
    },
    eventType: eventType,
    eventSource: eventName,
    eventData: eventData,
    timestamp: dayjs().toDate(),
    isDebug: process.env.EXPO_PUBLIC_ENV === "dev",
  }

  await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/tracking/sendEvent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event: eventPayload
    }),
  })
}