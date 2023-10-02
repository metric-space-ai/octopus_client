import {Fragment, useState, useEffect} from 'react';

import {Dialog, Listbox, Transition} from '@headlessui/react';
import {CheckIcon, ChevronDownIcon, TrashIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {useForm} from 'react-hook-form';

import {RoleOptions} from '@/constant';
import {authValidator} from '@/helpers/validators';

import {Button, IconButton} from '../buttons';
import {Input} from '../input';
import {TAgent} from '../agents';
import CustomSwitch from '../switch/custom-switch';
import PromptLine from '../prompt-line';
import { DeleteAgentModal } from './DeleteAgentModal';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  promptData: TAgent;
}

interface IFormInputs {
  name: string;
  desc: string;
}

export const EditPromptAgentModal = ({open, onClose, promptData}: ModalProps) => {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(promptData);
  const [showDeleteAgentModal, setShowDeleteAgentModal] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit = async (data: IFormInputs) => {
    const {name, desc} = data;
    console.log({name, desc});
    setLoading(true);
    setLoading(false);
  };
  const handleActiveAgentPrompt = (check: boolean) => {
    if (selected) {
      setSelected((prev) => ({...prev, active: check}));
    }
  };
  const handleDeleteAgent = () => {
    setShowDeleteAgentModal(false);
    onClose();
  };
  useEffect(() => {
    setValue('name', selected.title);
    setValue('desc', selected.when);
  }, [promptData]);

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
                <Dialog.Panel className='w-full max-w-[1000px] transform border border-content-primary bg-content-grey-100 px-10 pt-10 pb-2.5 rounded-[20px] align-middle shadow-xl transition-all'>
                  <div className='flex justify-between items-start mb-6'>
                    <div className='flex gap-4 items-center'>
                      <CustomSwitch active={true} onChange={(check: boolean) => handleActiveAgentPrompt(check)} />
                      <Dialog.Title
                        as='h3'
                        className='text-2xl font-semibold text-content-black font-poppins-semibold text-left truncate overflow-hidden max-w-lg h-6'
                      >
                        {selected.title}
                      </Dialog.Title>
                    </div>
                    <div className='flex gap-8 items-center'>
                      <IconButton className='top-4 right-4' onClick={() => setShowDeleteAgentModal(true)}>
                        <TrashIcon className='w-5 h-5 text-content-primary' width={20} height={20} />
                      </IconButton>
                      <IconButton className='top-4 right-4' onClick={onClose}>
                        <XMarkIcon className='w-5 h-5 text-content-primary' width={20} height={20} />
                      </IconButton>
                    </div>
                  </div>
                  <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
                    <Input
                      className='h-10'
                      placeholder='What'
                      errors={errors.name && errors.name.message}
                      rules={register('name', authValidator.name)}
                    />

                    <Input
                      className='h-10'
                      placeholder='When'
                      errors={errors.desc && errors.desc.message}
                      rules={register('desc', authValidator.desc)}
                    />

                    <div className='mb-1 flex flex-col gap-5 max-h-[366px] overflow-auto relative -mr-10 pr-10'>
                      <div className='flex items-center gap-2 '>
                        <PromptLine
                          desc={'I checked the vibration level of the blade, everything is ok.'}
                          when={'19 mins ago'}
                        />
                        <span className='font-poppins-medium text-xxs text-content-black min-w-max text-right block'>
                          19 mins ago
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <PromptLine
                          desc={'I checked the vibration level of the blade, everything is ok.'}
                          when={'19 mins ago'}
                        />
                        <span className='font-poppins-medium text-xxs text-content-black min-w-max text-right block'>
                          19 mins ago
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <PromptLine
                          desc={'I checked the vibration level of the blade, everything is ok.'}
                          when={'19 mins ago'}
                        />
                        <span className='font-poppins-medium text-xxs text-content-black min-w-max text-right block'>
                          19 mins ago
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <PromptLine
                          desc={'I checked the vibration level of the blade, everything is ok.'}
                          when={'19 mins ago'}
                        />
                        <span className='font-poppins-medium text-xxs text-content-black min-w-max text-right block'>
                          19 mins ago
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <PromptLine
                          desc={'I checked the vibration level of the blade, everything is ok.'}
                          when={'19 mins ago'}
                        />
                        <span className='font-poppins-medium text-xxs text-content-black min-w-max text-right block'>
                          19 mins ago
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <PromptLine
                          desc={'I checked the vibration level of the blade, everything is ok.'}
                          when={'19 mins ago'}
                        />
                        <span className='font-poppins-medium text-xxs text-content-black min-w-max text-right block'>
                          19 mins ago
                        </span>
                      </div>
                      <div className='flex gap-2 pt-1.5 mb-2'>
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
                          title={`Save Changes`}
                          loading={loading}
                          type='submit'
                        />
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <DeleteAgentModal
        tab={{
          id: 'aeb22bb2-830d-45f1-b923-78db02b6cc52',
          company_id: '80c34d93-9cc1-449a-a3c7-62ba35bc933b',
          user_id: '874bcd63-01c3-4588-b7ba-d1117e6969aa',
          name: 'Public Group',
          type: 'Public',
          created_at: '2023-09-05T07:09:25Z',
        }}
        open={showDeleteAgentModal}
        onClose={() => setShowDeleteAgentModal(false)}
        onDelete={handleDeleteAgent}
      />
    </>
  );
};
