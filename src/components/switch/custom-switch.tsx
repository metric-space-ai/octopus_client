import {Switch} from '@headlessui/react';
import classNames from 'classnames';
import React, {SetStateAction, Dispatch} from 'react';

type Props = {
  active: boolean | undefined;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

const CustomSwitch = ({active, onChange, disabled = false}: Props) => {
  return (
    <Switch
      checked={active}
      onChange={onChange}
      disabled={disabled}
      className={classNames(
        active ? 'bg-primary shadow-switch-active' : 'shadow-switch-deactive bg-grey-100',
        ' relative inline-flex h-5 w-10 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-grey-0 focus-visible:ring-opacity-75',
        disabled ? 'pointer-events-none cursor-default !shadow-switch-disable' : ' cursor-pointer',
      )}
    >
      {' '}
      <span className='sr-only'>Use setting</span>
      <span
        aria-hidden='true'
        className={classNames(
          active
            ? 'translate-x-5 shadow-switch-circle-active bg-grey-100'
            : 'translate-x-0 shadow-switch-circle-deactive bg-grey-0',
          'pointer-events-none inline-block h-4 w-4 transform rounded-full ring-0 transition duration-200 ease-in-out',
        )}
      />
    </Switch>
  );
};

export default CustomSwitch;
