import {Button} from '@/components/buttons';
import React, {useEffect, useState} from 'react';
import ModelsData from './modelsDetails';
import {useSettingsContext} from '@/contexts/settingsContext';
import {CreateNewTabModal, DeleteModelModalDialog} from '@/components/modals';

import {useChatStore} from '@/store';
import {AddSectorModal} from '@/components/modals/AddSectorsModal';
import {AddModelModalDialog} from '@/components/modals/AddModelModalDialog';
import { IModel } from '@/types';

type Props = {};

const Models = (props: Props) => {
  const [addModelsModal, setAddOllamaModelsModal] = useState(false);
  const [deleteModelsModal, setDeleteModelsModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState<IModel | null>(null);
  const {settingIsLoading} = useSettingsContext();

  const handleCloseModelDialog = () => {
    setSelectedModel(null);
    setAddOllamaModelsModal(false);
  };
  const handleOpenEditModelDialog = (model: IModel) => {
    setSelectedModel(model);
    setAddOllamaModelsModal(true);
  };

  const handleOpenDeleteModelDialog = (model: IModel) => {
    setSelectedModel(model);
    setDeleteModelsModal(true);
  };
  const handleCloseDeleteModelDialog = () => {
    setSelectedModel(null);
    setDeleteModelsModal(false);
  };

  // useEffect(() => {
  //   getModels();
  // }, []);

  return (
    <>
      <div className='w-full pt-[84px] flex flex-col px-6'>
        <div className='flex flex-col w-full max-w-[608px] px-6 py-4 rounded-20 bg-white'>
          <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
            <h1 className='text-lg leading-7 text-content-black font-poppins-semibold'>Models</h1>
            <Button
              className='!px-6 font-poppins-semibold text-sm !h-34-px'
              variant='primary'
              title='Add Model'
              onClick={() => setAddOllamaModelsModal(true)}
            />
          </div>
          <div className='max-w-full'>
            <ModelsData handleOpenDeleteModelDialog={handleOpenDeleteModelDialog} handleOpenEditModelDialog={handleOpenEditModelDialog} />
          </div>
        </div>
      </div>
      <AddModelModalDialog open={addModelsModal} onClose={handleCloseModelDialog} selectedModel={selectedModel} />
      <DeleteModelModalDialog model={selectedModel} open={deleteModelsModal} onClose={handleCloseDeleteModelDialog} />
    </>
  );
};

export default Models;
