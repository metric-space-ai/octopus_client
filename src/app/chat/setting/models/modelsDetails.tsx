/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect} from 'react';

import {PencilSquareIcon, TrashIcon} from '@heroicons/react/24/outline';
import {useDispatch, useSelector} from 'react-redux';

import {selectModels} from '@/app/lib/features/ollamaModels/modelsSelector';
import {getAllModels} from '@/app/lib/features/ollamaModels/modelsSlice';
import {AppDispatch} from '@/app/lib/store';
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
      <div className='mx-auto w-full max-w-[560px] rounded-lg bg-grey-0'>
        <div className='flex mb-2'>
          <div className='w-10'>
            <span className='font-medium text-xs leading-5 text-grey-600'>#</span>
          </div>
          <div className='w-60'>
            <span className='font-medium text-xs leading-5 text-grey-600'>Name</span>
          </div>
          <div className='w-28 ml-3 text-center'>
            <span className='font-medium text-xs leading-5 text-grey-600'>Staus</span>
          </div>
        </div>

        <div className='max-h-[420px] overflow-auto custom-scrollbar-thumb relative -mr-2'>
          {reloadModelsIsAvailable && (
            <div className='w-full'>
              <h2
                className='uppercase text-primary cursor-pointer text-center py-6 hover:underline'
                onClick={() => dispatch(getAllModels())}
              >
                try again
              </h2>
            </div>
          )}
          {/* <div className='flex justify-center py-3 items-center border-t'></div> */}

          {!models || models?.length === 0
            ? !isLoading && (
                <div className='flex justify-center py-3 items-center border-t'>
                  <h2 className='text-lg text-primary uppercase'>not found</h2>
                </div>
              )
            : models?.map((model, index) => (
                <div className='flex justify-start py-3 items-center border-t' key={`model-${model.id}`}>
                  <span className='w-10 block text-left text-sm'>{index + 1}</span>

                  <p className='w-60 text-xs leading-5 text-grey-900 font-semibold truncate ...' title={model.name}>
                    {model.name}
                  </p>
                  {/* <p
                      className='text-xxs leading-4 w-28 text-grey-800 font-medium pl-2 truncate ...'
                      title={document}
                    >
                      {document}
                    </p> */}
                  <p className='flex justify-center items-center w-28 text-xs leading-5 text-grey-800 font-semibold ml-3 truncate ...'>
                    {model.status}
                  </p>
                  <div className='flex ml-auto gap-3'>
                    <span
                      className='ml-auto p-1 mr-1 hover:bg-danger-500/10 cursor-pointer transition rounded-full'
                      onClick={() => handleOpenEditModelDialog(model)}
                    >
                      <PencilSquareIcon width={16} height={16} className='text-grey-900 cursor-pointer' />
                    </span>
                    <span
                      className='ml-auto p-1.5 hover:bg-danger-500/10 cursor-pointer transition rounded-full'
                      onClick={() => handleOpenDeleteModelDialog(model)}
                    >
                      <TrashIcon width={16} height={16} className='text-grey-800 cursor-pointer' />
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
                  <span className='bg-primary-400/10 h-7 w-7 flex justify-center items-center rounded-full'>
                    <BuildingOfficeIcon className=' text-primary-medium' width={12} height={12} />
                  </span>
                  <p className='text-xs leading-5 text-grey-900 font-normal ml-3'>First Sector</p>
                </div>
                <p className='text-xs leading-5 text-grey-600 font-normal'>Public tab</p>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure> */}
      </div>
    </div>
  );
}
