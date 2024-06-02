import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import CustomCheckbox from '@/components/custom-checkbox';
import {Spinner} from '@/components/spinner';
import {IAIFunctions} from '@/types';
import {ExclamationCircleIcon, InformationCircleIcon, TrashIcon} from '@heroicons/react/24/outline';
import {
  deletetAiFunctionsById,
  getAiFunctionsByPluginId,
  updatetAiFunctionsById,
} from '@/app/lib/features/aiServices/aiServicesSlice';
import {IconButton} from '@/components/buttons';
import {AppDispatch} from '@/app/lib/store';
import {useSelector} from 'react-redux';
import {selectAiServicess} from '@/app/lib/features/aiServices/aiServicesSelector';
import {Popover} from '@headlessui/react';

type Props = {
  serviceId: string;
  ai_functions: IAIFunctions[] | null | undefined;
};

const ServiceFunctions = ({ai_functions, serviceId}: Props) => {
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
          <div className='flex flex-wrap gap-3 items-start'>
            <CustomCheckbox
              active={func.is_enabled}
              onChange={(check: boolean) =>
                !updateAiFunctionIsLoading && !updateIsLoading
                  ? handleChangeAiFunctionActivation(funcIndex, func, check)
                  : {}
              }
              disabled={updateAiFunctionIsLoading && updateIsLoading}
              title={func.formatted_name}
              description={func.description}
              bodyClassName='flex-col !items-start'
            />
          </div>
          <div className='flex gap-6'>
            <Popover className={'relative flex items-center'}>
              <Popover.Button>
                <InformationCircleIcon className='w-4 h-4 text-content-grey-400 hover:text-content-black cursor-pointer transition-colors duration-150' />
              </Popover.Button>
              <Popover.Panel
                className={
                  'bg-content-grey-900 py-3 px-8 absolute shadow-md shadow-content-black rounded-20 w-80 max-w-[80vw] -right-8 top-3 z-10'
                }
              >
                <p className='text-content-white text-sm font-poppins-light'>{func.generated_description}</p>
              </Popover.Panel>
            </Popover>
            <IconButton
              className='top-4 right-4 mr-5 bg-content-red-600/20 hover:bg-content-red-600/40'
              onClick={() => handleDeleteServiceAiFunction(func)}
            >
              {deleteFunctionsIsLoading && deleteIsLoading ? (
                <Spinner />
              ) : (
                <TrashIcon className='w-4 h-4 text-content-primary' />
              )}
            </IconButton>
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
