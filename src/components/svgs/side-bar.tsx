import classNames from 'classnames';

export function IconSideBar({className, ...props}: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 20 20'
      className={classNames('w-5 h-5', className)}
      {...props}
    >
      <path d='M6.875 3.75V16.25' strokeWidth='1.25' strokeLinecap='round' strokeLinejoin='round' />
      <path
        d='M16.875 3.75H3.125C2.77982 3.75 2.5 4.02982 2.5 4.375V15.625C2.5 15.9702 2.77982 16.25 3.125 16.25H16.875C17.2202 16.25 17.5 15.9702 17.5 15.625V4.375C17.5 4.02982 17.2202 3.75 16.875 3.75Z'
        strokeWidth='1.25'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path d='M2.5 6.25H4.375' strokeWidth='1.25' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M2.5 8.75H4.375' strokeWidth='1.25' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M2.5 11.25H4.375' strokeWidth='1.25' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}
