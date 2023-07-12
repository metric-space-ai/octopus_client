import classNames from 'classnames';
import {UseFormRegisterReturn} from 'react-hook-form';

interface InputProps {
  className?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  errors?: string;
  rules?: UseFormRegisterReturn;
}

export const Input = ({className, label, type, placeholder, errors, rules}: InputProps) => {
  return (
    <div className={classNames(className)}>
      {label && <p className='mb-2 text-14 font-semibold text-content-secondary'>{label}</p>}
      <div className='px-5 py-2 bg-content-white rounded-[48px]'>
        <input
          {...rules}
          className='w-full text-16 text-content-black outline-none'
          type={type}
          placeholder={placeholder}
        />
      </div>
      {errors && <p className='mt-1 text-12 text-content-red'>{errors}</p>}
    </div>
  );
};
