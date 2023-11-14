import {Switch} from '@headlessui/react';
import {CheckIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, {SetStateAction, Dispatch} from 'react';

type Props = {
  active: boolean | undefined;
  title?: string;
  description?: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

const CustomCheckbox = ({active, onChange, title, description, disabled = false}: Props) => {
  return (
    <Switch checked={active} onChange={onChange} className={`flex `} disabled={disabled}>
      <span className='sr-only'>Use setting</span>
      <div
        className={classNames(
          `relative inline-flex h-4 w-4 cursor-pointer rounded-4 border-[1.25px] border-content-black
        transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`,
        )}
      >
        {active && <CheckIcon width={14} height={14} className='text-content-accent stroke-4 m-auto' />}
      </div>
      {(title || description) && (
        <div className='ml-3 flex items-center text-left'>
          {title && <p className='font-poppins-medium font-medium text-sm text-content-black'>{title}</p>}
          {description && (
            <span className='font-poppins-medium font-medium text-xs text-content-grey-600 ml-2'>{description}</span>
          )}
        </div>
      )}
    </Switch>
  );
};

export default CustomCheckbox;
