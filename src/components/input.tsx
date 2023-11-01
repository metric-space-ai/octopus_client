'use client';

import {useState, FocusEventHandler} from 'react';

import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {UseFormRegisterReturn} from 'react-hook-form';

interface InputProps {
  className?: string;
  inputCoverClassName?: string;
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
  type,
  placeholder,
  errors,
  rules,
  onBlur,
}: InputProps) => {
  const [hidePassword, setHidePassword] = useState(false);
  return (
    <div className={classNames(className)}>
      {label && <p className='mb-2 font-normal text-xs text-content-secondary'>{label}</p>}
      <div className={`relative px-5 py-2 bg-content-white rounded-[48px] ${inputCoverClassName}`}>
        <input
          {...rules}
          onBlur={onBlur}
          className='w-full text-base text-content-black outline-none'
          type={type === 'password' ? (hidePassword ? 'text' : 'password') : type}
          placeholder={placeholder}
        />
        {type === 'password' && (
          <div
            className='absolute top-1/2 translate-y-[-50%] right-4 cursor-pointer'
            onClick={() => setHidePassword((prev) => !prev)}
          >
            {!hidePassword ? (
              <EyeSlashIcon className='w-5 h-5 text-content-grey-600' />
            ) : (
              <EyeIcon className='w-5 h-5 text-content-grey-600' />
            )}
          </div>
        )}
      </div>
      {errors && <p className='mt-1 text-xs text-content-red-600'>{errors}</p>}
    </div>
  );
};
