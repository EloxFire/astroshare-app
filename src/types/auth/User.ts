import { FirestoreTimestampLike } from "../../helpers/api/firestoreTimestamp";
import { Subscription } from "./Subscription";
import { UserRoles } from "./UserRoles";

export type User = {
  uid: string;
  email: string;
  isAdmin: boolean;
  profile?:{
    firstname: string;
    lastname: string;
    bio: string;
    birthday: string;
    profilePicture: string;
    pseudonym: string;
  };
  role: UserRoles;
  subscription?: Subscription;
  subscriptionExpiresAt?: Date;
  subscriptionSource?: string;
  createdAt: FirestoreTimestampLike;
  updatedAt: FirestoreTimestampLike;
}