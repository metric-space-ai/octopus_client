import React from 'react';

import {Switch} from '@headlessui/react';
import {CheckIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';

type Props = {
  active: boolean | undefined;
  title?: string;
  description?: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  bodyClassName?: string;
  className?: string;
};

const CustomCheckbox = ({
  active,
  onChange,
  title,
  description,
  disabled = false,
  className,
  bodyClassName = '',
}: Props) => {
  return (
    <Switch checked={active} onChange={onChange} className={classNames('flex', className)} disabled={disabled}>
      <span className='sr-only'>{title}</span>
      <div
        className={classNames(
          'c-custom-checkbox relative inline-flex h-4 w-4 cursor-pointer rounded-2xs border-[1.25px] border-grey-900 transition-colors duration-200 ease-in-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-grey-0 focus-visible:ring-opacity-75',
        )}
      >
        {active && <CheckIcon width={14} height={14} className='text-primary stroke-4 m-auto' />}
      </div>
      {(title || description) && (
        <div className={classNames('ml-3 flex items-center text-left flex-1', bodyClassName)}>
          {title && <p className='font-medium text-sm text-grey-900'>{title}</p>}
          {description && <span className='font-medium text-xs text-grey-600 ml-2'>{description}</span>}
        </div>
      )}
    </Switch>
  );
};

export default CustomCheckbox;
