import {User} from "../../types/auth/User";
import {UserRoles} from "../../types/auth/UserRoles";

export const isProUser: (user: User) => boolean = (user: User): boolean => {
  return user.role === UserRoles.ADMIN || user.role === UserRoles.SUBSCRIBER
};