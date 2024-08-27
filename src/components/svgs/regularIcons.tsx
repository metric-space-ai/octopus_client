import classNames from 'classnames';

function ClockLoadingIcon({className, ...props}: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      className={classNames('text-grey-400', className)}
      {...props}
    >
      <path
        d='M5.70626 6.79965H1.54576V6.79817M1.54576 2.63915V6.79817M1.54576 6.79817L4.1967 4.14723C7.12563 1.2183 11.8744 1.2183 14.8033 4.14723C17.7322 7.07616 17.7322 11.8249 14.8033 14.7538C13.7645 15.7926 12.4968 16.463 11.1625 16.7649M11.1667 16.7638L11.1625 16.7649M2.74655 11.9025C3.7289 15.5687 7.49625 17.7449 11.1625 16.7649M9.5 5.70036L9.5 10.7004H13.25'
        stroke='#989898'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function PdfTypeIcon({className, ...props}: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 16 17'
      width='16'
      height='17'
      fill='currentColor'
      className={classNames(className)}
      {...props}
    >
      <path
        d='M0.320168 16.1768C-0.560719 15.268 0.392334 14.0192 2.9788 12.6931L4.60624 11.8587L5.24026 10.4275C5.58897 9.64035 6.10941 8.35598 6.3968 7.57336L6.91934 6.15039L6.55926 5.09732C6.1165 3.80247 5.95861 1.85663 6.23953 1.15695C6.62004 0.209212 7.8664 0.306452 8.35983 1.32237C8.7452 2.1158 8.7058 3.55268 8.24899 5.3648L7.87449 6.85042L8.20436 7.42816C8.38579 7.74592 8.91575 8.50042 9.38205 9.10481L10.2584 10.2295L11.349 10.0827C14.8134 9.61627 16 10.409 16 11.5455C16 12.98 13.2797 13.0984 10.9953 11.4431C10.4813 11.0706 10.1283 10.7007 10.1283 10.7007C10.1283 10.7007 8.69726 11.0012 7.99265 11.1972C7.26536 11.3994 6.9025 11.5261 5.83713 11.8971C5.83713 11.8971 5.46333 12.4571 5.21975 12.8642C4.31353 14.379 3.25543 15.6343 2.49977 16.0912C1.65371 16.6027 0.766746 16.6376 0.320168 16.1768ZM1.70258 15.6673C2.19774 15.3516 3.19996 14.1287 3.89373 12.9937L4.17461 12.5341L2.89565 13.1975C0.920308 14.2222 0.0166294 15.1879 0.486538 15.7721C0.750515 16.1002 1.0663 16.073 1.70258 15.6673ZM14.5335 11.9516C15.0179 11.6016 14.9476 10.8964 14.4 10.612C13.9739 10.3907 13.6304 10.3452 12.5235 10.3621C11.8432 10.41 10.7494 10.5514 10.564 10.5944C10.564 10.5944 11.1649 11.0229 11.4317 11.1804C11.7869 11.3897 12.6499 11.7781 13.28 11.9771C13.9016 12.1734 14.2611 12.1527 14.5335 11.9516ZM9.37438 9.73936C9.08127 9.42148 8.58287 8.75801 8.26683 8.26499C7.85349 7.70573 7.64621 7.31116 7.64621 7.31116C7.64621 7.31116 7.3441 8.3137 7.09623 8.917L6.32294 10.8889L6.09874 11.3362C6.09874 11.3362 7.29067 10.933 7.89711 10.7696C8.53942 10.5965 9.84301 10.3321 9.84301 10.3321L9.37438 9.73936ZM7.71178 2.86058C7.78654 2.2133 7.81827 1.56698 7.6167 1.24105C7.05757 0.610452 6.38273 1.13632 6.49704 2.63554C6.5355 3.13989 6.65694 4.00206 6.8193 4.53346L7.11451 5.49962L7.32228 4.77193C7.43655 4.37171 7.61183 3.51159 7.71178 2.86058Z'
        fill='currentColor'
      />
    </svg>
  );
}

export {ClockLoadingIcon, PdfTypeIcon};
