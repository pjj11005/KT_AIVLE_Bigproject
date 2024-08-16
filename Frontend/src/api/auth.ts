import {
  LoginForm,
  LoginResponse,
} from '../pages/Login/Interface/LoginInterface';
import { getData, handleError, postData } from './index';
import { APIResponse } from '../interface/commonResponse';
import axios from '../axiosConfig';
import { LogoutData } from './logout';
import axiosInstance from '../axiosConfig';

const AUTH_URL = {
  LOGIN: '/auth/login/',
  LOGOUT: '/auth/logout/',
};

export const login = async (loginForm: LoginForm) => {
  try {
    const response = await axios.post<APIResponse<LoginResponse>>(
      `http://localhost:8000/api${AUTH_URL.LOGIN}`, //로컬
      //   `http://54.180.160.39:8000/api${AUTH_URL.LOGIN}`, //웹서버
      loginForm,
    );

    return response.data.result;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const logout = async (data: LogoutData) => {
  try {
    const formData = new FormData();
    formData.append('refresh', data.refresh ?? '');

    const response = await axiosInstance.post<APIResponse<null>>(
      `http://localhost:8000/api${AUTH_URL.LOGOUT}`, //로컬
      // `http://54.180.160.39:8000/api${AUTH_URL.LOGOUT}`,  //웹서버
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('응답 에러:', error.response?.data);
    } else {
      console.error('요청 에러:', (error as Error).message);
    }
    throw new Error(handleError(error));
  }
};

export const fetchUserInfo = async (token: string) => {
  try {
    const response = await getData('/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.result;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching user info:', error);
    } else {
      console.error('Error fetchUserInfo');
    }
    throw error;
  }
};
