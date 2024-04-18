import classNames from "classnames";

function ClockLoadingIcon({className, ...props}: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      className={classNames('text-content-grey-400', className)}
      {...props}
    >
      <path
        d='M5.70626 6.79965H1.54576V6.79817M1.54576 2.63915V6.79817M1.54576 6.79817L4.1967 4.14723C7.12563 1.2183 11.8744 1.2183 14.8033 4.14723C17.7322 7.07616 17.7322 11.8249 14.8033 14.7538C13.7645 15.7926 12.4968 16.463 11.1625 16.7649M11.1667 16.7638L11.1625 16.7649M2.74655 11.9025C3.7289 15.5687 7.49625 17.7449 11.1625 16.7649M9.5 5.70036L9.5 10.7004H13.25'
        stroke='#989898'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  );
}
export {ClockLoadingIcon};
