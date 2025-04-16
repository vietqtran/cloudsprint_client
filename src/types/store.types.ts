import { User } from '.';

export interface RootState {
  auth: AuthState;
}

export interface AuthState {
  user: User | null;
}
