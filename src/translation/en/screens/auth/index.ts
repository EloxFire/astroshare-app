export const authScreensTranslations = {
  login: {
    title: "Login",
    subtitle: "Welcome back!",
    forgotPassword: "Forgot your password?",
    noAccount: "Don't have an account? Sign up!",
    submit: "Continue",
    error: "An error occurred, please try again",
  },
  register: {
    title: "Register",
    subtitle: "Join us!",
    noAccount: "Already have an account? Log in!",
    submit: "Create my account",
    error: "An error occurred, please try again",
    passwordMismatch: "Passwords do not match",
  },
  forgotPassword: {
    title: "Password Reset",
    subtitle: "Enter your email to receive a reset link",
    noAccount: "Don't have an account? Sign up!",
    submit: "Send link",
    success: "If an account exists with this email, a reset link has been sent.",
    error: "An error occurred while sending the link, please try again",
    returnToLogin: "Return to login",
  },
  profile: {
    title: "Profile",
    subtitle: "Your account information",
    welcome: "Welcome,",
    createdAt: 'Creation date',
    updatedAt: 'Last update',
    downloadedResources: 'Downloaded resources',
    subscriptionName: 'Subscription name',
    subscriptionRenewal: 'Renewal date',
    subscriptionDate: 'Subscribed since',
    subscriptionType: 'Subscription type',
    subscriptionCancellationDate: 'Subscription canceled on',
    accountRole: 'Account status',
    logout: 'Logout',
    edit: 'Edit / add information',
    cancelSubscription: 'Cancel my subscription',
    restoreSubscription: 'Restore my subscription',
    roles: {
      admin: "Administrator",
      member: "Unsubscribed",
      subscriber: "Subscriber",
      unknown: "Unknown",
    },
    subscriptionTypes: {
      monthly: "Monthly",
      yearly: "Yearly",
      lifetime: "Lifetime license",
      personal: 'Personal',
      professional: 'Organization',
      renewal: "Renewal",
      renewalTypes: {
        auto: "Automatic",
        canceled: "Disabled",
      }
    },
    dataAndSubscription: {
      title: "Data & subscription",
      dataSync: {
        title: "Data synchronization",
        subtitle: "Never lose your settings!",
        send: {
          title: "Send",
          warning: "This will replace the current data on your Astroshare account with the data from this device. Are you sure you want to continue?",
          success: "Your data has been successfully sent to your Astroshare account.",
          error: "An error occurred while sending your data, please try again.",
        },
        fetch: {
          title: "Fetch",
          warning: "This will replace the current data on this device with the data from your Astroshare account. Are you sure you want to continue?",
          success: "Your data has been successfully fetched from your Astroshare account.",
          error: "An error occurred while fetching your data, please try again.",
        },
        lastUpdate: "Last sync: ",
      },
      subscriptionManagement: {
        title: "Subscription management",
        subtitle: "Payment methods, invoices, etc.",
        cancel: {
          warning: "Are you sure you want to cancel your subscription? You will keep access to Astroshare Pro until the end of your current billing period.",
          success: "Your subscription has been canceled successfully. You will keep access to Astroshare Pro until the end of your current billing period.",
          error: "An error occurred while canceling your subscription, please try again.",
        },
        restore: {
          success: "Your subscription has been restored successfully.",
          error: "An error occurred while restoring your subscription, please try again.",
        }
      }
    },
    personnalInfos: {
      title: "Personal information",
      language: "App language",
      email: "Change my email",
      infos: {
        title: "My information",
      },
      addresses: {
        title: "Manage my observation addresses",
      },
      gear: {
        title: "My astro gear",
        subtitle: "Manage your astro gear for a personalized experience",
        telescopes: {
          title: "My telescopes",
        }
      }
    }
  },
  placeholders: {
    email: "Email",
    password: "Password",
    passwordConfirmation: "Password confirmation",
  },
  errors: {
    generic: "An error occurred, please try again",
    missingField: "Please fill in all fields",
    missingEmail: "Please provide your email",
    passwordMismatch: "Passwords do not match",
  }
}
