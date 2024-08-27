/* eslint-disable react-hooks/exhaustive-deps */
import {Fragment, useEffect, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {useForm} from 'react-hook-form';

// import {ROLEOPTIONS} from '@/constant';
import {authValidator} from '@/helpers/validators';

import {Button, IconButton} from '../buttons';
import {Input} from '../input';
// import {InvitationSent} from './SendInvitation';

interface ModalProps {
  open: boolean;
  existed?: boolean;
  sectorData?: {id: number; name: string};
  onClose: () => void;
}

interface IFormInputs {
  name: string;
  id: number;
}

export const AddSectorModal = ({open, onClose, existed = false, sectorData}: ModalProps) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit = async (data: IFormInputs) => {
    const {name, id} = data;
    console.log({name, id});
    setLoading(true);
    setLoading(false);
  };

  useEffect(() => {
    if (sectorData?.id) {
      setValue('id', sectorData.id);
      setValue('name', sectorData.name);
    }
  }, [existed, sectorData]);

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog className='relative z-10' as='div' onClose={onClose}>
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
                    <Dialog.Title as='h3' className='text-2xl font-semibold text-grey-900 text-left'>
                      {existed ? 'Update sector' : 'Add a new sector'}
                    </Dialog.Title>
                    <IconButton className='top-4 right-4' onClick={onClose}>
                      <XMarkIcon className='w-5 h-5 text-content-primary' />
                    </IconButton>
                  </div>
                  <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
                    <Input
                      className='h-10'
                      placeholder='Name'
                      errors={errors.name && errors.name.message}
                      rules={register('name', authValidator.name)}
                    />

                    <Input
                      className='h-10'
                      placeholder='Device ID'
                      errors={errors.id && errors.id.message}
                      rules={register('id', authValidator.id)}
                    />

                    <div className='flex gap-2 pt-1.5'>
                      <Button
                        className='w-1/2 !h-10 border'
                        variant='transparent'
                        title={`Cancel`}
                        loading={loading}
                        onClick={onClose}
                      />
                      <Button
                        className='w-1/2 !h-10'
                        variant='primary'
                        title={`Add a new sector`}
                        loading={loading}
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
