import classNames from 'classnames';

import {Spinner} from '../spinner';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'transparent' | 'disabled';
  size?: 'default' | 'large' | 'medium' | 'small';
  loading?: boolean;
  disabled?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  className?: string;
  title: string;
  onClick?: () => void;
};

const ButtonStyle = {
  primary: 'bg-content-accent',
  secondary: 'bg-content-black',
  transparent: 'bg-transparent',
  disabled: 'bg-content-disabled',
};

const ButtonHoverStyle = {
  primary: 'hover:bg-content-accent-hover',
  secondary: 'hover:bg-content-grey-600',
  transparent: 'hover:bg-transparent',
  disabled: 'hover:bg-content-disabled',
};

const TextStyle = {
  primary: 'text-content-white',
  secondary: 'text-content-white',
  transparent: 'text-content-black',
  disabled: 'text-content-primary',
};

const Sizes = {
  default: 'text-14',
  large: 'text-24',
  medium: 'text-18',
  small: 'text-12',
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
  const style = ButtonStyle[variant];
  const hoverStyle = ButtonHoverStyle[variant];
  const textStyle = TextStyle[variant];
  const sizeStyle = Sizes[size];

  return (
    <button
      disabled={disabled}
      className={classNames(
        'h-9 flex items-center justify-center px-4 gap-[6px] rounded-[20px]',
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
