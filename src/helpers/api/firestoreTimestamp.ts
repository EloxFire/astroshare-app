// Format de sérialisation JSON du SDK Admin Firestore (Timestamp.toJSON()) — c'est sous cette
// forme que l'API Astroshare renvoie les dates issues de Firestore, à distinguer du SDK client
// (qui expose directement une méthode .toDate()).
export interface FirestoreTimestampLike {
  _seconds: number;
  _nanoseconds: number;
}

export const firestoreTimestampToDate = (timestamp: FirestoreTimestampLike): Date =>
  new Date(timestamp._seconds * 1000 + Math.round(timestamp._nanoseconds / 1_000_000));
