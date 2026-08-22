export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  is_email_verified: boolean;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface UserRegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  avatar_url?: string;
}

export interface UserLoginPayload {
  email: string;
  password: string;
}
