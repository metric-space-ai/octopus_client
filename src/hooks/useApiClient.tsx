import axios from 'axios';
import {useRouter} from 'next/navigation';

import {useLocalStorage} from './useLocalStorage';

const apiHub = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // 'content-type': 'application/x-www-form-urlencoded'
  },
});

export const useApiClient = () => {
  const router = useRouter();
  const [, setAccessToken] = useLocalStorage<string | null>('accessToken', null);

  const setAxiosConfiguration = async (accessToken: string | null) => {
    // provide token with every request
    apiHub.interceptors.request.use(
      (config) => {
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
        if (error.response.status === 401) {
          setAccessToken(null);
          router.push('/auth/login');
        }
        return Promise.reject(error);
      },
    );
  };

  return {setAxiosConfiguration};
};

export default apiHub;
