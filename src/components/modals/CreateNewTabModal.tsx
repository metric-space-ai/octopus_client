import {Fragment, useEffect, useState} from 'react';

import {Dialog, Listbox, Transition} from '@headlessui/react';
import {CheckIcon, ChevronDownIcon, LockClosedIcon, UserGroupIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {useForm} from 'react-hook-form';

import {TabModes} from '@/constant';
import {authValidator} from '@/helpers/validators';
import {useChatStore} from '@/store';
import {IWorkspace} from '@/types';

import {Button, IconButton} from '../buttons';
import {Input} from '../input';

interface ModalProps {
  tab: IWorkspace | null;
  open: boolean;
  onClose: () => void;
}

interface IFormInputs {
  name: string;
}

export const CreateNewTabModal = ({tab, open, onClose}: ModalProps) => {
  const {createNewWorkspace} = useChatStore();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(TabModes[0]);

  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit = async (data: IFormInputs) => {
    const {name} = data;
    setLoading(true);
    if (tab) {
      await createNewWorkspace(name, selected.name);
    } else {
      await createNewWorkspace(name, selected.name);
    }
    setLoading(false);
    onClose();
  };

  useEffect(() => {
    setSelected({name: tab?.type ?? 'Public'});
    setValue('name', tab?.name ?? '');
  }, [setValue, tab]);

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
          <div className='fixed inset-0 bg-black/50 transition-opacity' />
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
              <Dialog.Panel className='w-full max-w-md transform border border-content-primary bg-content-grey-100 px-10 py-10 rounded-[20px] align-middle shadow-xl transition-all'>
                <IconButton className='absolute top-4 right-4' onClick={onClose}>
                  <XMarkIcon className='w-4 h-4 text-content-primary' />
                </IconButton>
                <Dialog.Title as='h3' className='text-24 font-semibold text-content-primary'>
                  {tab ? 'Rename tab' : 'Create a new tab'}
                </Dialog.Title>
                <form className='flex flex-col mt-5 gap-5' onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    placeholder='Tab name'
                    errors={errors.name && errors.name.message}
                    rules={register('name', authValidator.username)}
                  />
                  <Listbox value={selected} onChange={setSelected}>
                    <div className='relative mt-1'>
                      <Listbox.Button className='relative w-full cursor-default rounded-[48px] bg-white py-2 pl-5 pr-10 text-left text-content-primary'>
                        <div className='flex gap-1 items-center'>
                          {selected.name === 'Public' ? (
                            <UserGroupIcon className='w-4 h-4 text-content-grey-900' />
                          ) : (
                            <LockClosedIcon className='w-4 h-4 text-content-grey-900' />
                          )}
                          <span className='text-16 text-content-grey-900'>{selected.name}</span>
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
                        <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-content-primary'>
                          {TabModes.map((tab, tabIdx) => (
                            <Listbox.Option
                              key={tabIdx}
                              className={({active}) =>
                                `relative select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-content-grey-100' : 'text-gray-900'
                                }`
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
                  <Button className='mt-2 w-full h-11' variant='primary' title='Create a tab' loading={loading} />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
