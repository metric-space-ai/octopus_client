/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';

import {Disclosure} from '@headlessui/react';
import {AxiosError} from 'axios';
import toast from 'react-hot-toast';
import {useDispatch, useSelector} from 'react-redux';

import {selectAiServicess} from '@/app/lib/features/aiServices/aiServicesSelector';
import {
  changePluginActivitiesByPluginId,
  getAllPlugins,
  // handleChangeOpenPluginLogsDialog,
  handleChangeOpenRemovePluginDialog,
  handleChangeSelectedPlugin,
  putAllowedUsersForAiAccess,
} from '@/app/lib/features/aiServices/aiServicesSlice';
import {getAllTeamMembers} from '@/app/lib/features/teamMembers/teamMemberSlice';
import {selectTeamMembers} from '@/app/lib/features/teamMembers/teamMembersSelector';
import {AppDispatch} from '@/app/lib/store';
import {putPluginConfigurationColorApi} from '@/services/settings.service';
import {IPlugin, IPluginActivation, IUser} from '@/types';

import ServiceDetailRow from './serviceDetailRow';

type Props = {
  handleOpenExistedPluginModal: (plugin: IPlugin) => void;
  handleOpenPluginLogsModal: (plugin: IPlugin) => void;
};

export default function AiServicesDetails({handleOpenExistedPluginModal, handleOpenPluginLogsModal}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const {entities: plugins, isLoading, reloadPluginIsAvailable} = useSelector(selectAiServicess);

  const {entities: allUsers, isLoading: usersIsLoading} = useSelector(selectTeamMembers);

  const [changeColorIsLoading, setChangeColorIsLoading] = useState(false);

  // const handleOpenEditPluginDialog = (plugin: IPlugin) => {
  //   dispatch(handleChangeOpenPluginLogsDialog(true));
  //   dispatch(handleChangeSelectedPlugin(plugin));
  // };
  const handleOpenDeletePluginModal = (plugin: IPlugin) => {
    dispatch(handleChangeSelectedPlugin(plugin));
    dispatch(handleChangeOpenRemovePluginDialog(true));
  };

  const handleChangeUserAiAccess = (plugin_id: string, allowedUsers: IUser[]) => {
    if (allowedUsers.length === 0) {
      dispatch(putAllowedUsersForAiAccess({plugin_id, allowedUsers: []}));
    } else {
      const userIds: string[] = allowedUsers.map((user) => user.id);

      dispatch(putAllowedUsersForAiAccess({plugin_id, allowedUsers: userIds}));
    }
  };

  const handleChangePluginActivation = async (plugin_id: string, check: boolean) => {
    if (!plugins) return;

    const payload: IPluginActivation = {operation: check ? 'Enable' : 'Disable', is_enabled: check};
    dispatch(changePluginActivitiesByPluginId({plugin_id, payload}));
  };

  const handleChangeserviceColor = async (payload: Pick<IPlugin, 'id' | 'color'>) => {
    setChangeColorIsLoading(true);
    try {
      const {status} = await putPluginConfigurationColorApi(payload);
      if (status === 200) {
        toast.success('service Background color changed.');
        // dispatch(handleChangeSelectedPlugin(data));
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setChangeColorIsLoading(false);
    }
  };
  useEffect(() => {
    dispatch(getAllPlugins());
    dispatch(getAllTeamMembers());
  }, []);

  return (
    <>
      <div className='w-full relative'>
        <div className='mx-auto custom-scrollbar-thumb'>
          <div className='flex mb-2 gap-1'>
            <div className='w-48 ml-3'>
              <span className='font-medium text-xs leading-5 text-grey-600'>Name</span>
            </div>
            {/* <div className='w-28'>
              <span className='font-medium text-xs leading-5 text-grey-600'>Size</span>
            </div> */}
            <div className='w-32 text-center'>
              <span className='font-medium text-xs leading-5 text-grey-600'>Users</span>
            </div>
            <div className='w-[104px] flex justify-center'>
              <span className='font-medium text-xs leading-5 text-grey-600 '>Status</span>
            </div>
            <div className='w-22 flex justify-center'>
              <span className='font-medium text-xs leading-5 text-grey-600'>On/Off</span>
            </div>
            <div className='w-[55px] flex justify-start'>
              <span className='font-medium text-xs leading-5 text-grey-600'>Color</span>
            </div>
          </div>

          <div className='h-full max-h-[280px] min-w-[570px] custom-scrollbar-thumb'>
            {reloadPluginIsAvailable && (
              <div className='w-full'>
                <h2
                  className='uppercase text-primary cursor-pointer text-center py-6 hover:underline'
                  onClick={() => getAllPlugins()}
                >
                  try again
                </h2>
              </div>
            )}
            {!plugins || plugins.length === 0
              ? !isLoading && (
                  <div className='flex justify-center py-3 items-center border-t'>
                    <h2 className='text-lg text-primary uppercase'>not found</h2>
                  </div>
                )
              : plugins.map((plugin) => (
                  <ServiceDetailRow
                    key={plugin.id}
                    plugin={plugin}
                    usersIsLoading={usersIsLoading}
                    allUsers={allUsers}
                    handleChangeUserAiAccess={handleChangeUserAiAccess}
                    handleChangePluginActivation={handleChangePluginActivation}
                    handleOpenExistedPluginModal={handleOpenExistedPluginModal}
                    handleOpenPluginLogsModal={handleOpenPluginLogsModal}
                    handleOpenDeletePluginModal={handleOpenDeletePluginModal}
                    handleChangeserviceColor={handleChangeserviceColor}
                    changeColorIsLoading={changeColorIsLoading}
                  />
                ))}
            {isLoading && !plugins && (
              <Disclosure>
                {() => (
                  <>
                    <div className='flex justify-start py-3 items-center animate-pulse'>
                      <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-52'></div>

                      <div className='w-24 mx-2 h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>
                      <div className='w-24  h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>
                      <div className='w-16 mx-2 h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>

                      <div className='ml-auto h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-5 mx-1.5'></div>
                    </div>
                  </>
                )}
              </Disclosure>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
