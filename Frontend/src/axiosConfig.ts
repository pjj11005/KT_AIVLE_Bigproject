import axios from 'axios';
import {
  getToken,
  getRefreshToken,
  setToken,
  removeToken,
  removeRefreshToken,
} from './utils/auth';
import { refreshAccessToken } from './api/refresh';

axios.defaults.baseURL = 'http://localhost:8000/api'; //로컬
// axios.defaults.baseURL = 'http://54.180.160.39:8000/api'; //웹서버

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  async (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axios;
