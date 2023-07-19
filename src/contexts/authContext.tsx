'use client';

import React, {PropsWithChildren, useEffect, useState} from 'react';

import {useRouter} from 'next/navigation';
import {toast} from 'react-hot-toast';

import {useApiClient, useLocalStorage} from '@/hooks';
import {IRegisterPayload} from '@/types/auth';
import {IUser} from '@/types/user';

import {login, register} from '../services/auth.service';

interface IAuthContext {
  isAuthenticated: boolean;
  user: IUser | null;
  setUser: (key: IUser | null) => void;
  loading: boolean;
  authLoading: boolean;
  onLogin: (email: string, password: string) => void;
  onRegister: (payload: IRegisterPayload) => void;
  onLogout: () => void;
}

const AuthContext = React.createContext<IAuthContext>(null!);

const AuthProvider = ({children}: PropsWithChildren) => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useLocalStorage<string | null>('accessToken', null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const {setAxiosConfiguration} = useApiClient();

  useEffect(() => {
    setAuthLoading(true);
    setAxiosConfiguration(accessToken);
    setIsAuthenticated(!!accessToken);

    if (!accessToken) {
      setUser(null);
      setAuthLoading(false);
      router.push('/auth/login');
      return;
    } else {
      router.push('/chat');
    }
  }, [accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = (email: string, password: string) => {
    setLoading(true);
    login(email, password)
      .then((res) => {
        const token = res.data.id;
        setAccessToken(token);
        toast.success('Login successful.');
        setLoading(false);
        router.push('/chat');
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
        setLoading(false);
      });
  };

  const handleRegister = (payload: IRegisterPayload) => {
    setLoading(true);
    register(payload)
      .then((res) => {
        const token = res.data.id;
        setAccessToken(token);
        setLoading(false);
        router.push('/chat');
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
        setLoading(false);
      });
  };

  const handleLogout = () => {
    setAccessToken(null);
    router.push('/auth/login');
  };

  const value = {
    isAuthenticated,
    user,
    setUser,
    loading,
    authLoading,
    onLogin: handleLogin,
    onRegister: handleRegister,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => React.useContext(AuthContext);

export default AuthProvider;
