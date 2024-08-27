'use client';

import React, {PropsWithChildren, useEffect, useState} from 'react';

import {AxiosError} from 'axios';
import {useRouter} from 'next/navigation';
import {toast} from 'react-hot-toast';

import {useApiClient} from '@/hooks';
import {useAuthStore} from '@/store';
import {TCompany} from '@/types';
import {IRegisterPayload, IUpdateUserPayload, IUpdateUserProfilePayload} from '@/types/auth';
import {IUser, IUserProfile, IUserSetup} from '@/types/user';

import {
  checkSetupApi,
  getCompanyByIdApi,
  getProfile,
  getSingleUserById,
  login,
  register,
  updateCompanyByIdApi,
  updateSingleUserById,
  updateUserProfile,
  updateUserProfilePic,
} from '../services/auth.service';

interface IAuthContext {
  isAuthenticated: boolean;
  user: IUserProfile | null;
  setUser: (key: IUserProfile | null) => void;
  currentUser: IUser | null;
  currentUserCompany: TCompany | null;
  loading: boolean;
  authLoading: boolean;
  setupInfo: IUserSetup | undefined;
  setupInfoLoading: boolean;
  onCheckSetup: () => void;
  onLogin: (email: string, password: string) => void;
  onRegister: (payload: IRegisterPayload) => void;
  onUploadPlugin: (payload: FormData) => void;
  onUpdateProfile: (payload: IUpdateUserProfilePayload) => void;
  companyIsLoading: boolean;
  getCurrentUserCompany: () => void;
  putCurrentUserCompany: (
    payload: {
      id: TCompany['id'];
    } & Partial<Pick<TCompany, 'address' | 'name' | 'custom_style' | 'allowed_domains'>>,
    // Pick<TCompany, 'id' | 'address' | 'name' | 'custom_style' | 'allowed_domains'>,
  ) => void;
  onUpdateSingleUser: (payload: IUpdateUserPayload) => void;
  getCurrentUser: () => void;
  onUpdateProfilePicture: (payload: FormData) => void;
  onLogout: () => void;
}
const defaultAuthContext: IAuthContext = {
  isAuthenticated: false,
  user: null,
  setUser: (key) => console.warn('setUser function not implemented', {key}),
  currentUser: null,
  currentUserCompany: null,
  loading: false,
  authLoading: false,
  setupInfo: undefined,
  setupInfoLoading: false,
  onCheckSetup: () => console.warn('onCheckSetup function not implemented'),
  onLogin: (email, password) => console.warn('onLogin function not implemented', {password, email}),
  onRegister: (payload) => console.warn('onRegister function not implemented', payload),
  onUploadPlugin: (payload) => console.warn('onUploadPlugin function not implemented', payload),
  onUpdateProfile: (payload) => console.warn('onUpdateProfile function not implemented', payload),
  companyIsLoading: false,
  getCurrentUserCompany: () => console.warn('getCurrentUserCompany function not implemented'),
  putCurrentUserCompany: (payload) => console.warn('putCurrentUserCompany function not implemented', payload),
  onUpdateSingleUser: (payload) => console.warn('onUpdateSingleUser function not implemented', payload),
  getCurrentUser: () => console.warn('getCurrentUser function not implemented'),
  onUpdateProfilePicture: (payload) => console.warn('onUpdateProfilePicture function not implemented', payload),
  onLogout: () => console.warn('onLogout function not implemented'),
};

const AuthContext = React.createContext<IAuthContext>(defaultAuthContext);

const AuthProvider = ({children}: PropsWithChildren) => {
  const router = useRouter();
  const {authData, setAuthData} = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [currentUserCompany, setCurrentUserCompany] = useState<TCompany | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [setupInfo, setSetupInfo] = useState<IUserSetup>();
  const [setupInfoLoading, setSetupInfoLoading] = useState<boolean>(false);
  const [companyIsLoading, setCompanyIsLoading] = useState<boolean>(false);

  const {setAxiosConfiguration} = useApiClient();

  useEffect(() => {
    if (!user) return;
    const html = document.getElementsByTagName('html')[0];
    html.style.fontSize = `${user.text_size}px`;
  }, [user]);

  useEffect(() => {
    setAuthLoading(true);
    setIsAuthenticated(!!authData?.id);

    if (!authData) {
      setUser(null);
      setCurrentUser(null);
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

  const handleCheckSetup = async () => {
    setSetupInfoLoading(true);
    try {
      const {status, data} = await checkSetupApi();
      if (status === 200) {
        setSetupInfo(data);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.error);
      }
    } finally {
      setSetupInfoLoading(false);
    }
  };

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
      console.log({payload});
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
  const handleGetCurrentUserCompanyById = async () => {
    if (currentUser && currentUser.company_id) {
      setCompanyIsLoading(true);
      try {
        const companyData = await getCompanyByIdApi(currentUser.company_id);
        const {status, data} = companyData;
        if (status === 200) {
          setCurrentUserCompany(data);
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(err?.response?.data.error);
        }
      } finally {
        setCompanyIsLoading(false);
      }
    }
  };
  const handleUpdateCurrentUserCompanyById = async (
    payload: {
      id: TCompany['id'];
    } & Partial<Pick<TCompany, 'address' | 'name' | 'custom_style' | 'allowed_domains'>>,
  ) => {
    if (currentUser && currentUser.company_id) {
      setCompanyIsLoading(true);
      try {
        const {status, data} = await updateCompanyByIdApi(payload);
        if (status === 200) {
          setCurrentUserCompany(data);
          if (payload.custom_style) {
            toast.success('The template has been successfully updated.');
          } else {
            toast.success('Settings updated successfully');
          }
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(err?.response?.data.error);
        }
      } finally {
        setCompanyIsLoading(false);
      }
    }
  };

  const handleGetCurrentUserById = async () => {
    setLoading(true);
    if (authData) {
      try {
        const singleUserData = await getSingleUserById(authData.user_id);
        const {status, data} = singleUserData;
        if (status === 200) {
          setCurrentUser(data);
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
          setCurrentUser(data);
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
    currentUser,
    currentUserCompany,
    loading,
    authLoading,
    setupInfo,
    setupInfoLoading,
    companyIsLoading,
    onLogin: handleLogin,
    onCheckSetup: handleCheckSetup,
    onRegister: handleRegister,
    onUploadPlugin: handleUploadNewPlugin,
    onUpdateProfilePicture: handleUpdateUserProfilePicture,
    onUpdateProfile: handleUpdateUserProfile,
    getCurrentUserCompany: handleGetCurrentUserCompanyById,
    putCurrentUserCompany: handleUpdateCurrentUserCompanyById,
    getCurrentUser: handleGetCurrentUserById,
    onUpdateSingleUser: handleUpdateSingleUserById,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => React.useContext(AuthContext);

export default AuthProvider;
