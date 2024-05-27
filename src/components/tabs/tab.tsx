import React, {useEffect, useState} from 'react';

import classNames from 'classnames';

import {TabMenu} from './menu';
import {Input} from '../input';
import {useForm} from 'react-hook-form';
import {authValidator} from '@/helpers/validators';
import {IWorkspace} from '@/types';
import {TabModes} from '@/constant';
import {useChatStore} from '@/store';
import {Button} from '../buttons';

interface IFormInputs {
  name: string;
}

export type TabProps = {
  tabId: string;
  title?: string;
  icon?: React.ReactNode;
  isFocused?: boolean;
  // isDisabled?: boolean;
  editable?: boolean;
  onClick?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onClearTab?: () => void;
  tab?: IWorkspace;
  editMode?: boolean;
};

export const Tab = ({
  tab,
  tabId,
  title,
  icon,
  editMode = false,
  editable,
  onClick,
  onRename,
  onDelete,
  onClearTab = () => {},
  isFocused,
}: TabProps) => {
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
  }, [setValue]);

  const classSelected = isFocused
    ? 'bg-content-grey-100 text-black before:bg-content-grey-100'
    : 'bg-content-grey-900 text-content-white';
  // const beforeClass = 'before:absolute before:bottom-0 before:w-[10px] before:h-[10px] before:-left-[10px]';

  return (
    <div className='cursor-pointer max-w-[220px] ' onClick={onClick}>
      <div
        className={classNames(
          'relative h-10 flex items-center justify-start pl-4 pr-3 rounded-t-[20px] text-sm font-semibold',
          // beforeClass,
          classSelected,
        )}
      >
        {icon && <div className='mr-2'>{icon}</div>}
        <div className=' max-w-[156px]'>
          {editMode ? (
            <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
              <Input
                inputCoverClassName='!p-0 min-w-[80px]'
                placeholder='Tab name'
                errors={errors.name && errors.name.message}
                rules={register('name', authValidator.username)}
              />
              <Button
                className='w-10 h-6 hidden'
                variant='primary'
                type='submit'
                title={tab ? 'Update tab' : 'Create a tab'}
                loading={loading}
              />
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
