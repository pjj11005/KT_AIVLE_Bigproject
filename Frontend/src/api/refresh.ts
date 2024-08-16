import axiosInstance from '../axiosConfig';
import axios from 'axios';
import { APIResponse } from '../interface/commonResponse';

export interface RefreshTokenData {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  access_expiration: string;
}

const Refresh_URL = {
  REFRESH: '/auth/refresh/',
};

export const refreshAccessToken = async (
  data: RefreshTokenData,
): Promise<RefreshTokenResponse> => {
  try {
    const formData = new FormData();
    formData.append('refresh', data.refresh);

    const response = await axiosInstance.post<
      APIResponse<RefreshTokenResponse>
    >(Refresh_URL.REFRESH, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('응답 에러:', error.response?.data);
    } else {
      console.error('요청 에러:', (error as Error).message);
    }
    throw error;
  }
};
