import type { Usuario } from "@/Modules/Usuarios/Models/Usuario";

export interface AuthState {
  user: Usuario | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}
