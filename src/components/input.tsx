'use client';

import {useState, FocusEventHandler} from 'react';

import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {UseFormRegisterReturn} from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  inputCoverClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  errors?: string;
  rules?: UseFormRegisterReturn;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
}

export const Input = ({
  className,
  inputCoverClassName = '',
  label,
  labelClassName = '',
  inputClassName = '',
  type,
  placeholder,
  errors,
  rules,
  onBlur,
  ...rest
}: InputProps) => {
  const [hidePassword, setHidePassword] = useState(false);
  return (
    <div className={classNames(className)}>
      {label && (
        <p className={classNames('mb-2 font-normal text-xs text-content-secondary', labelClassName)}>{label}</p>
      )}
      <div className={classNames(`relative px-5 py-2 bg-grey-0 rounded-5xl`, inputCoverClassName)}>
        <input
          {...rules}
          onBlur={onBlur}
          className={classNames('w-full text-base text-grey-900 outline-none', inputClassName)}
          type={type === 'password' ? (hidePassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          {...rest}
        />
        {type === 'password' && (
          <div
            className='absolute top-1/2 translate-y-[-50%] right-4 cursor-pointer'
            onClick={() => setHidePassword((prev) => !prev)}
          >
            {!hidePassword ? (
              <EyeSlashIcon className='w-5 h-5 text-grey-600' />
            ) : (
              <EyeIcon className='w-5 h-5 text-grey-600' />
            )}
          </div>
        )}
      </div>
      {errors && <p className='mt-1 text-xs text-danger-500'>{errors}</p>}
    </div>
  );
};
