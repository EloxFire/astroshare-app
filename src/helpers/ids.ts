// Id local temporaire pour un observatoire pas encore enregistré — pas besoin d'un vrai UUID
// cryptographique ici, donc pas besoin de uuid/react-native-get-random-values (qui nécessite un
// module natif absent d'Expo Go et d'un rebuild sinon). Horodatage + suffixe aléatoire suffisent
// largement pour une clé unique côté client.
export const generateCustomId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;