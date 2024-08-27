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

let isAxiosConfigured = false;

export const useApiClient = () => {
  const {setAuthData} = useAuthStore();

  const setAxiosConfiguration = async () => {
    if (isAxiosConfigured) return; // Avoid setting up interceptors multiple times

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
          toast.error('You do not have sufficient permissions to make this request.');
        }
        return Promise.reject(error);
      },
    );

    isAxiosConfigured = true; // Mark Axios as configured
  };

  return {setAxiosConfiguration};
};

export default apiHub;
