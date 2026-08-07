export type UserRole = "buyer" | "supplier" | "admin";

export interface User {
  id: number;
  email: string;
  role: UserRole;
  is_active: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
