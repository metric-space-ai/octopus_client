import classnames from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'dark' | 'disabled' | 'grey';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  href?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

const ButtonStyle = {
  default: 'bg-transparent',
  primary: 'bg-content-accent',
  secondary: 'bg-content-grey-900',
  dark: 'bg-content-black',
  grey: 'bg-content-grey-100',
  disabled: 'bg-content-disabled',
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
      className={classnames(
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
