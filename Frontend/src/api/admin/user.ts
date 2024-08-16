import { getData, postData } from '../index';
import { APIResponse } from 'interface/commonResponse';

export const USER_URL = {
  USER_LIST: '/adminpage/user/',
};

export interface User {
  id: string;
  password: string;
  email: string;
  name: string;
  avatar: null | string;
  active: string;
  is_superuser: boolean;
  role: string;
  date_joined: string;
  last_login: string;
  groups: any[];
  user_permissions: any[];
}

export const getUser = async () => {
  const userList: APIResponse<User[]> = await getData(USER_URL.USER_LIST);
  return userList.result;
};
