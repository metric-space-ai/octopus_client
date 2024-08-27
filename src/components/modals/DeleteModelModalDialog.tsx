/* eslint-disable react-hooks/exhaustive-deps */
import {Fragment, useEffect, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import {useDispatch, useSelector} from 'react-redux';

import {selectModels} from '@/app/lib/features/ollamaModels/modelsSelector';
import {deleteModelById} from '@/app/lib/features/ollamaModels/modelsSlice';
import {AppDispatch} from '@/app/lib/store';
import {IModel} from '@/types';

import {Button, IconButton} from '../buttons';

interface ModalProps {
  model: IModel | null;
  open: boolean;
  onClose: () => void;
}

export const DeleteModelModalDialog = ({model, open, onClose}: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {deleteHasError, deleteModelIsLoading, errorMessage} = useSelector(selectModels);
  const [loading, setLoading] = useState(false);

  const onDelete = () => {
    if (model) {
      setLoading(true);
      dispatch(deleteModelById(model.id));
    }
  };

  useEffect(() => {
    if (deleteHasError && errorMessage) {
      toast.error(errorMessage);
    }
    if (!deleteModelIsLoading && !deleteHasError) {
      handleClose();
    }
    if (!deleteHasError) {
      setLoading(false);
    }
  }, [deleteModelIsLoading, deleteHasError, errorMessage]);

  const handleClose = () => {
    setLoading(false);
    onClose();
  };
  return (
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
          <div className='flex min-h-full items-center justify-center p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full flex flex-col max-w-md transform border border-content-primary bg-grey-100 px-10 py-10 rounded-xl shadow-xl transition-all gap-3'>
                <IconButton className='absolute top-4 right-4' onClick={handleClose}>
                  <XMarkIcon className='w-5 h-5text-content-primary' />
                </IconButton>
                <Dialog.Title as='h3' className='text-2xl font-semibold text-grey-900'>
                  {`Delete "${model?.name}" model`}
                </Dialog.Title>
                <p className='text-xl font-semibold mt-5 text-grey-900'>Are you sure?</p>
                <p className='text-base font-regular text-grey-800'>
                  This action is irreversible and will permanently remove the model and all its associated data.
                </p>
                <form className='flex mt-2 gap-2'>
                  <Button
                    type='button'
                    className='flex-1 !h-11'
                    variant='dangerous'
                    title='Delete Tab'
                    loading={loading}
                    onClick={onDelete}
                  />
                  <Button
                    type='button'
                    className='flex-1 !h-11'
                    variant='outline'
                    title='Cancel'
                    onClick={handleClose}
                  />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
