import classnames from 'classnames';

type ButtonProps = {
  variant?: 'default' | 'primary' | 'secondary' | 'disabled';
  loading?: boolean;
  disabled?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  className?: string;
  title?: string;
  href?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

const ButtonStyle = {
  default: 'bg-transparent',
  primary: 'bg-content-accent',
  secondary: 'bg-content-grey-900',
  disabled: 'bg-content-disabled',
};

export const IconButton = ({
  className,
  href,
  variant = 'default',
  iconBefore,
  children,
  onClick,
  ...props
}: ButtonProps) => {
  const style = ButtonStyle[variant];
  const content = (
    <button
      className={classnames('flex items-center p-2 justify-center gap-2 rounded-full', style, className)}
      {...props}
      onClick={onClick}
    >
      {iconBefore && iconBefore}
      {children && children}
    </button>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }
  return content;
};
