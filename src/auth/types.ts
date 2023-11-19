export type JwtPayload = {
  sub: number;
  username: string;
};

export enum AuthError {
  AccessTokenExpired = 'ACCESS_TOKEN_EXPIRED',
  RefreshTokenExpired = 'REFRESH_TOKEN_EXPIRED',

  IncorrectPassword = 'INCORRECT_PASSWORD',
  UserWithSuchNameNotExists = 'USER_NAME_NOT_EXISTS',
  UserWithSuchEmailNotExists = 'USER_EMAIL_NOT_EXISTS',

  UserWithSuchNameExists = 'USER_NAME_EXISTS',
  UserWithSuchEmailExists = 'USER_EMAIL_EXISTS',
}
