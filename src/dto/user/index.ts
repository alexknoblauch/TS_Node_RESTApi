
export interface LoginCredentials {
    email: string, 
    password: string
}

export interface LoginResult {
    accessToken: string
    refreshToken: string
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface LogoutInput {
    userId: string;
    refreshToken: string;
}

export interface RefreshtokenInput {
    refreshToken: string;
    userId: string;
}

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
}

export interface PasswordForgot {
    email: string,
    baseURL: string
}

export interface RegisterResponse {
    accessToken: string; 
    refreshToken: string
}
