import classNames from 'classnames';

import {Spinner} from '../spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'transparent' | 'outline' | 'dangerous' | 'disabled';
  size?: 'default' | 'large' | 'medium' | 'small';
  loading?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  className?: string;
  title: string;
  onClick?: () => void;
}

const ButtonStyle = {
  primary: 'bg-content-accent',
  secondary: 'bg-content-black',
  transparent: 'bg-transparent',
  dangerous: 'bg-content-red-600',
  outline: 'bg-transparent border border-content-black',
  disabled: 'bg-content-disabled',
};

const ButtonHoverStyle = {
  primary: 'hover:bg-content-accent-hover',
  secondary: 'hover:bg-content-grey-600',
  transparent: 'hover:bg-transparent',
  dangerous: 'hover:bg-content-red-400',
  outline: 'hover:bg-transparent',
  disabled: 'hover:bg-content-disabled',
};

const TextStyle = {
  primary: 'text-content-white',
  secondary: 'text-content-white',
  transparent: 'text-content-black',
  dangerous: 'text-content-white',
  outline: 'text-content-black',
  disabled: 'text-content-white',
};

const Sizes = {
  default: 'text-sm',
  large: 'text-2xl',
  medium: 'text-lg',
  small: 'text-xs',
};

export const Button = ({
  className,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled,
  iconBefore,
  iconAfter,
  title,
  onClick,
  ...props
}: ButtonProps) => {
  const style = ButtonStyle[disabled ? 'disabled' : variant];
  const hoverStyle = ButtonHoverStyle[disabled ? 'disabled' : variant];
  const textStyle = TextStyle[disabled ? 'disabled' : variant];
  const sizeStyle = Sizes[size];

  return (
    <button
      disabled={disabled}
      className={classNames(
        'h-11 flex items-center justify-center px-4 gap-1.5 rounded-[20px]',
        style,
        hoverStyle,
        className,
      )}
      {...props}
      onClick={onClick}
    >
      {loading && <Spinner />}
      {iconBefore && iconBefore}
      <p className={classNames('font-semibold leading-4', textStyle, sizeStyle)}>{title}</p>
      {iconAfter && iconAfter}
    </button>
  );
};
