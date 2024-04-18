import classNames from 'classnames';
import React from 'react';

type Props = {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  className?: string;
  textareaCustomClassName?: string;
  disabled?: boolean;
  maxLenght?: number;
};

const TextAreaSection = ({setValue, value, className = '', textareaCustomClassName = '', disabled = false,maxLenght=1000}: Props) => {
  return (
    <div className={classNames('flex relative items-center mb-5', className)}>
      <textarea
        className={classNames(
          `w-full border py-2 px-4 pb-6 rounded-[18px] resize-none outline-none focus:border-content-black custom-scrollbar-thumb bg-content-grey-100`,
          textareaCustomClassName,
        )}
        placeholder='Core-idea'
        onInput={(e) => setValue(e.currentTarget.value)}
        value={value}
        rows={15}
        autoFocus={true}
        disabled={disabled}
      />
      <span
        className={classNames(`text-content-grey-400 text-xs absolute right-3 bottom-2`, {
          '!text-content-red-600': value.length > maxLenght,
        })}
      >{`${value.length}/${maxLenght}`}</span>
    </div>
  );
};

export default TextAreaSection;
