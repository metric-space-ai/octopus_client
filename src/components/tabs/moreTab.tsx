import React, {useEffect, useState} from 'react';

import {CheckIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {useForm} from 'react-hook-form';

import {TabModes} from '@/constant';
import {authValidator} from '@/helpers/validators';
import {useChatStore} from '@/store';
import {IWorkspace} from '@/types';

import {TabMenu} from './menu';
import {IconButton} from '../buttons';
import {Input} from '../input';

interface IFormInputs {
  name: string;
}

export type MoreTabProps = {
  tabId: string;
  title?: string;
  icon?: React.ReactNode;
  isFocused?: boolean;
  editable?: boolean;
  onClick?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onClearTab?: () => void;
  tab?: IWorkspace;
  editMode?: boolean;
};

export const MoreTab = ({
  tab,
  tabId,
  title,
  icon,
  editMode = false,
  editable,
  onClick,
  onRename,
  onDelete,
  onClearTab = () => console.warn('onClearTab function not implemented'),
  isFocused,
}: MoreTabProps) => {
  const [selected, setSelected] = useState(TabModes[0]);
  const [loading, setLoading] = useState(false);
  const {updateWorkspace} = useChatStore();

  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit = async (data: IFormInputs) => {
    const {name} = data;
    if (title !== name) {
      setLoading(true);
      await updateWorkspace(tabId, name, selected.name);
      setLoading(false);
    }
    onClearTab();
  };

  useEffect(() => {
    setSelected({name: tab?.type ?? 'Public'});
    setValue('name', title ? title : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue]);

  const classSelected = isFocused ? 'bg-grey-0 before:bg-grey-0' : 'bg-grey-';

  return (
    <div className='cursor-pointer mb-2' id={tabId} onClick={onClick}>
      <div
        className={classNames(
          'relative h-9 flex items-center justify-start py-1 px-4 text-sm font-semibold text-grey-900 ',
          classSelected,
        )}
      >
        {icon && <div className='mr-2'>{icon}</div>}
        <div className=' max-w-[156px]'>
          {editMode ? (
            <form className='flex flex-col relative' onSubmit={handleSubmit(onSubmit)}>
              <Input
                inputCoverClassName='!p-0'
                placeholder='Tab name'
                errors={errors.name && errors.name.message}
                rules={register('name', authValidator.username)}
              />

              <IconButton
                className='absolute rounded-full top-0 right-1 bg-primary z-10 w-5 h-5 !p-0'
                variant='primary'
                loading={loading}
                onClick={handleSubmit(onSubmit)}
              >
                <CheckIcon className='w-3 h-3 text-grey-0' width={16} height={16} />
              </IconButton>
            </form>
          ) : (
            <span className='flex truncate overflow-hidden break-words h-5'>{title ? title : '--'}</span>
          )}
        </div>
        {editable && isFocused && <TabMenu onRename={onRename} onDelete={onDelete} />}
      </div>
    </div>
  );
};
