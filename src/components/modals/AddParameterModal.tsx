/* eslint-disable react-hooks/exhaustive-deps */
import {FormEvent, Fragment, useEffect, useRef, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import toast from 'react-hot-toast';
import {useDebouncedCallback} from 'use-debounce';

import {autoGrowTextArea} from '@/helpers';
import {IParameter} from '@/types';

import {Button, IconButton} from '../buttons';
import {Input} from '../input';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  parameter?: IParameter;
  onSubmitParameter: (payload: IParameter) => void;
}

export const AddParameterModal = ({open, onClose, parameter, onSubmitParameter}: ModalProps) => {
  const [parameterIsExists, setParameterIsExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [inputRows, setInputRows] = useState(2);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // const {parameters, setParameters} = useSettingsContext();

  const closeDialog = () => {
    setValue('');
    setName('');
    setLoading(false);
    onClose();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !value) return toast.error('fill the parameter-name and parameter-value');
    console.log('submit is running');
    setLoading(true);
    onSubmitParameter({id: `parameter-${Math.floor(Math.random() * 1000)}`, name, value});
    closeDialog();
  };

  const measure = useDebouncedCallback(
    () => {
      const rows = inputRef.current ? autoGrowTextArea(inputRef.current) : 1;
      const inputRows = Math.min(20, Math.max(1, rows));
      setInputRows(inputRows);
    },
    100,
    {
      leading: true,
      trailing: true,
    },
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    measure();
  }, [value, open]);

  useEffect(() => {
    if (parameter) {
      setParameterIsExists(true);
      setName(parameter.name);
      setValue(parameter.value);
    }
  }, [parameter]);

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog className='relative z-10' as='div' onClose={closeDialog}>
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
                <Dialog.Panel className='w-full max-w-3xl transform border border-content-primary bg-grey-100 px-10 py-10 rounded-xl align-middle shadow-xl transition-all'>
                  <div className='flex justify-between items-center relative'>
                    <Dialog.Title as='h3' className='text-2xl f ont-semibold text-grey-900'>
                      {parameterIsExists ? 'Change parameter' : 'Add a new parameter'}
                    </Dialog.Title>
                    <IconButton onClick={closeDialog} type='button'>
                      <XMarkIcon className='w-5 h-5 text-content-primary' />
                    </IconButton>
                  </div>

                  <form className='flex flex-col mt-5 gap-5' onSubmit={onSubmit}>
                    <Input placeholder='name' value={name} onChange={(e) => setName(e.target.value)} />
                    <div className='flex flex-col gap-2'>
                      <textarea
                        ref={inputRef}
                        placeholder='value'
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        rows={inputRows}
                        className={classNames(
                          'px-5 py-2 resize-none custom-scrollbar-thumb max-h-80',
                          inputRows > 1 && 'rounded-2xl',
                          inputRows === 1 && 'rounded-5xl',
                        )}
                      />
                    </div>

                    <div className='flex gap-2'>
                      <Button
                        className='mt-2 w-1/2 !h-10 border'
                        variant='transparent'
                        title={`Cancel`}
                        onClick={closeDialog}
                        type='button'
                      />
                      <Button
                        className='mt-2 w-1/2 !h-10'
                        variant='primary'
                        disabled={loading}
                        title={!loading && parameterIsExists ? `Apply` : 'Add parameter'}
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
