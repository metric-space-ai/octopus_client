import classNames from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'dark' | 'disabled' | 'grey' | 'negative';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  href?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

const ButtonStyle = {
  default: 'bg-transparent',
  primary: 'bg-primary',
  secondary: 'bg-grey-800',
  dark: 'bg-grey-900',
  negative: 'dark:bg-grey-900 bg-grey-0',
  grey: 'bg-grey-50 dark:bg-grey-800',
  disabled: 'bg-grey-disabled',
};
export const IconButton = ({
  className,
  href,
  variant = 'default',
  children,
  onClick,
  disabled,
  ...props
}: ButtonProps) => {
  const style = ButtonStyle[variant];
  const activityStyle = () => (disabled ? 'cursor-default' : 'cursor-pointer');
  const content = (
    <button
      className={classNames(
        'flex items-center p-2 justify-center gap-2 rounded-full',
        style,
        className,
        activityStyle(),
      )}
      disabled={disabled}
      {...props}
      onClick={onClick}
    >
      {children && children}
    </button>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }
  return content;
};
