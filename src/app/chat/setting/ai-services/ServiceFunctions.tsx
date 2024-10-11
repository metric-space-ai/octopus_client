/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {Popover} from '@headlessui/react';
import {InformationCircleIcon, TrashIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {useDispatch, useSelector} from 'react-redux';

import {selectAiServicess} from '@/app/lib/features/aiServices/aiServicesSelector';
import {
  deletetAiFunctionsById,
  getAiFunctionsByPluginId,
  updatetAiFunctionsById,
} from '@/app/lib/features/aiServices/aiServicesSlice';
import {AppDispatch} from '@/app/lib/store';
import {IconButton} from '@/components/buttons';
import CustomCheckbox from '@/components/custom-checkbox';
import {Spinner} from '@/components/spinner';
import {IAIFunctions} from '@/types';

type Props = {
  serviceId: string;
  ai_functions: IAIFunctions[] | null | undefined;
  changeIsDisabled?: boolean;
};

const ServiceFunctions = ({ai_functions, serviceId, changeIsDisabled = false}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);
  const [updateIsLoading, setUpdateIsLoading] = useState(false);
  const [aiFunctionsIsLoading, setAiFunctionsIsLoading] = useState(false);

  const {functionIsLoading, deleteFunctionsIsLoading, updateAiFunctionIsLoading} = useSelector(selectAiServicess);

  const handleDeleteServiceAiFunction = async (service_function: IAIFunctions) => {
    if (functionIsLoading) return;
    setDeleteIsLoading(true);
    dispatch(deletetAiFunctionsById(service_function));
  };

  const handleChangeAiFunctionActivation = async (funcIndex: number, serviceFunction: IAIFunctions, check: boolean) => {
    if (functionIsLoading) return;
    setUpdateIsLoading(true);
    dispatch(updatetAiFunctionsById({...serviceFunction, is_enabled: check}));
  };

  useEffect(() => {
    setAiFunctionsIsLoading(true);
    dispatch(getAiFunctionsByPluginId(serviceId));
  }, []);
  useEffect(() => {
    if (ai_functions) {
      setAiFunctionsIsLoading(false);
    }
  }, [ai_functions]);

  useEffect(() => {
    if (!deleteFunctionsIsLoading) {
      setDeleteIsLoading(false);
    }
    if (!updateAiFunctionIsLoading) {
      setUpdateIsLoading(false);
    }
  }, [updateAiFunctionIsLoading, deleteFunctionsIsLoading]);

  return (
    <div className='flex flex-col gap-3 pl-9 w-full'>
      {ai_functions?.map((func, funcIndex) => (
        <div key={func.id} className='flex w-full items-center justify-between'>
          <div
            className={classNames('flex flex-wrap gap-3 items-start', changeIsDisabled && 'pointer-events-none')}
            title={changeIsDisabled ? "when the service type is 'System', it cannot be changed" : ''}
          >
            <CustomCheckbox
              active={func.is_enabled}
              onChange={(check: boolean) =>
                !updateAiFunctionIsLoading && !updateIsLoading
                  ? handleChangeAiFunctionActivation(funcIndex, func, check)
                  : {}
              }
              disabled={changeIsDisabled || (updateAiFunctionIsLoading && updateIsLoading)}
              title={func.formatted_name}
              description={func.description}
              bodyClassName='flex-col !items-start'
              className={classNames('', changeIsDisabled && '[&_.c-custom-checkbox]:hidden')}
            />
          </div>
          <div className='flex gap-6'>
            {func.generated_description && (
              <Popover className={'relative flex items-center'}>
                <Popover.Button>
                  <InformationCircleIcon className='w-4 h-4 text-grey-400 hover:text-grey-900 cursor-pointer transition-colors duration-150' />
                </Popover.Button>
                <Popover.Panel
                  className={
                    'bg-grey-800 py-3 px-8 absolute shadow-md shadow-grey-900 rounded-xl w-80 max-w-[80vw] -right-8 top-3 z-10'
                  }
                >
                  <p className='text-grey-0 text-sm font-light'>{func.generated_description}</p>
                </Popover.Panel>
              </Popover>
            )}
            {!changeIsDisabled && (
              <IconButton
                className='top-4 right-4 mr-5 bg-danger-500/20 hover:bg-danger-500/40'
                onClick={() => handleDeleteServiceAiFunction(func)}
              >
                {deleteFunctionsIsLoading && deleteIsLoading ? (
                  <Spinner />
                ) : (
                  <TrashIcon className='w-4 h-4 text-content-primary' />
                )}
              </IconButton>
            )}
          </div>
        </div>
      ))}
      {aiFunctionsIsLoading && (
        <>
          <div className='flex justify-between pl-9 w-full items-center animate-pulse'>
            <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-52'></div>

            <div className='ml-auto bg-gray-300 rounded-full dark:bg-gray-600 w-4 h-4 mr-5'></div>
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceFunctions;
