import {ProPackage} from "../types/ProPackage";

const frPackages: ProPackage[] = [
  {
    name: 'Mensuel',
    description: 'Abonnement mensuel à AstroShare Pro',
    price: 2.49,
    stripePrice: 249,
    type: 'monthly',
    features: [
      "Sans engagement",
      "Planétarium 3D interactif",
      "Prédictions passages ISS",
      "Météo solaire avancée",
      "Calculs transits et éclipses",
      "Mises à jour régulières",
    ]
  },
  {
    name: 'Annuel',
    description: 'Abonnement annuel à AstroShare Pro',
    price: 23.90,
    stripePrice: 2390,
    type: 'yearly',
    features: [
      "Planétarium 3D interactif",
      "Prédictions passages ISS",
      "Météo solaire avancée",
      "Calculs transits et éclipses",
      "Mises à jour régulières",
    ],
    discount: '-20% !'
  },
  {
    name: 'Licence à vie',
    description: 'Paiement unique pour à AstroShare Pro à vie',
    price: 99,
    stripePrice: 9900,
    type: 'one-time',
    features: [
      "Planétarium 3D interactif",
      "Prédictions passages ISS",
      "Météo solaire avancée",
      "Calculs transits et éclipses",
      "Mises à jour régulières",
    ],
  },
]

const enPackages: ProPackage[] = [
  {
    name: 'Monthly',
    description: 'Monthly subscription to AstroShare Pro',
    price: 2.49,
    stripePrice: 249,
    type: 'monthly',
    features: [
      "No commitment",
      "Interactive 3D planetarium",
      "ISS pass predictions",
      "Advanced solar weather",
      "Transit and eclipse calculations",
      "Regular updates",
    ]
  },
  {
    name: 'Yearly',
    description: 'Annual subscription to AstroShare Pro',
    price: 23.90,
    stripePrice: 2390,
    type: 'yearly',
    features: [
      "Interactive 3D planetarium",
      "ISS pass predictions",
      "Advanced solar weather",
      "Transit and eclipse calculations",
      "Regular updates",
    ],
    discount: '20% OFF'
  }
]

export const astroshare_pro_packages: any = {
  'fr': frPackages,
  'en': enPackages
}
