export const notificationsTranslations = {
  successSchedule: "Successfully scheduled notification",
  successRemove: "Successfully removed notification",
  permissionDenied: "Enable push notifications to receive alerts",
  pushTokenSaved: "Push notifications enabled",
  pushTokenError: "Could not enable push notifications",
  visibilitySubscribed: "Visibility alert enabled",
  visibilityUnsubscribed: "Visibility alert disabled",
  satelliteSubscribed: "Pass alerts enabled",
  satelliteUnsubscribed: "Pass alerts disabled",
  launchesSubscribed: "Launch alerts enabled",
  launchesUnsubscribed: "Launch alerts disabled",
  objectVisibility: {
    title: "🔭 {{object_name}} is visible",
    body: "{{object_name}} just rose above the horizon. Take a look!",
    schedule: "Notify me when this object is visible",
    remove: "Disable visibility alert",
    noNext: "Cannot schedule this alert right now",
  },
  satellitePass: {
    title: "🛰️ {{satname}} pass incoming",
    body: "{{satname}} starts at {{time}} from your location",
    schedule: "Notify me before this pass",
    remove: "Disable pass alert",
    tooSoon: "This pass is too soon to schedule",
  },
  launches: {
    title: "🚀 T-{{timeTo}} !",
    body: "Don't miss the launch of {{launch_name}} ! ",
  }
}