import React from 'react';

import classNames from 'classnames';

type Props = {className?: string; selected: boolean};

const RadioButtonSelect = ({className, selected = false}: Props) => {
  return (
    <div
      className={classNames(
        'flex rounded-full items-center justify-center relative w-4 h-4 border-[1.5px]',
        selected ? 'border-primary' : 'border-grey-900',
        className,
      )}
    >
      <div className={classNames('block w-2.5 h-2.5 rounded-full', selected && 'bg-primary')} />
    </div>
  );
};

export default RadioButtonSelect;
