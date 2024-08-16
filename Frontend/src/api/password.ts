import { postData } from 'api';
import { APIResponse } from 'interface/commonResponse';

export interface Password {
  old_password: string;
  new_password1: string;
  new_password2: string;
}

const PASSWORD_URL = {
  POST_PASSWORD: '/auth/password/change/',
};

export const postPassword = async (
  data: Password,
): Promise<APIResponse<any>> => {
  return await postData(PASSWORD_URL.POST_PASSWORD, data);
};
