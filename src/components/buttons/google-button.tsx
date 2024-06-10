import classNames from 'classnames';

import {GoogleIcon} from '../svgs';

type ButtonProps = {
  className?: string;
  title: string;
  onClick?: () => void;
};

export const GoogleButton = ({className, title, onClick, ...props}: ButtonProps) => {
  const buttonStyle = 'bg-grey-0';
  return (
    <button
      className={classNames('h-11 flex items-center justify-center px-4 gap-4 rounded-xl', buttonStyle, className)}
      {...props}
      onClick={onClick}
    >
      <GoogleIcon />
      <p className={classNames('text-sm font-semibold text-grey-900 leading-4')}>{title}</p>
    </button>
  );
};
