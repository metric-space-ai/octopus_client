import classnames from 'classnames';

type ButtonProps = {
  variant?: 'default' | 'primary' | 'secondary' | 'dark' | 'disabled';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  href?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

const ButtonStyle = {
  default: 'bg-transparent',
  primary: 'bg-content-accent',
  secondary: 'bg-content-grey-900',
  dark: 'bg-content-black',
  disabled: 'bg-content-disabled',
};

export const IconButton = ({className, href, variant = 'default', children, onClick, ...props}: ButtonProps) => {
  const style = ButtonStyle[variant];
  const content = (
    <button
      className={classnames('flex items-center p-2 justify-center gap-2 rounded-full cursor-pointer', style, className)}
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
