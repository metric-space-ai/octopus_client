'use client';

import classNames from 'classnames';
import {UseFormRegisterReturn} from 'react-hook-form';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  label?: string;
  errors?: string;
  rules?: UseFormRegisterReturn;
}

export const TextArea = ({
  className,
  wrapperClassName = '',
  label,
  labelClassName = '',
  placeholder,
  errors,
  rules,
  ...rest
}: TextareaProps) => {
  return (
    <label className={classNames(wrapperClassName)}>
      {label && (
        <span className={classNames('block mb-2 font-normal text-xs text-content-secondary', labelClassName)}>
          {label}
        </span>
      )}
      <div className={classNames(`relative bg-grey-0`)}>
        <textarea
          {...rules}
          className={classNames('w-full text-base text-grey-900 outline-none', className)}
          placeholder={placeholder}
          {...rest}
        />
      </div>
      {errors && <p className='mt-1 text-xs text-danger-500'>{errors}</p>}
    </label>
  );
};
