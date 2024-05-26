import {useEffect} from 'react';
import {Disclosure} from '@headlessui/react';
import {useDispatch, useSelector} from 'react-redux';

import {
  BuildingOfficeIcon,
  TrashIcon,
  PencilSquareIcon,
  UserGroupIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

import {AppDispatch} from '@/app/lib/store';
import {selectModels} from '@/app/lib/features/ollamaModels/modelsSelector';
import {getAllModels, getOllamaModels} from '@/app/lib/features/ollamaModels/modelsSlice';
import {IModel} from '@/types';

type Props = {
  handleOpenDeleteModelDialog: (model: IModel) => void;
  handleOpenEditModelDialog: (model: IModel) => void;
};

export default function ModelsData({handleOpenDeleteModelDialog, handleOpenEditModelDialog}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const {entities: models, isLoading, reloadModelsIsAvailable} = useSelector(selectModels);

  useEffect(() => {
    dispatch(getAllModels());
  }, []);

  return (
    <div className='w-full'>
      <div className='mx-auto w-full max-w-[560px] rounded-2xl bg-white'>
        <div className='flex mb-2'>
          <div className='w-10'>
            <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>#</span>
          </div>
          <div className='w-60'>
            <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>Name</span>
          </div>
          <div className='w-28 ml-3 text-center'>
            <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>Staus</span>
          </div>
        </div>

        <div className='max-h-[420px] overflow-auto custom-scrollbar-thumb relative -mr-2'>
          {reloadModelsIsAvailable && (
            <div className='w-full'>
              <h2
                className='uppercase text-content-accent cursor-pointer text-center py-6 hover:underline'
                onClick={() => dispatch(getAllModels())}
              >
                try again
              </h2>
            </div>
          )}
          {/* <div className='flex justify-center py-3 items-center border-t border-content-grey-100'></div> */}

          {!models || models?.length === 0
            ? !isLoading && (
                <div className='flex justify-center py-3 items-center border-t border-content-grey-100'>
                  <h2 className='text-lg text-content-accent uppercase'>not found</h2>
                </div>
              )
            : models?.map((model, index) => (
                <div className='flex justify-start py-3 items-center border-t border-content-grey-100'>
                  <span className='w-10 block text-left text-sm'>{index + 1}</span>

                  <p
                    className='w-60 text-xs leading-5 text-content-black font-poppins-semibold truncate ...'
                    title={model.name}
                  >
                    {model.name}
                  </p>
                  {/* <p
                      className='text-xxs leading-4 w-28 text-content-grey-900 font-poppins-medium pl-2 truncate ...'
                      title={document}
                    >
                      {document}
                    </p> */}
                  <p className='flex justify-center items-center w-28 text-xs leading-5 text-content-grey-900 font-poppins-semibold ml-3 truncate ...'>
                    {model.status}
                  </p>
                  <div className='flex ml-auto gap-3'>
                    <span
                      className='ml-auto p-1 mr-1 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
                      onClick={() => handleOpenEditModelDialog(model)}
                    >
                      <PencilSquareIcon width={16} height={16} className='text-content-black cursor-pointer' />
                    </span>
                    <span
                      className='ml-auto p-1.5 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
                      onClick={() => handleOpenDeleteModelDialog(model)}
                    >
                      <TrashIcon width={16} height={16} className='text-content-grey-900 cursor-pointer' />
                    </span>
                  </div>
                </div>
              ))}
        </div>
        {isLoading && (
          <>
            <div className='flex justify-start py-3 items-center animate-pulse'>
              <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-80 ml-3'></div>

              <div className='w-28 ml-3 h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>
              {/* <div className='w-16 mx-2 h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div> */}

              {/* <div className='ml-auto h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-5 mx-1.5'></div> */}
            </div>
          </>
        )}

        {/* <Disclosure>
          {({open}) => (
            <>
              <Disclosure.Panel className='pl-5 flex justify-between items-center mt-2 h-12'>
                <div className='flex items-center'>
                  <span className='bg-content-accent-light-11 h-7 w-7 flex justify-center items-center rounded-full'>
                    <BuildingOfficeIcon className=' text-content-accent-hover' width={12} height={12} />
                  </span>
                  <p className='text-xs leading-5 text-content-black font-normal ml-3'>First Sector</p>
                </div>
                <p className='text-xs leading-5 text-content-grey-600 font-normal'>Public tab</p>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure> */}
      </div>
    </div>
  );
}
