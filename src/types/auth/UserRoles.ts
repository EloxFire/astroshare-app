export const UserRoles = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
  SUBSCRIBER: "SUBSCRIBER",
  PARTNER: "PARTNER",
  GUEST: "GUEST",
  BANNED: "BANNED",
} as const;

export type UserRoles = typeof UserRoles[keyof typeof UserRoles];