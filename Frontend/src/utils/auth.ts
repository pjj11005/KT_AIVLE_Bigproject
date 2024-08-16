export const setToken = (token: string) => {
  sessionStorage.setItem('token', token);
};

export const getToken = () => {
  return sessionStorage.getItem('token');
};

export const removeToken = () => {
  sessionStorage.removeItem('token');
};

export const setRefreshToken = (refreshToken: string) => {
  sessionStorage.setItem('refreshToken', refreshToken);
};

export const getRefreshToken = () => {
  return sessionStorage.getItem('refreshToken');
};

export const removeRefreshToken = () => {
  sessionStorage.removeItem('refreshToken');
};

export const isAuthenticated = () => {
  return !!getToken();
};
