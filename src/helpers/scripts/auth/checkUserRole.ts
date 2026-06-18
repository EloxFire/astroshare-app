import {User} from "../../types/auth/User";
import {UserRoles} from "../../types/auth/UserRoles";

export const isProUser: (user: User) => boolean = (user: User): boolean => {
  if(!user) return false;
  if(user.isAdmin) return true;
  return user.role === UserRoles.SUBSCRIBER
};

export const isSevunUser = (user: User | null): boolean => {
  if (!user) return false;
  if (user.isAdmin) return true;
  return (
    user.role === UserRoles.SUBSCRIBER &&
    user.fromPartner === true &&
    user.partnerInfos?.name === 'SEVUN'
  );
};