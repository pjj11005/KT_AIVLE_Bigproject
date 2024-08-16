import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // 백엔드 서버 URL을 여기에 지정

export const sendResetEmail = async (email: string): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/password/reset/`,
      { email },
    );
    return (
      response.data.result.detail === 'Password reset e-mail has been sent.'
    );
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw error;
  }
};

export const resetPassword = async (
  uid: string,
  token: string,
  newPassword: string,
): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/password/reset/confirm/`,
      {
        uid,
        token,
        new_password1: newPassword,
        new_password2: newPassword,
      },
    );

    return (
      response.data.result.detail ===
      'Password has been reset with the new password.'
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};
