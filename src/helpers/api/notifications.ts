import { Platform } from 'react-native'
import { LocationObject } from '../types/LocationObject'
import { storageKeys } from '../constants'
import { getData } from '../storage'
import { registerForPushNotificationsAsync } from '../scripts/notifications/registerForPushNotifications'

const API_URL = process.env.EXPO_PUBLIC_ASTROSHARE_API_URL

const buildHeaders = async () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const accessToken = await getData(storageKeys.auth.accessToken)
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  return headers
}

const postJson = async (path: string, payload: Record<string, any>) => {
  try {
    const headers = await buildHeaders()
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`[NotificationsAPI] ${res.status} ${res.statusText}: ${errorText}`)
    }

    return true
  } catch (error) {
    console.log('[NotificationsAPI] Error posting JSON:', error)
    return false
  }
}

const deleteJson = async (path: string, payload: Record<string, any>) => {
  try {
    const headers = await buildHeaders()
    const res = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`[NotificationsAPI] ${res.status} ${res.statusText}: ${errorText}`)
    }

    return true
  } catch (error) {
    console.log('[NotificationsAPI] Error deleting JSON:', error)
    return false
  }
}

const ensurePushToken = async () => {
  const pushToken = await registerForPushNotificationsAsync()
  if (!pushToken) {
    return null
  }

  return pushToken
}

export const registerDeviceForPush = async (userId?: string | null) => {
  const pushToken = await ensurePushToken()
  if (!pushToken) return false

  return postJson('/notifications/push/register', {
    pushToken,
    userId,
    platform: Platform.OS,
  })
}

export const subscribeToObjectVisibility = async (params: {
  objectId: string
  objectName: string
  objectFamily: string
  coordinates?: { ra?: number | string; dec?: number | string }
  location?: LocationObject | null
  locale?: string
  userId?: string | null
}) => {
  const pushToken = await ensurePushToken()
  if (!pushToken) return false

  return postJson('/notifications/visibility/subscribe', {
    pushToken,
    userId: params.userId,
    objectId: params.objectId,
    objectName: params.objectName,
    objectFamily: params.objectFamily,
    coordinates: params.coordinates,
    location: params.location,
    locale: params.locale,
    platform: Platform.OS,
  })
}

export const unsubscribeFromObjectVisibility = async (params: {
  objectId: string
  userId?: string | null
}) => {
  const pushToken = await ensurePushToken()
  if (!pushToken) return false

  return deleteJson('/notifications/visibility/unsubscribe', {
    pushToken,
    userId: params.userId,
    objectId: params.objectId,
  })
}

export const subscribeToSatellitePasses = async (params: {
  noradId: number | string
  location?: LocationObject | null
  locale?: string
  userId?: string | null
}) => {
  const pushToken = await ensurePushToken()
  if (!pushToken) return false

  return postJson('/notifications/satellites/subscribe', {
    pushToken,
    noradId: params.noradId,
    location: params.location,
    userId: params.userId,
    locale: params.locale,
    platform: Platform.OS,
  })
}

export const unsubscribeFromSatellitePasses = async (params: {
  noradId: number | string
  userId?: string | null
}) => {
  const pushToken = await ensurePushToken()
  if (!pushToken) return false

  return deleteJson('/notifications/satellites/unsubscribe', {
    pushToken,
    noradId: params.noradId,
    userId: params.userId,
  })
}

export const subscribeToAllLaunches = async (params: {
  locale?: string
  userId?: string | null
}) => {
  const pushToken = await ensurePushToken()
  if (!pushToken) return false

  return postJson('/notifications/launches/subscribe', {
    pushToken,
    userId: params.userId,
    locale: params.locale,
    platform: Platform.OS,
  })
}

export const unsubscribeFromAllLaunches = async (params: { userId?: string | null }) => {
  const pushToken = await ensurePushToken()
  if (!pushToken) return false

  return deleteJson('/notifications/launches/unsubscribe', {
    pushToken,
    userId: params.userId,
  })
}
