import {Fragment, useState, useEffect, FormEventHandler} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Dialog, Transition, Listbox} from '@headlessui/react';
import {CheckIcon, ChevronDownIcon, XMarkIcon} from '@heroicons/react/24/outline';

import {Button, IconButton} from '../buttons';

import {AppDispatch} from '@/app/lib/store';
import {selectModels} from '@/app/lib/features/ollamaModels/modelsSelector';
import {UpdateModelById, createNewModel, getOllamaModels} from '@/app/lib/features/ollamaModels/modelsSlice';
import {nanoid} from '@reduxjs/toolkit';
import {Spinner} from '../spinner';
import classNames from 'classnames';
import {IModel} from '@/types';
import toast from 'react-hot-toast';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  selectedModel: IModel | null;
}

export const AddModelModalDialog = ({open, onClose, selectedModel}: ModalProps) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const {ollamaModels, ollamaIsLoading, createModelIsLoading, CreateHasError, errorMessage} = useSelector(selectModels);

  const [name, setName] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    if (selectedModel) {
      if (selectedModel.name === name) return toast.error('nothing has changed');
      dispatch(UpdateModelById({id: selectedModel.id, name}));
    } else {
      dispatch(createNewModel(name));
    }
  };

  useEffect(() => {
    if (ollamaModels && ollamaModels.length > 0 && !selectedModel) {
      setName(ollamaModels[0]);
    }
  }, [ollamaModels]);

  useEffect(() => {
    if (!ollamaModels) {
      dispatch(getOllamaModels());
    }
    if (selectedModel) {
      setName(selectedModel.name);
    }
  }, [open]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
    if (!CreateHasError && !createModelIsLoading) {
      handleClose();
    }
    if (!createModelIsLoading) {
      setLoading(false);
    }
  }, [createModelIsLoading, CreateHasError, errorMessage]);

  const handleClose = () => {
    onClose();
    setLoading(false);
  };
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog className='relative z-10' as='div' onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-grey-900/50 transition-opacity' />
          </Transition.Child>
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform border border-content-primary bg-grey-100 px-10 py-10 rounded-xl align-middle shadow-xl transition-all'>
                  <div className='flex justify-between items-start mb-6'>
                    <Dialog.Title
                      as='h3'
                      className='text-2xl font-semibold text-grey-900 text-left'
                    >
                      {selectedModel ? 'Update model' : 'Add a new model'}
                    </Dialog.Title>
                    <IconButton className='top-4 right-4' onClick={handleClose}>
                      <XMarkIcon className='w-5 h-5 text-content-primary' />
                    </IconButton>
                  </div>
                  <form className='flex flex-col gap-5' onSubmit={onSubmit}>
                    <Listbox value={name} onChange={(value) => setName(value)}>
                      <div className='relative mt-1'>
                        <Listbox.Button
                          className={({open}) =>
                            classNames(
                              'relative w-full cursor-default bg-grey-0 py-2 pl-5 pr-10 text-left text-content-primary',
                              !open && 'rounded-5xl',
                              open && 'rounded-t-xl',
                            )
                          }
                        >
                          <div className='flex items-center gap-2'>
                            {ollamaIsLoading && <Spinner className='h-6 flex items-center' />}
                            <span className='w-ful truncate ... text-base text-grey-800'>{`Name: ${name}`}</span>
                          </div>
                          <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                            <ChevronDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave='transition ease-in duration-100'
                          leaveFrom='opacity-100'
                          leaveTo='opacity-0'
                        >
                          <Listbox.Options className='absolute max-h-60 w-full rounded-b-2xl bg-grey-0 py-1 text-content-primary pr-2 overflow-hidden'>
                            <div className='max-h-58 custom-scrollbar-thumb relative -mr-1'>
                              {ollamaModels?.map((model, tabIdx) => (
                                <Listbox.Option
                                  key={nanoid(8)}
                                  className={({active}) =>
                                    `relative select-none py-2 pl-10 pr-4 text-left items-center ${
                                      active ? 'bg-grey-100' : 'text-gray-900'
                                    }`
                                  }
                                  value={model}
                                >
                                  {({selected}) => (
                                    <>
                                      <span className='block truncate'>{model}</span>
                                      {selected ? (
                                        <span className='absolute inset-y-0 left-0 flex pl-3 text-content-primary items-center'>
                                          <CheckIcon className='h-5 w-5' aria-hidden='true' />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </div>
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>

                    <div className='flex gap-2 pt-1.5'>
                      <Button
                        className='w-1/2 !h-10 border'
                        variant='transparent'
                        title={`Cancel`}
                        disabled={loading}
                        onClick={handleClose}
                        type='button'
                      />
                      <Button
                        className='w-1/2 !h-10'
                        variant='primary'
                        title={!loading ? (selectedModel ? `Update Model` : `Add a new Model`) : ''}
                        loading={loading}
                        disabled={loading || selectedModel?.name === name}
                        type='submit'
                      />
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
