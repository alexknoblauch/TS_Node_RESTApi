export interface TokenCreateDTO {
    token: string,
    userId: string
}

export interface TokenUpdateDTO {
    token: string,
    userId: string
}

export interface ITokenPersistence {
  token: string;
  userId: string;           // Im Domain immer string!
  createdAt: Date;
  expiresAt: Date;
  revoked?: boolean;
  revokedAt?: Date | null;
}
