import {UserRoles} from "./UserRoles";

export type User = {
  email: string;
  role: UserRoles;
  downloadsCount: number;
  downloadsHistory: string[];
  uid: string;
  isAdmin: boolean;
  subscriptionDate?: Date;
  subscription?: string;
  subscriptionName?: string;
  subscriptionRenewal?: Date;
  subscriptionCategory?: string;
  hasCancelledSubscription?: boolean;
  subscriptionCancelledAt?: Date;
  subscriptionId?: string;
  ref?: string;
  createdAt?: Date;
  updatedAt?: Date;
  profile?: {
    firstname?: string;
    lastname?: string;
    birthday?: Date;
    bio?: string;
    profilePicture?: string;
    username?: string;
  }
}