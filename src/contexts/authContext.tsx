'use client';

import React, {PropsWithChildren, useEffect, useState} from 'react';

import {useRouter} from 'next/navigation';
import {toast} from 'react-hot-toast';

import {useApiClient, useLocalStorage} from '@/hooks';
import {IAuthData, IRegisterPayload} from '@/types/auth';
import {IUser} from '@/types/user';

import {getProfile, login, register} from '../services/auth.service';

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
  const [authData, setAuthData] = useLocalStorage<IAuthData | null>('authToken', null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const {setAxiosConfiguration} = useApiClient();

  useEffect(() => {
    setAuthLoading(true);
    setAxiosConfiguration(authData?.id ?? null);
    setIsAuthenticated(!!authData?.id);

    if (!authData) {
      setUser(null);
      setAuthLoading(false);
      router.push('/auth/login');
    } else {
      getProfile(authData.user_id)
        .then((res) => {
          setUser({...res.data, roles: authData.data.roles});
          setAuthLoading(false);
        })
        .catch(() => {
          setAuthLoading(false);
        });
    }
  }, [authData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = (email: string, password: string) => {
    setLoading(true);
    login(email, password)
      .then((res) => {
        const authData = res.data;
        setAuthData(authData);
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
        const authData = res.data;
        setAuthData(authData);
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
    setAuthData(null);
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
