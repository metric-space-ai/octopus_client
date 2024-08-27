import React, {useEffect, useState} from 'react';

import classNames from 'classnames';
import {useForm} from 'react-hook-form';

import {TabModes} from '@/constant';
import {authValidator} from '@/helpers/validators';
import {useChatStore} from '@/store';
import {IWorkspace} from '@/types';

import {TabMenu} from './menu';
import {Button} from '../buttons';
import {Input} from '../input';

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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue]);

  const classSelected = isFocused
    ? 'bg-grey-100 before:bg-grey-100 dark:bg-grey-100 dark:text-grey-900'
    : 'bg-grey-50 dark:bg-grey-800';
  // const beforeClass = 'before:absolute before:bottom-0 before:w-[10px] before:h-[10px] before:-left-[10px]';

  return (
    <div className='cursor-pointer max-w-[220px] ' onClick={onClick}>
      <div
        className={classNames(
          'relative h-10 flex items-center justify-start pl-4 pr-3 rounded-t-xl text-sm font-semibold text-grey-900 dark:text-grey-0',
          // beforeClass,
          classSelected,
        )}
      >
        {icon && (
          <div
            className={classNames(
              'mr-2 rounded-full',
              tab?.type === 'Public' ? 'bg-secondary-700/15' : 'bg-primary/15',
            )}
          >
            {icon}
          </div>
        )}
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
