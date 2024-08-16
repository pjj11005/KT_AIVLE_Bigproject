import { getData, patchData } from 'api';
import { APIResponse } from 'interface/commonResponse';

export const PROFILE_URL = {
  PROFILE_LIST: 'auth/profile/',
};

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: '인턴' | '사원' | '관리자';
  avatar?: string;
  password: string;
}

export const getProfile = async (): Promise<Profile> => {
  const profileList: APIResponse<Profile> = await getData(
    PROFILE_URL.PROFILE_LIST,
  );
  return profileList.result;
};

export const patchProfile = async (formData: FormData): Promise<Profile> => {
  const profileResponse: APIResponse<Profile> = await patchData(
    PROFILE_URL.PROFILE_LIST,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return profileResponse.result;
};
