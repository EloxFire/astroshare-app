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
  }
}
