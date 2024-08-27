'use client';

import React, {PropsWithChildren, useState} from 'react';

import {AxiosError} from 'axios';
import {toast} from 'react-hot-toast';

import {
  createTeamMemberApi,
  deleteTeamMemberApi,
  getAllTeamMembersApi,
  updateTeamMemberApi,
} from '@/services/settings.service';
import {ICreateUser, IUser} from '@/types';

interface ISettingsContext {
  teamMembers: IUser[] | null;
  setTeamMembers: React.Dispatch<React.SetStateAction<IUser[] | null>>;
  getTeamMembers: () => void;
  updateTeamMember: (payload: IUser) => void;
  addNewTeamMember: (payload: ICreateUser) => void;
  deleteTeamMember: (payload: string) => void;
  settingIsLoading: boolean;
  deleteMemberLoading: boolean;
}

// Provide a default value to avoid null assertions
const defaultContextValue: ISettingsContext = {
  teamMembers: null,
  setTeamMembers: () => {
    console.warn('setTeamMembers function not implemented');
  },
  getTeamMembers: () => {
    console.warn('getTeamMembers function not implemented');
  },
  updateTeamMember: (payload: IUser) => {
    console.warn('updateTeamMember function not implemented', payload);
  },
  addNewTeamMember: (payload: ICreateUser) => {
    console.warn('addNewTeamMember function not implemented', payload);
  },
  deleteTeamMember: (payload: string) => {
    console.warn('deleteTeamMember function not implemented', payload);
  },
  settingIsLoading: false,
  deleteMemberLoading: false,
};

const SettingsContext = React.createContext<ISettingsContext>(defaultContextValue);

const SettingsProvider = ({children}: PropsWithChildren) => {
  const [settingIsLoading, setSettingIsLoading] = useState<boolean>(false);
  const [deleteMemberLoading, setDeleteMemberLoading] = useState<boolean>(false);
  const [teamMembers, setTeamMembers] = useState<IUser[] | null>(null);

  const handleGetAllTeamMembers = async () => {
    setSettingIsLoading(true);
    try {
      const {status, data} = await getAllTeamMembersApi();
      if (status === 200) {
        setTeamMembers(data);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setSettingIsLoading(false);
    }
  };

  const updateTeamMember = async (payload: IUser) => {
    try {
      const {status, data} = await updateTeamMemberApi(payload);
      if (status === 200) {
        if (teamMembers) {
          const result = [...teamMembers].flatMap((member) => (member.id === payload.id ? data : member));
          setTeamMembers(result);
          toast.success(`Successful update.`);
        }
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    }
  };

  const addNewTeamMember = async (payload: ICreateUser) => {
    setSettingIsLoading(true);
    try {
      const {status, data} = await createTeamMemberApi(payload);
      if (status === 201) {
        if (teamMembers) {
          setTeamMembers((prev) => (prev ? [...prev, data] : [data]));
        }
        toast.success(`(${payload.name}) has successfully been added as a new user.`);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setSettingIsLoading(false);
    }
  };

  const deleteTeamMember = async (payload: string) => {
    setDeleteMemberLoading(true);
    if (teamMembers) {
      const backup = [...teamMembers];
      const result = [...teamMembers].filter((member) => member.id !== payload);
      setTeamMembers(result);
      try {
        const {status} = await deleteTeamMemberApi(payload);
        if (status === 204) {
          toast.success(`user has successfully been removed.`);
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(err?.response?.data.error);
          setTeamMembers(backup);
        }
      } finally {
        setDeleteMemberLoading(false);
      }
    }
  };

  const value = {
    teamMembers,
    setTeamMembers,
    getTeamMembers: handleGetAllTeamMembers,
    updateTeamMember,
    addNewTeamMember,
    settingIsLoading,
    deleteMemberLoading,
    deleteTeamMember,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettingsContext = () => React.useContext(SettingsContext);

export default SettingsProvider;
