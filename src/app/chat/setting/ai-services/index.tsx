import React, {useState} from 'react';

import dynamic from 'next/dynamic';
import {useDispatch, useSelector} from 'react-redux';

import {selectAiServicess} from '@/app/lib/features/aiServices/aiServicesSelector';
import {
  deletePluginById,
  handleChangeOpenPluginLogsDialog,
  handleChangeOpenRemovePluginDialog,
  handleChangeSelectedPlugin,
} from '@/app/lib/features/aiServices/aiServicesSlice';
import {AppDispatch} from '@/app/lib/store';
import {Button} from '@/components/buttons';
import {IPlugin} from '@/types';

import AiServicesDetails from './ServicesDetails';

// import {ShowPluginLogsModal, RemovePluginModal, UploadPluginModal} from '@/components/modals/pluginModals';

const DynamicRemovePluginModal = dynamic(
  async () => (await import('@/components/modals/pluginModals')).RemovePluginModal,
  {ssr: false, loading: () => null},
);
const DynamicUploadPluginModal = dynamic(
  async () => (await import('@/components/modals/pluginModals')).UploadPluginModal,
  {ssr: false, loading: () => null},
);
const DynamicShowPluginLogsModal = dynamic(
  async () => (await import('@/components/modals/pluginModals')).ShowPluginLogsModal,
  {ssr: false, loading: () => null},
);

const AiServices = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {selectedPlugin, openPluginLogsModal, openRemovePluginDialog} = useSelector(selectAiServicess);

  const [openAddPluginsModal, setOpenAddPluginsModal] = useState(false);

  const handleOpenExistedPluginModal = (plugin: IPlugin) => {
    dispatch(handleChangeSelectedPlugin(plugin));
    setOpenAddPluginsModal(true);
  };
  const handleOpenPluginLogsModal = (plugin: IPlugin) => {
    dispatch(handleChangeSelectedPlugin(plugin));
    dispatch(handleChangeOpenPluginLogsDialog(true));
  };
  const handleOpenUploadNewPlugin = () => {
    setOpenAddPluginsModal(true);
    dispatch(handleChangeSelectedPlugin(null));
  };
  const handleClosePluginLogsDialog = () => {
    dispatch(handleChangeOpenPluginLogsDialog(false));
    dispatch(handleChangeSelectedPlugin(null));
  };
  const handleConfirmDeletePlugin = async () => {
    if (!selectedPlugin) return;
    dispatch(deletePluginById(selectedPlugin));
  };

  return (
    <>
      <div className='flex flex-col w-full px-4 py-4'>
        <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
          <h1 className='text-lg leading-7 text-grey-900 font-semibold'>Plugins</h1>
          <Button
            className='!px-6 font-semibold text-sm !h-34-px'
            variant='primary'
            title='Upload plugin'
            onClick={handleOpenUploadNewPlugin}
          />
        </div>
        <div className='max-w-full'>
          <AiServicesDetails
            handleOpenExistedPluginModal={handleOpenExistedPluginModal}
            handleOpenPluginLogsModal={handleOpenPluginLogsModal}
          />
        </div>
      </div>
      {openAddPluginsModal && (
        <DynamicUploadPluginModal open={openAddPluginsModal} onClose={() => setOpenAddPluginsModal(false)} />
      )}
      {selectedPlugin && (
        <DynamicRemovePluginModal
          onDelete={handleConfirmDeletePlugin}
          open={openRemovePluginDialog}
          plugin={selectedPlugin}
          onClose={() => {
            dispatch(handleChangeOpenRemovePluginDialog(false));
            dispatch(handleChangeSelectedPlugin(null));
          }}
        />
      )}
      {selectedPlugin && (
        <DynamicShowPluginLogsModal
          open={openPluginLogsModal}
          plugin={selectedPlugin}
          onClose={handleClosePluginLogsDialog}
        />
      )}
    </>
  );
};

export default AiServices;
