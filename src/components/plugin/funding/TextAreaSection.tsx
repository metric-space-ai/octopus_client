import classNames from 'classnames';
import React from 'react';

type Props = {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  className?: string;
  textareaCustomClassName?: string;
};

const TextAreaSection = ({setValue, value, className = '', textareaCustomClassName = ''}: Props) => {
  return (
    <div className={classNames('flex relative items-center mb-5', className)}>
      <textarea
        //   ref={inputRef}
        className={classNames(
          `w-full border py-2 px-4 pb-6 rounded-[18px] resize-none outline-none focus:border-content-black custom-scrollbar-thumb bg-content-grey-100`,
          textareaCustomClassName,
        )}
        placeholder='Core-idea'
        onInput={(e) => setValue(e.currentTarget.value)}
        value={value}
        //   onKeyDown={(e) => onInputKeyDown(e, answerInput, response)}
        rows={15}
        autoFocus={true}
      />
      <span
        className={classNames(`text-content-grey-400 text-xs absolute right-3 bottom-2`, {
          '!text-content-red-600': value.length > 1000,
        })}
      >{`${value.length}/1000`}</span>
    </div>
  );
};

export default TextAreaSection;
