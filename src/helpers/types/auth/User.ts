import {UserRoles} from "./UserRoles";
import {Subscription} from "./Subscription";

export type User = {
  email: string;
  role: UserRoles;
  downloadsCount: number;
  downloadsHistory: string[];
  uid: string;
  isAdmin: boolean;
  subscriptionDate?: Date;
  subscriptionName?: string;
  subscriptionRenewal?: Date;
  subscriptionCategory?: string;
  hasCancelledSubscription?: boolean;
  subscriptionCancelledAt?: Date;
  subscriptionId?: string;
  subscription?: Subscription;
  subscriptionSource?: 'stripe' | 'revenuecat' | 'none';
  subscriptionExpiresAt?: Date | null;
  ref?: string;
  createdAt?: Date;
  updatedAt?: Date;
  fromPartner?: boolean;
  partnerInfos?: {
    name: string;
    [key: string]: any;
  };
  profile?: {
    firstname?: string;
    lastname?: string;
    birthday?: Date;
    bio?: string;
    profilePicture?: string;
    username?: string;
  }
}