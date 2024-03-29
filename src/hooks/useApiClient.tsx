import axios from 'axios';
import {toast} from 'react-hot-toast';

import {useAuthStore} from '@/store';

const apiHub = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // 'content-type': 'application/x-www-form-urlencoded'
  },
});

export const useApiClient = () => {
  const {setAuthData} = useAuthStore();

  const setAxiosConfiguration = async () => {
    // provide token with every request
    apiHub.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken && config.headers) {
          config.headers['X-Auth-Token'] = `${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    apiHub.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isCancel(error)) {
          console.log('Request canceled');
        } else if (error.response?.status === 401) {
          setAuthData(null);
        } else if (error.response?.status === 403) {
          toast.error('No enough permission to make a request.');
        }
        return Promise.reject(error);
      },
    );
  };

  return {setAxiosConfiguration};
};

export default apiHub;

export const apiWaspHub = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WASP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // 'content-type': 'application/x-www-form-urlencoded'
  },
});
