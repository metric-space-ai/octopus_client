/* eslint-disable react-hooks/exhaustive-deps */
import {Fragment, useEffect, useState} from 'react';

import {Dialog, Listbox, Transition} from '@headlessui/react';
import {CheckIcon, ChevronDownIcon, LockClosedIcon, UserGroupIcon, XMarkIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {useForm} from 'react-hook-form';

import {TabModes} from '@/constant';
import {authValidator} from '@/helpers/validators';
import {useChatStore} from '@/store';
import {IWorkspace, TRole} from '@/types';

import {Button, IconButton} from '../buttons';
import {Input} from '../input';

interface ModalProps {
  tab: IWorkspace | null;
  open: boolean;
  onClose: () => void;
  roles: TRole[];
}

interface IFormInputs {
  name: string;
}

export const CreateNewTabModal = ({tab, open, roles, onClose}: ModalProps) => {
  const {createNewWorkspace, updateWorkspace} = useChatStore();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(TabModes[0]);
  const isAdmin = roles.includes('ROLE_COMPANY_ADMIN_USER');
  const isJustPrivateUser = !isAdmin && roles.includes('ROLE_PRIVATE_USER');

  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit = (data: IFormInputs) => {
    if (!isJustPrivateUser && !isAdmin) return;
    const {name} = data;
    setLoading(true);
    try {
      if (tab) {
        updateWorkspace(tab.id, name, selected.name);
      } else {
        createNewWorkspace(name, selected.name);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setValue('name', '');
      onClose();
    }
  };

  useEffect(() => {
    setSelected({name: tab?.type ?? 'Public'});
    setValue('name', tab?.name ?? '');
  }, [setValue, tab]);

  useEffect(() => {
    if (!tab && isJustPrivateUser) {
      setSelected(TabModes[0]);
    }
  }, [open]);

  return (
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
                <IconButton className='absolute top-4 right-4' onClick={onClose}>
                  <XMarkIcon className='w-5 h-5 text-content-primary' />
                </IconButton>
                <Dialog.Title as='h3' className='text-2xl font-semibold text-grey-900'>
                  {tab ? 'Rename tab' : 'Create a new tab'}
                </Dialog.Title>
                <form className='flex flex-col mt-5 gap-5' onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    placeholder='Tab name'
                    errors={errors.name && errors.name.message}
                    rules={register('name', authValidator.username)}
                  />
                  <Listbox value={selected} onChange={setSelected}>
                    <div className={classNames('relative mt-1', isJustPrivateUser && 'pointer-events-none')}>
                      <Listbox.Button className='relative w-full cursor-default rounded-5xl bg-grey-0 py-2 pl-5 pr-10 text-left text-content-primary'>
                        <div className='flex gap-1 items-center'>
                          {selected.name === 'Public' ? (
                            <UserGroupIcon className='w-4 h-4 text-grey-800' />
                          ) : (
                            <LockClosedIcon className='w-4 h-4 text-grey-800' />
                          )}
                          <span className='text-base text-grey-800'>{selected.name}</span>
                        </div>
                        <span
                          className={classNames(
                            'absolute inset-y-0 right-0 flex items-center pr-4',
                            isJustPrivateUser && 'hidden',
                          )}
                        >
                          <ChevronDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave='transition ease-in duration-100'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                      >
                        <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-xs bg-grey-0 py-1 text-content-primary'>
                          {TabModes.map((tab, tabIdx) => (
                            <Listbox.Option
                              key={tabIdx}
                              className={({active}) =>
                                `relative select-none py-2 pl-10 pr-4 ${active ? 'bg-grey-100' : 'text-gray-900'}`
                              }
                              value={tab}
                            >
                              {({selected}) => (
                                <>
                                  <span className='block truncate'>{tab.name}</span>
                                  {selected ? (
                                    <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-content-primary'>
                                      <CheckIcon className='h-5 w-5' aria-hidden='true' />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                  <Button
                    className='mt-2 w-full !h-11'
                    variant='primary'
                    title={tab ? 'Update tab' : 'Create a tab'}
                    loading={loading}
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
