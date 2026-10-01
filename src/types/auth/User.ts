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
  createdAt: Date;
  updatedAt: Date;
}