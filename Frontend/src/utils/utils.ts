import { removeRefreshToken, removeToken, setToken } from './auth';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { refreshAccessToken } from '../api/refresh';

export const getLocalStream = async (): Promise<MediaStream> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    return stream;
  } catch (error) {
    console.error('Error getting local stream:', error);
    throw error;
  }
};

interface JwtPayload {
  token_type: 'access' | 'refresh';
  exp: string;
  iat: string;
  jyi: string;
  user_id: string;
}

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

const isExpired = (exp: number): boolean => {
  return new Date().getTime() - exp - 60000 < 0;
};

export const reIssuanceJwtToken = async (token: string) => {
  const navigate = useNavigate();
  const decodedToken = jwtDecode<JwtPayload>(token);
  if (decodedToken && isExpired(decodedToken.exp as unknown as number)) {
    if (decodedToken.token_type === 'access') {
      refreshAccessToken({
        refresh: sessionStorage.getItem('refresh') || '',
      }).then((r) => {
        setToken(r.access);
        sessionStorage.setItem('token', r.access);
      });
    } else {
      removeRefreshToken();
      removeToken();
      navigate('/');
    }
  }
};

export function maskName(name: string): string {
  if (name.length < 2) {
    return '*'.repeat(name.length);
  } else if (name.length === 2) {
    return name.slice(0, 1) + '*';
  }
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

export function maskPhoneNumber(phoneNumber: string): string {
  const length = phoneNumber.length;
  if (length <= 4) {
    return '*'.repeat(length);
  }
  return (
    phoneNumber.slice(0, 3) + '*'.repeat(length - 6) + phoneNumber.slice(-3)
  );
}
