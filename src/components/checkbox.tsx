import {ChangeEvent} from 'react';

import classNames from 'classnames';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  className?: string;
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = ({className, title, checked, onChange, ...rest}: CheckboxProps) => {
  return (
    <label className={classNames('flex items-center gap-2', className)}>
      <input
        type='checkbox'
        className='w-4 h-4 accent-primary-default checked:bg-content-primary'
        checked={checked}
        onChange={onChange}
        {...rest}
      />
      {title}
    </label>
  );
};
