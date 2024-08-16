import { Role } from '../../../types';

export interface LoginUser {
  pk: string;
  email: string;
  name: string;
  role: Role;
  avatar: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: LoginUser;
}

export interface LoginForm {
  email: string;
  password: string;
}
