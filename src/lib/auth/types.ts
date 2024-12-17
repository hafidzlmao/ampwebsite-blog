export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export interface SignInCredentials {
  username: string;
  password: string;
}

export interface AuthError {
  message: string;
  code?: string;
}