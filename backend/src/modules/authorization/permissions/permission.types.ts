export const APPLICATION_PERMISSIONS = ['manageAccessGrants'] as const;
export type ApplicationPermission = (typeof APPLICATION_PERMISSIONS)[number];

export const ROLE_PERMISSIONS = {
  player: [],
  admin: ['manageAccessGrants'],
} as const satisfies Record<string, readonly ApplicationPermission[]>;
