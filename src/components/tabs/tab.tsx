import React from 'react';

import classNames from 'classnames';

export type TabProps = {
  tabId: string;
  title?: string;
  Icon?: React.ReactNode;
  isFocused?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
};

export const Tab = ({tabId, title, Icon, onClick, isFocused, isDisabled}: TabProps) => {
  const classSelected = isFocused
    ? 'bg-content-grey-100 text-black before:bg-content-grey-100'
    : 'bg-content-grey-900 text-content-white';
  // const beforeClass = 'before:absolute before:bottom-0 before:w-[10px] before:h-[10px] before:-left-[10px]';

  return (
    <div id={tabId} onClick={onClick}>
      <button
        className={classNames(
          'relative h-10 flex items-center justify-center px-4 rounded-t-[20px] text-14 font-semibold tracking-[2.5px]',
          // beforeClass,
          classSelected,
        )}
        disabled={isDisabled}
      >
        {Icon && Icon}
        {title && title}
      </button>
    </div>
  );
};
