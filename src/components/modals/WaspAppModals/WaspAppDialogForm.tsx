import React, {Fragment} from 'react';

import {Listbox, Transition} from '@headlessui/react';
import {CheckIcon, ChevronDownIcon} from '@heroicons/react/24/outline';
import {FieldErrors, UseFormHandleSubmit, UseFormRegister} from 'react-hook-form';

import {Button} from '@/components/buttons';
import CustomSwitch from '@/components/switch/custom-switch';
import {INSTANCETYPES} from '@/constant';
import {bytesCalculator} from '@/helpers';
import {waspAppFormValidator} from '@/helpers/validators';
import {EWaspInstanceType} from '@/types';

import {IWaspFormInputs} from '.';
import {Input} from '../../input';

type Props = {
  uploadIsLoading: boolean;
  handleSubmitSecondStep: (data: IWaspFormInputs) => void;
  file: File | null;
  handleSubmit: UseFormHandleSubmit<IWaspFormInputs, undefined>;
  errors: FieldErrors<IWaspFormInputs>;
  register: UseFormRegister<IWaspFormInputs>;
  setIs_enabled: React.Dispatch<React.SetStateAction<boolean>>;
  is_enabled: boolean;
  setInstanceType: React.Dispatch<React.SetStateAction<EWaspInstanceType>>;
  instance_type: EWaspInstanceType;
  handleGoToPrevStep: () => void;
};

const WaspAppDialogFormInputs = ({
  uploadIsLoading,
  file,
  handleSubmit,
  handleSubmitSecondStep,
  errors,
  register,
  setIs_enabled,
  is_enabled,
  setInstanceType,
  instance_type,
  handleGoToPrevStep,
}: Props) => {
  return (
    <form className='flex flex-col flex-1 gap-5 ' onSubmit={handleSubmit(handleSubmitSecondStep)}>
      <div className='flex flex-col flex-1 w-full gap-5 max-w-lg mx-auto'>
        {!!file && (
          <div className='flex gap-4 items-center max-w-full mb-8'>
            <div className='flex w-full pr-2 items-center'>
              <p className='font-semibold text-xs text-grey-900 truncate ... max-w-[calc(100%-36px)]'>{file.name}</p>
            </div>
            <span className='text-xs text-grey-600 lg:w-24 ml-auto lg:ml-0 text-center'>
              {bytesCalculator(file.size)}
            </span>
          </div>
        )}
        <Input
          className='h-10 flex flex-row gap-4 items-center w-full'
          inputCoverClassName='flex-1'
          label='App Name:'
          labelClassName='mb-0 w-28 text-left'
          placeholder='App Name'
          errors={errors.name && errors.name.message}
          rules={register('name', waspAppFormValidator.name)}
        />

        <div className='relative flex w-full gap-4 items-center'>
          <span className='font-normal text-xs text-content-secondary w-28 text-left'>Instance type :</span>
          <Listbox value={instance_type} onChange={setInstanceType}>
            <div className='relative mt-1 flex-1'>
              <Listbox.Button className='relative cursor-default rounded-5xl bg-grey-0 py-2 pl-5 pr-10 text-left text-content-primary w-full'>
                <div className='flex gap-1 items-center'>
                  <span className='text-base text-grey-800'>{instance_type}</span>
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
                <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-xs bg-grey-0 py-1 text-content-primary z-10'>
                  {INSTANCETYPES.map((type) => (
                    <Listbox.Option
                      key={`instance_type_${type}`}
                      className={({active}) =>
                        `relative select-none py-2 pl-10 pr-4 cursor-pointer ${
                          active ? 'bg-grey-100' : 'text-gray-900'
                        }`
                      }
                      value={type}
                    >
                      {({selected}) => (
                        <>
                          <span className='block truncate'>{type}</span>
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
        </div>

        <div className='flex flex-row gap-4 items-center w-full '>
          <label className='font-normal text-xs text-content-secondary mb-0 w-28 text-left block'>
            App Descriptions:{' '}
          </label>
          <div className='flex-1'>
            <textarea
              className='w-full text-base text-grey-900 outline-none relative px-5 py-2 bg-grey-0 rounded-xl resize-none custom-scrollbar-thumb'
              // value={answerInput}
              rows={5}
              autoFocus={true}
              placeholder='App Descriptions'
              {...register('description', waspAppFormValidator.description)}
            />
          </div>
        </div>

        <label className='flex gap-2 items-center cursor-pointer'>
          <CustomSwitch active={is_enabled} onChange={(check: boolean) => setIs_enabled(check)} />
          <span>{is_enabled ? 'Enable' : 'Disable'}</span>
        </label>
      </div>
      <div className='flex gap-4 px-4 md:px-8 lg:px-12 xl:px-20 mx-1 mt-auto'>
        <Button
          className='mt-2 w-1/2 !h-10 border'
          variant='transparent'
          title={`Back`}
          onClick={handleGoToPrevStep}
          type='button'
        />
        <Button
          className='mt-2 w-1/2 !h-10'
          variant='primary'
          disabled={uploadIsLoading}
          title={!uploadIsLoading ? 'Submit' : ''}
          loading={uploadIsLoading}
          type='submit'
        />
      </div>
    </form>
  );
};

export default WaspAppDialogFormInputs;
