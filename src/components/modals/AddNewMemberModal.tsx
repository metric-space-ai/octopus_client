import {Fragment, useState} from 'react';

import {Dialog, Listbox, Transition} from '@headlessui/react';
import {CheckIcon, ChevronDownIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {useForm} from 'react-hook-form';

import {ROLEOPTIONS} from '@/constant';
import {authValidator} from '@/helpers/validators';

import {Button, IconButton} from '../buttons';
import {Input} from '../input';
import {InvitationSent} from './SendInvitation';
import {TRole, ICreateUser} from '@/types';
import {useSettingsContext} from '@/contexts/settingsContext';
import toast from 'react-hot-toast';
import {createTeamMemberApi} from '@/services/settings.service';
import {AxiosError} from 'axios';
import {useDispatch} from 'react-redux';
import {addNewTeamMember} from '@/app/lib/features/teamMembers/teamMemberSlice';
import { AppDispatch } from '@/app/lib/store';

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

interface IFormInputs {
  email: string;
  job_title: string;
  name: string;
  password: string;
  repeat_password: string;
}

export const AddNewMemberModal = ({open, onClose}: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([ROLEOPTIONS[2]]);
  const [invitationSentModal, setInvitationSentModal] = useState(false);

  const {teamMembers, setTeamMembers} = useSettingsContext();

  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const closeDialog = () => {
    setValue('email', '');
    setValue('job_title', '');
    setValue('name', '');
    setValue('password', '');
    setValue('repeat_password', '');
    onClose();
  };

  const onSubmit = async (data: IFormInputs) => {
    const {email, job_title, name, password, repeat_password} = data;
    const roles = [...selected].reduce<TRole[]>((acc, {value}) => [...acc, value], []);
    const payload: ICreateUser = {
      email,
      is_enabled: true,
      job_title,
      name,
      password,
      repeat_password,
      roles,
    };
    setLoading(true);
    dispatch(addNewTeamMember(payload));
    setLoading(false);
    // try {
    //   const {status, data} = await createTeamMemberApi(payload);
    //   if (status === 201) {
    //     if (teamMembers) {
    //       setTeamMembers((prev) => (prev ? [...prev, data] : [data]));
    //     }
    //     toast.success(`(${payload.name}) has successfully been added as a new user.`);
    //     closeDialog();
    //   }
    // } catch (err) {
    //   if (err instanceof AxiosError) {
    //     toast.error(err?.response?.data.error);
    //   }
    // } finally {
    //   setLoading(false);
    // }
    // setInvitationSentModal(true);
  };

  return (
    <>
      {!invitationSentModal ? (
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
                  <Dialog.Panel className='w-full max-w-md transform border border-content-primary bg-content-grey-100 px-10 py-10 rounded-[20px] align-middle shadow-xl transition-all'>
                    <IconButton className='absolute top-4 right-4' onClick={closeDialog}>
                      <XMarkIcon className='w-5 h-5 text-content-primary' />
                    </IconButton>
                    <Dialog.Title as='h3' className='text-2xl font-semibold text-content-black'>
                      Add a new member
                    </Dialog.Title>
                    <form className='flex flex-col mt-5 gap-5' onSubmit={handleSubmit(onSubmit)}>
                      <Input
                        placeholder='Email'
                        errors={errors.email && errors.email.message}
                        rules={register('email', authValidator.email)}
                      />
                      <Input
                        placeholder='job_title'
                        errors={errors.job_title && errors.job_title.message}
                        rules={register('job_title', authValidator.job_title)}
                      />
                      <Input
                        placeholder='name'
                        errors={errors.name && errors.name.message}
                        rules={register('name', authValidator.name)}
                      />
                      <Input
                        type='password'
                        placeholder='password'
                        errors={errors.password && errors.password.message}
                        rules={register('password', authValidator.password)}
                      />
                      <Input
                        type='password'
                        placeholder='repeat password'
                        errors={errors.repeat_password && errors.repeat_password.message}
                        rules={register('repeat_password', authValidator.password)}
                      />
                      <Listbox value={selected} onChange={setSelected} multiple>
                        <div className='relative mt-1'>
                          <Listbox.Button className='relative w-full cursor-default rounded-[48px] bg-white py-2 pl-5 pr-10 text-left text-content-primary'>
                            <div className='flex gap-1 items-center'>
                              <span className='text-base text-content-grey-900'>
                                {selected.map((role) => role.label).join(', ')}
                              </span>
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
                              {ROLEOPTIONS.map((permission, idx) => (
                                <Listbox.Option
                                  key={`${permission.value}_${idx}`}
                                  className={({active}) =>
                                    `relative select-none py-2 pl-10 pr-4 ${
                                      active ? 'bg-content-grey-100' : 'text-gray-900'
                                    }`
                                  }
                                  value={permission}
                                >
                                  {({selected}) => (
                                    <>
                                      <span className='block truncate'>{permission.label}</span>
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
                      <div className='flex gap-2'>
                        <Button
                          className='mt-2 w-1/2 !h-10 border'
                          variant='transparent'
                          title='Cancel'
                          onClick={closeDialog}
                        />
                        <Button
                          className='mt-2 w-1/2 !h-10'
                          variant='primary'
                          disabled={loading}
                          title={!loading ? `submit` : ''}
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
      ) : (
        <InvitationSent
          open={invitationSentModal}
          onClose={() => {
            setInvitationSentModal(false);
            closeDialog();
          }}
        />
      )}
    </>
  );
};
