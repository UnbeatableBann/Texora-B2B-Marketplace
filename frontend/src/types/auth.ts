export type UserRole = "buyer" | "supplier" | "admin";

export interface User {
  id: number;
  email: string;
  role: UserRole;
  full_name?: string;
  profile_image?: string;
  is_active: boolean;
  onboarding_completed: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
}
