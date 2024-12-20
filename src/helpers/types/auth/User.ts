import {UserRoles} from "./UserRoles";

export type User = {
  email: string;
  role: UserRoles;
  downloadsCount: number;
  downloadsHistory: string[];
  uid: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  birthdate?: Date;
  ref?: string;
  createdAt?: Date;
  updatedAt?: Date;
}