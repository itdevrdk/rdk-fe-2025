import Cookies from 'universal-cookie';

const cookies = new Cookies();

// Access Token
export const getToken = (): string => cookies.get('rdk-its');

export const setToken = (token: string) => {
  cookies.set('rdk-its', token, { path: '/' });
};

export const removeToken = () => cookies.remove('rdk-its', { path: '/' });

// Refresh Token
export const getRefreshToken = (): string => cookies.get('rdk-its-refresh');

export const setRefreshToken = (token: string) => {
  cookies.set('rdk-its-refresh', token, { path: '/' });
};

export const removeRefreshToken = () =>
  cookies.remove('rdk-its-refresh', { path: '/' });
