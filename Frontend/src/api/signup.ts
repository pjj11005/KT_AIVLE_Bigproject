import axios from 'axios';
import { APIResponse } from 'interface/commonResponse';

export interface SignUpFormData {
  name: string;
  email: string;
  password1: string;
  password2: string;
  phone: string;
}

const Sign_URL = {
  REGISTER: '/auth/register/',
};

export const signupRegister = async (data: SignUpFormData) => {
  try {
    const dataToSend = {
      ...data,
      name: data.name.trim() || 'user',
    };

    const response = await axios.post<APIResponse<null>>(
      // `http://54.180.160.39:8000/api${Sign_URL.REGISTER}`, //웹서버
      `http://localhost:8000/api${Sign_URL.REGISTER}`, //로컬

      dataToSend,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Server responded with:', error.response?.data);
      throw new Error(
        'Error during registration: ' + error.response?.data?.message ||
          error.message,
      );
    } else if (error instanceof Error) {
      throw new Error('Error during registration: ' + error.message);
    } else {
      throw new Error('Error during registration: An unknown error occurred');
    }
  }
};
