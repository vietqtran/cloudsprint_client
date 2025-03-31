import { TodoResponse } from '@/utils/response';
import { User } from '.';

export interface RootState {
  auth: AuthState;
  todo: TodoState;
}

export interface AuthState {
  user: User | null;
}

export interface TodoState {
  todo: TodoResponse | null;
}
