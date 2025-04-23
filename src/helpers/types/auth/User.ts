import {UserRoles} from "./UserRoles";

export type User = {
  email: string;
  role: UserRoles;
  downloadsCount: number;
  downloadsHistory: string[];
  uid: string;
  subscriptionDate?: Date;
  subscription?: string;
  subscriptionName?: string;
  subscriptionRenewal?: Date;
  subscriptionCategory?: string;
  hasCancelledSubscription?: boolean;
  subscriptionCancelledAt?: Date;
  subscriptionId?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  birthdate?: Date;
  ref?: string;
  createdAt?: Date;
  updatedAt?: Date;
}