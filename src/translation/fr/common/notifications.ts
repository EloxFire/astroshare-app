export const notificationsTranslations = {
  successSchedule: "Notification planifiée avec succès",
  successRemove: "Notification supprimée avec succès",
  permissionDenied: "Autorisez les notifications push pour recevoir des alertes",
  pushTokenSaved: "Notifications push activées",
  pushTokenError: "Impossible d'activer les notifications push",
  visibilitySubscribed: "Alerte de visibilité activée",
  visibilityUnsubscribed: "Alerte de visibilité désactivée",
  satelliteSubscribed: "Alertes de passage activées",
  satelliteUnsubscribed: "Alertes de passage désactivées",
  launchesSubscribed: "Alertes lancements activées",
  launchesUnsubscribed: "Alertes lancements désactivées",
  objectVisibility: {
    title: "🔭 {{object_name}} est visible",
    body: "{{object_name}} vient de se lever, profitez-en !",
    schedule: "Me prévenir quand cet objet sera visible",
    remove: "Désactiver l'alerte de visibilité",
    noNext: "Impossible de planifier cette alerte pour le moment",
  },
  satellitePass: {
    title: "🛰️ Passage de {{satname}}",
    body: "{{satname}} passera à {{time}} au dessus de vous",
    schedule: "Me prévenir avant ce passage",
    remove: "Désactiver l'alerte de passage",
    tooSoon: "Passage trop proche pour planifier une alerte",
  },
  launches: {
    title: "Mission {{mission_name}}",
    body: "🚀 T-30 minutes pour le lancement de la mission {{mission_name}} ({{operator_name}}) ! ",
  }
}