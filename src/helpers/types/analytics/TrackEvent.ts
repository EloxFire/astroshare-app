export type TrackEvent = {
  userId: string | null;
  userType: string;
  sessionId: string;
  eventType: string;
  eventSource: string;
  eventData?: Record<string, unknown>;
  deviceInfo: {
    os: string;
    model: string;
    appVersion: string;
    locale?: string;
  };
  location?: {
    latitude?: number;
    longitude?: number;
  };
  timestamp?: Date;
  isDebug?: boolean;
};