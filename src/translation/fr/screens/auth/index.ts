export const authScreensTranslations = {
  login: {
    title: "Connexion",
    subtitle: "Ravi de vous revoir !",
    forgotPassword: "Mot de passe oublié ?",
    noAccount: "Pas encore de compte ? Inscrivez-vous !",
    submit: "Continuer",
    error: "Une erreur est survenue, veuillez réessayer",
  },
  register: {
    title: "Inscription",
    subtitle: "Rejoignez-nous !",
    noAccount: "Vous avez un compte ? Connectez-vous !",
    submit: "Créer mon compte",
    error: "Une erreur est survenue, veuillez réessayer",
    passwordMismatch: "Les mots de passe ne correspondent pas",
  },
  forgotPassword: {
    title: "Mot de passe oublié",
    subtitle: "Recevez un lien de réinitialisation",
    noAccount: "Pas encore de compte ? Inscrivez-vous !",
    submit: "Envoyer le lien",
    success: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
    error: "Une erreur est survenue lors de l’envoi du lien, veuillez réessayer",
    returnToLogin: "Retour à la connexion",
  },
  profile: {
    title: "Profil",
    subtitle: "Les informations liées à votre compte",
    welcome: "Bienvenue,",
    createdAt: 'Date de création',
    updatedAt: 'Dernière mise à jour',
    downloadedResources: 'Ressources téléchargées',
    subscriptionName: 'Nom de l\'abonnement',
    subscriptionRenewal: 'Date de renouvellement',
    subscriptionDate: 'Abonné depuis le',
    subscriptionType: 'Type d\'abonnement',
    subscriptionCancellationDate: 'Abonnement résilié le',
    accountRole: 'Status du compte',
    logout: 'Se déconnecter',
    edit: 'Modifier / ajouter des informations',
    cancelSubscription: 'Annuler mon abonnement',
    restoreSubscription: 'Restaurer mon abonnement',
    roles: {
      admin: "Administrateur",
      member: "Non abonné",
      subscriber: "Abonné",
      unknown: "Inconnu",
    },
    subscriptionTypes: {
      monthly: "Mensuel",
      yearly: "Annuel",
      lifetime: "License à vie",
      personal: 'Personnel',
      professional: 'Organisation',
      renewal: "Renouvellement",
      renewalTypes: {
        auto: "Automatique",
        canceled: "Désactivé",
      }
    },
    dataAndSubscription: {
      title: "Données et abonnement",
      dataSync: {
        title: "Synchronisation des données",
        subtitle: "Ne perdez jamais vos paramètres !",
        send: {
          title: "Envoyer",
          warning: "Cela remplacera les données actuelles de votre compte Astroshare par celles de cet appareil. Êtes-vous sûr de vouloir continuer ?",
          success: "Vos données ont été envoyées avec succès sur votre compte Astroshare.",
          error: "Une erreur est survenue lors de l'envoi des données, veuillez réessayer.",
        },
        fetch: {
          title: "Récupérer",
          warning: "Cela remplacera les données actuelles de cet appareil par celles de votre compte Astroshare. Êtes-vous sûr de vouloir continuer ?",
          success: "Vos données ont été récupérées avec succès depuis votre compte Astroshare.",
          error: "Une erreur est survenue lors de la récupération des données, veuillez réessayer.",
        },
        lastUpdate: "Dernière synchronisation : ",
      },

      subscriptionManagement: {
        title: "Gestion de l'abonnement",
        subtitle: "Moyens de paiement, factures, etc.",
        cancel: {
          warning: "Êtes-vous sûr de vouloir annuler votre abonnement ? Vous conserverez l'accès à Astroshare Pro jusqu'à la fin de votre période de facturation actuelle.",
          success: "Votre abonnement a été annulé avec succès. Vous conserverez l'accès à Astroshare Pro jusqu'à la fin de votre période de facturation actuelle.",
          error: "Une erreur est survenue lors de l'annulation de l'abonnement, veuillez réessayer.",
        },
        restore: {
          success: "Votre abonnement a été restauré avec succès.",
          error: "Une erreur est survenue lors de la restauration de l'abonnement, veuillez réessayer.",
        }
      }
    },
    personnalInfos: {
      title: "Informations personnelles",
      language: "Langue de l'application",
      email: "Changer mon email",
      infos: {
        title: "Mes informations",
      },
      addresses: {
        title: "Gestion de mes adresses d'observation",
      },
      gear: {
        title: "Mon matériel astro"
      }
    }
  },
  placeholders: {
    email: "Email",
    password: "Mot de passe",
    passwordConfirmation: "Confirmation de mot de passe",
  },
  errors: {
    generic: "Une erreur est survenue, veuillez réessayer",
    missingField: "Veuillez remplir tous les champs",
    passwordMismatch: "Les mots de passe ne correspondent pas",
    missingEmail: "Veuillez renseigner votre email",
  }
}
