import axiosInstance from '../axiosConfig';
import axios from 'axios';
import { APIResponse } from '../interface/commonResponse';

export interface LogoutData {
  refresh: string | null;
}

const Logout_URL = {
  LOGOUT: '/auth/logout/',
};

export const logout = async (data: LogoutData) => {
  try {
    const formData = new FormData();

    formData.append('refresh', data.refresh ?? '');

    const response = await axiosInstance.post<APIResponse<null>>(
      Logout_URL.LOGOUT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('응답 에러:', error.response?.data);
    } else {
      console.error('요청 에러:', (error as Error).message);
    }
    throw error;
  }
};
