import axios, { AxiosRequestConfig } from 'axios';

export const baseURL = 'http://localhost:8080' || '';

const config: AxiosRequestConfig = {
  baseURL,
  withCredentials: true,
  timeout: 1000 * 60, // 1 min
  timeoutErrorMessage: 'Request timeout 💣',
};

export const defaultAxios = axios.create(config);

defaultAxios.interceptors.response.use(
  function (response) {
    return response;
  },

  function (error) {
    const code = error.code;
    const status = error.response?.status;

    if (code === 'ECONNABORTED' || status === 408) console.info('요청이 만료되었습니다.');

    return Promise.reject(error);
  }
);
