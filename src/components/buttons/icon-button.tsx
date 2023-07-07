import * as React from 'react';

import classNames from 'classnames';

export function IconButton(props: {
  onClick?: () => void;
  icon?: JSX.Element;
  type?: 'primary' | 'danger';
  text?: string;
  bordered?: boolean;
  shadow?: boolean;
  className?: string;
  title?: string;
  disabled?: boolean;
}) {
  const styles = {
    primary: 'bg-black',
    danger: 'bg-content-primary',
  };
  return (
    <button
      className={classNames(
        'flex items-center justify-center cursor-pointer border-none outline-none px-3 py-2 rounded-[8px] gap-2',
        `${props.bordered && 'border'} ${props.shadow && ''} ${props.className ?? ''} clickable ${
          styles[props.type ?? 'primary']
        }`,
      )}
      onClick={props.onClick}
      title={props.title}
      disabled={props.disabled}
      role='button'
    >
      {props.icon && (
        <div className={classNames('w-4 h-4', `${props.type === 'primary' && 'no-dark'}`)}>{props.icon}</div>
      )}

      {props.text && <div className='text-white'>{props.text}</div>}
    </button>
  );
}
