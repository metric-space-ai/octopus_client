import {Fragment, useReducer, useState} from 'react';
import {useForm} from 'react-hook-form';
import classNames from 'classnames';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';

import {keywordValidator} from '@/helpers/validators';
import {Input} from '@/components/input';
import {Button, IconButton} from '@/components/buttons';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  addKeyword: (keyword: string) => void;
}

interface IFormInputs {
  keyword: string;
}

export const AddDefinitionModal = ({open, onClose, addKeyword}: ModalProps) => {
  const [loading, setLoading] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit = (data: IFormInputs) => {
    const {keyword} = data;
    setLoading(true);
    addKeyword(keyword);
    setLoading(false);
  };

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
                <div className='flex justify-between items-center'>
                  <Dialog.Title as='h3' className='text-left text-2xl font-semibold text-content-black'>
                    {'Add definition'}
                  </Dialog.Title>
                  <IconButton className='' onClick={onClose}>
                    <XMarkIcon className='w-5 h-5 text-content-primary' />
                  </IconButton>
                </div>
                <form className='flex flex-col mt-5 gap-5' onSubmit={handleSubmit(onSubmit)}>
                  <div className='relative flex items-center '>
                    <Input
                      onKeyDown={forceUpdate}
                      placeholder='Definition'
                      className='w-full'
                      inputCoverClassName='!pr-[68px]'
                      errors={errors.keyword && errors.keyword.message}
                      rules={register('keyword', keywordValidator.keyword)}
                    />
                    <span
                      className={classNames('absolute right-5 text-content-grey-400 text-xs', {
                        'text-content-red-400': getValues().keyword?.length > 100,
                      })}
                    >{`${getValues().keyword?.length ?? 0}/100`}</span>
                  </div>
                  <Button
                    className='mt-2 w-full !h-11'
                    variant='primary'
                    title={'Add a new keyword'}
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
