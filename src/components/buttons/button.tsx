import classNames from 'classnames';

import {Spinner} from '../spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'transparent' | 'outline' | 'dangerous' | 'disabled' | 'outline-dark';
  size?: 'default' | 'large' | 'medium' | 'small';
  loading?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  className?: string;
  title: string;
  fontWeight?: 'default' | 'light' | 'normal';
  onClick?: () => void;
  ariaTitle?: string;
}

const ButtonStyle = {
  primary: 'bg-primary',
  secondary: 'bg-grey-900',
  transparent: 'bg-transparent',
  dangerous: 'bg-danger-500',
  outline: 'bg-transparent border border-grey-900',
  'outline-dark': 'bg-transparent border border-grey-900 dark:border-grey-0',
  disabled: 'bg-grey-disabled',
};

const ButtonHoverStyle = {
  primary: 'hover:bg-primary-medium',
  secondary: 'hover:bg-grey-600',
  transparent: 'hover:bg-transparent',
  dangerous: 'hover:bg-danger-300',
  outline: 'hover:bg-transparent',
  'outline-dark': 'hover:bg-transparent',
  disabled: 'hover:bg-grey-disabled',
};

const TextStyle = {
  primary: 'text-grey-0',
  secondary: 'text-grey-0',
  transparent: 'text-grey-900',
  dangerous: 'text-grey-0',
  outline: 'text-grey-900',
  'outline-dark': 'text-grey-900 dark:text-grey-0',
  disabled: 'text-grey-0',
};

const FontWeight = {
  default: 'font-semibold',
  normal: 'font-normal',
  light: 'font-light',
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
  fontWeight = 'default',
  loading = false,
  disabled,
  iconBefore,
  iconAfter,
  title,
  onClick,
  ariaTitle = '',
  ...props
}: ButtonProps) => {
  const style = ButtonStyle[disabled ? 'disabled' : variant];
  const hoverStyle = ButtonHoverStyle[disabled ? 'disabled' : variant];
  const textStyle = TextStyle[disabled ? 'disabled' : variant];
  const sizeStyle = Sizes[size];
  const fontWeightStyle = FontWeight[fontWeight];

  return (
    <button
      disabled={disabled}
      className={classNames(
        'h-11 flex items-center justify-center px-4 gap-1.5 rounded-xl',
        style,
        hoverStyle,
        className,
      )}
      title={ariaTitle}
      {...props}
      onClick={onClick}
    >
      {loading && <Spinner />}
      {iconBefore && iconBefore}
      <p className={classNames('leading-4 capitalize', textStyle, sizeStyle, fontWeightStyle)}>{title}</p>
      {iconAfter && iconAfter}
    </button>
  );
};
