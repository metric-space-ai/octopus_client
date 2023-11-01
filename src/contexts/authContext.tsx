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
  getAllPluginsApi,
  getPluginByIdApi,
  getAiFunctionsByServiceIdApi,
} from '../services/auth.service';
import {AxiosError} from 'axios';
import {IPlugin} from '@/types/plugin';
import {AI_SERVICES_SETUP_STATUS} from '@/constant';

interface IAuthContext {
  isAuthenticated: boolean;
  user: IUserProfile | null;
  setUser: (key: IUserProfile | null) => void;
  singleUser: IUser | null;
  selectedPlugin: IPlugin | null;
  reloadPluginAvailable: boolean;
  loading: boolean;
  authLoading: boolean;
  plugins: IPlugin[] | undefined;
  setPlugins: React.Dispatch<React.SetStateAction<IPlugin[] | undefined>>;
  onLogin: (email: string, password: string) => void;
  onRegister: (payload: IRegisterPayload) => void;
  onUploadPlugin: (payload: FormData) => void;
  onUpdateProfile: (payload: IUpdateUserProfilePayload) => void;
  onUpdateSingleUser: (payload: IUpdateUserPayload) => void;
  getSingleUser: () => void;
  getAllPlugins: () => void;
  getPluginById: (payload: string) => void;
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
  const [servicesFunctionIsChecked, setServicesFunctionIsChecked] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [reloadPluginAvailable, setReloadPluginAvailable] = useState<boolean>(false);
  const [selectedPlugin, setSelectedPlugin] = useState<IPlugin | null>(null);
  const [plugins, setPlugins] = useState<IPlugin[]>();
  const {setAxiosConfiguration} = useApiClient();

  // useEffect(() => {
  //   if (!user) return;
  //   let html = document.getElementsByTagName('html')[0];
  //   html.style.fontSize = `${user.text_size}px`;
  // }, [user]);

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

  useEffect(() => {
    if (plugins && plugins.length > 0 && !servicesFunctionIsChecked) {
      setServicesFunctionIsChecked(true);
      handleGetPluginFunctions(plugins);
    }
  }, [plugins]);

  const handleGetPluginFunctions = async (inputPlugins: IPlugin[]) => {
    console.log({inputPlugins});
    setLoading(true);

    if (inputPlugins) {
      const result: IPlugin[] | [] = [];
      for (const plugin of inputPlugins) {
        console.log({plugin});
        const {id, is_enabled, setup_status} = plugin;
        if (plugin.ai_functions === undefined && setup_status === AI_SERVICES_SETUP_STATUS.Performed) {
          try {
            const {status, data} = await getAiFunctionsByServiceIdApi(id);
            if (status === 200) {
              const resultPlugin: IPlugin = {...plugin, ai_functions: data.length > 0 ? data : null};

              result.push(resultPlugin as never);
            }
          } catch (err) {
            if (err instanceof AxiosError) {
              toast.error(err?.response?.data.error);
            }
            result.push({...plugin, ai_functions: null} as never);
          } finally {
          }
        } else {
          result.push({...plugin, ai_functions: null} as never);
        }
      }
      setPlugins(result);
    } else {
      setPlugins(inputPlugins);
    }
    setLoading(false);
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

  const handlegetAllPlugins = async () => {
    setLoading(true);
    try {
      const {status, data} = await getAllPluginsApi();
      if (status === 200) {
        // setPlugins(data);
        handleGetPluginFunctions(data);
        setReloadPluginAvailable(false);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(
          err?.response?.data.error
            ? err.response.data.error
            : 'It appears that something went wrong, so please try refreshing the page',
        );
        setReloadPluginAvailable(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGetPluginsById = async (payload: string) => {
    setLoading(true);
    try {
      const {status, data} = await getPluginByIdApi(payload);
      if (status === 200) {
        setSelectedPlugin(data);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setLoading(false);
    }
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

          // setUser({...res.data, roles: authData.data.roles});
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
    plugins,
    setPlugins,
    selectedPlugin,
    reloadPluginAvailable,
    loading,
    authLoading,
    onLogin: handleLogin,
    onRegister: handleRegister,
    getAllPlugins: handlegetAllPlugins,
    getPluginById: handleGetPluginsById,
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
