import {Fragment, useEffect, useState} from 'react';

import {Dialog, Listbox, Transition} from '@headlessui/react';
import {CheckIcon, ChevronDownIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {useForm} from 'react-hook-form';

import {parameterValidator} from '@/helpers/validators';

import {Button, IconButton} from '../buttons';
import {Input} from '../input';
import {IParameter} from '@/types';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  parameter?: IParameter;
  onSubmitParameter: (payload: IParameter) => void;
}

interface IFormInputs {
  value: string;
  name: string;
}
const VALUEOPTIONS = [
  {value: true, label: 'Active'},
  {value: false, label: 'Deactive'},
];

export const AddParameterModal = ({open, onClose, parameter, onSubmitParameter}: ModalProps) => {
  const [parameterIsExists, setParameterIsExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(VALUEOPTIONS[0]);

  // const {parameters, setParameters} = useSettingsContext();

  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const closeDialog = () => {
    setValue('name', '');
    setValue('value', '');
    setLoading(false);
    onClose();
  };

  const onSubmit = async (data: IFormInputs) => {
    const {name, value} = data;
    if (!name || !value) return;
    console.log('submit is running');
    setLoading(true);
    onSubmitParameter({id: `parameter-${Math.floor(Math.random() * 1000)}`, name, value});
    closeDialog();
  };

  useEffect(() => {
    if (parameter) {
      setParameterIsExists(true);
      setValue('name', parameter.name);
      setValue('value', parameter.value);
      setSelectedOption(parameter.value ? VALUEOPTIONS[0] : VALUEOPTIONS[1]);
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
                <Dialog.Panel className='w-full max-w-[460px] transform border border-content-primary bg-content-grey-100 px-10 py-10 rounded-[20px] align-middle shadow-xl transition-all'>
                  <div className='flex justify-between items-center relative'>
                    <Dialog.Title as='h3' className='text-2xl font-semibold text-content-black'>
                      {parameterIsExists ? 'Change parameter' : 'Add a new parameter'}
                    </Dialog.Title>
                    <IconButton onClick={closeDialog} type='button'>
                      <XMarkIcon className='w-5 h-5 text-content-primary' />
                    </IconButton>
                  </div>

                  <form className='flex flex-col mt-5 gap-5' onSubmit={handleSubmit(onSubmit)}>
                    <Input
                      placeholder='name'
                      errors={errors.name && errors.name.message}
                      rules={register('name', parameterValidator.name)}
                    />
                    <Input
                      placeholder='value'
                      errors={errors.value && errors.value.message}
                      rules={register('value', parameterValidator.value)}
                    />
                    {/* <Listbox value={selectedOption} onChange={setSelectedOption}>
                      <div className='relative mt-1'>
                        <Listbox.Button className='relative w-full cursor-default rounded-[48px] bg-white py-2 pl-5 pr-10 text-left text-content-primary'>
                          <div className='flex gap-1 items-center'>
                            <span className='text-base text-content-grey-900'>{selectedOption.label}</span>
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
                            {VALUEOPTIONS.map((option, tabIdx) => (
                              <Listbox.Option
                                value={tabIdx}
                                className={({active}) =>
                                  `relative select-none py-2 pl-10 pr-4 ${
                                    active ? 'bg-content-grey-100' : 'text-gray-900'
                                  }`
                                }
                                value={option}
                              >
                                {({selected}) => (
                                  <>
                                    <span className='block truncate'>{option.label}</span>
                                    {selected ||
                                      (option.label === selectedOption.label && (
                                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-content-primary'>
                                          <CheckIcon className='h-5 w-5' aria-hidden='true' />
                                        </span>
                                      ))}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox> */}
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
