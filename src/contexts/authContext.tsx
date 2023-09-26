'use client';

import React, {PropsWithChildren, useEffect, useState} from 'react';

import {useRouter} from 'next/navigation';
import {toast} from 'react-hot-toast';

import {useApiClient} from '@/hooks';
import {useAuthStore} from '@/store';
import {IRegisterPayload, IUpdateUserPayload} from '@/types/auth';
import {IUser} from '@/types/user';

import {getProfile, login, register, updateUserProfile, updateUserProfilePic} from '../services/auth.service';

interface IAuthContext {
  isAuthenticated: boolean;
  user: IUser | null;
  setUser: (key: IUser | null) => void;
  loading: boolean;
  authLoading: boolean;
  onLogin: (email: string, password: string) => void;
  onRegister: (payload: IRegisterPayload) => void;
  onUpdateProfile: (payload: IUpdateUserPayload) => void;
  onUpdateProfilePicture: (payload: FormData) => void;
  onLogout: () => void;
}

const AuthContext = React.createContext<IAuthContext>(null!);

const AuthProvider = ({children}: PropsWithChildren) => {
  const router = useRouter();
  const {authData, setAuthData} = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const {setAxiosConfiguration} = useApiClient();

  useEffect(() => {
    setAuthLoading(true);
    setIsAuthenticated(!!authData?.id);

    if (!authData) {
      setUser(null);
      setAuthLoading(false);
    } else {
      setAxiosConfiguration();
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
        setLoading(false);
        const authData = res.data;
        setAuthData(authData);
        localStorage.setItem('token', authData.id);
        toast.success('Login successful.');
        router.refresh();
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response?.data?.error);
      });
  };

  const handleRegister = (payload: IRegisterPayload) => {
    setLoading(true);
    register(payload)
      .then(() => {
        setLoading(false);
        toast.success('Signup success! Please login again');
        router.push('login');
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response?.data?.error);
      });
  };

  const handleUpdateUserProfilePicture = (payload: FormData) => {
    setLoading(true);
    if (authData) {
      updateUserProfilePic(authData.user_id, payload)
        .then(() => {
          toast.success('successfully updated');
          // setUser({...res.data, roles: authData.data.roles});
  
        })
        .catch((error) => {
          toast.error(error.response?.data?.error);
        })
        .finally(() => setLoading(false));
    }

  }
  const handleUpdateUserProfile = (payload: IUpdateUserPayload) => {
    setLoading(true);
    if (authData) {
      updateUserProfile(authData.user_id, payload)
        .then((res) => {
          toast.success('successfully updated');
          setUser({...res.data, roles: authData.data.roles});

        })
        .catch((error) => {
          toast.error(error.response?.data?.error);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleLogout = () => {
    setAuthData(null);
    localStorage.removeItem('token');
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
    onUpdateProfilePicture: handleUpdateUserProfilePicture,
    onUpdateProfile: handleUpdateUserProfile,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => React.useContext(AuthContext);

export default AuthProvider;
