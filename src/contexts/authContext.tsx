'use client';

import React, {PropsWithChildren, useEffect, useState} from 'react';

import {useRouter} from 'next/navigation';
import {toast} from 'react-hot-toast';

import {useApiClient} from '@/hooks';
import {useAuthStore} from '@/store';
import {IRegisterPayload, IUpdateUserPayload, IUpdateUserProfilePayload} from '@/types/auth';
import {IUser, IUserProfile} from '@/types/user';

import {
  getProfile,
  getSingleUserById,
  login,
  register,
  updateSingleUserById,
  updateUserProfile,
  updateUserProfilePic,
} from '../services/auth.service';
import {AxiosError} from 'axios';
import {IPlugin} from '@/types/plugin';

interface IAuthContext {
  isAuthenticated: boolean;
  user: IUserProfile | null;
  setUser: (key: IUserProfile | null) => void;
  singleUser: IUser | null;
  loading: boolean;
  authLoading: boolean;
  onLogin: (email: string, password: string) => void;
  onRegister: (payload: IRegisterPayload) => void;
  onUploadPlugin: (payload: FormData) => void;
  onUpdateProfile: (payload: IUpdateUserProfilePayload) => void;
  onUpdateSingleUser: (payload: IUpdateUserPayload) => void;
  getSingleUser: () => void;
  onUpdateProfilePicture: (payload: FormData) => void;
  onLogout: () => void;
}

const AuthContext = React.createContext<IAuthContext>(null!);

const AuthProvider = ({children}: PropsWithChildren) => {
  const router = useRouter();
  const {authData, setAuthData} = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [singleUser, setSingleUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const {setAxiosConfiguration} = useApiClient();

  useEffect(() => {
    if (!user) return;
    let html = document.getElementsByTagName('html')[0];
    html.style.fontSize = `${user.text_size}px`;
  }, [user]);

  useEffect(() => {
    setAuthLoading(true);
    setIsAuthenticated(!!authData?.id);

    if (!authData) {
      setUser(null);
      setSingleUser(null);
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

  const handleUploadNewPlugin = async (payload: FormData) => {
    setLoading(true);
    try {
      // // const {status, data} = await uploadNewPlugin(payload);
      // if (status === 201) {
      //   setSelectedPlugin(data);
      //   toast.success('successfully updated');
      // }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
        // toast.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserProfilePicture = (payload: FormData) => {
    setLoading(true);
    if (authData) {
      updateUserProfilePic(authData.user_id, payload)
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
  const handleUpdateUserProfile = (payload: IUpdateUserProfilePayload) => {
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
  const handleGetSingleUserById = async () => {
    setLoading(true);
    if (authData) {
      try {
        const singleUserData = await getSingleUserById(authData.user_id);
        const {status, data} = singleUserData;
        if (status === 200) {
          setSingleUser(data);
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(err?.response?.data.error);
          // toast.error(err);
        }
      }
    }
    setLoading(false);
  };

  const handleUpdateSingleUserById = async (payload: IUpdateUserPayload) => {
    setLoading(true);
    if (authData) {
      try {
        const singleUserData = await updateSingleUserById(authData.user_id, payload);
        const {status, data} = singleUserData;
        if (status === 200) {
          toast.success('email successfully updated');
          setSingleUser(data);
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(err?.response?.data.error);
          // toast.error(err);
        }
      }
    }
    setLoading(false);
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
    singleUser,
    loading,
    authLoading,
    onLogin: handleLogin,
    onRegister: handleRegister,
    onUploadPlugin: handleUploadNewPlugin,
    onUpdateProfilePicture: handleUpdateUserProfilePicture,
    onUpdateProfile: handleUpdateUserProfile,
    getSingleUser: handleGetSingleUserById,
    onUpdateSingleUser: handleUpdateSingleUserById,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => React.useContext(AuthContext);

export default AuthProvider;
