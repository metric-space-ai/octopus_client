import classNames from 'classnames';

interface CheckboxProps extends React.ButtonHTMLAttributes<HTMLInputElement> {
  title?: string;
  checked?: boolean;
  className?: string;
}

export const Checkbox = ({className, checked, disabled, title}: CheckboxProps) => {
  return (
    <label className={classNames('flex items-center gap-2', className)}>
      <input
        type='checkbox'
        disabled={disabled}
        checked={checked}
        readOnly
        className='w-4 h-4 accent-primary-default checked:bg-content-primary'
      />
      {title}
    </label>
  );
};
