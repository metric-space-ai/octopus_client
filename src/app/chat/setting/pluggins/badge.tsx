import React from 'react';

type Props = {
  variant?: 'info' | 'error' | 'normal';
  label: string;
};

const PluginsBadge = ({variant = 'normal', label = ''}: Props) => {
  return (
    <span
      className={`font-poppins-medium flex justify-center items-center w-20 h-6 rounded-20 font-medium  ${
        variant === 'error'
          ? 'bg-content-red-600/10 text-content-red-600'
          : variant === 'info'
          ? 'bg-content-blue-dark/10 text-content-blue-dark'
          : 'bg-content-accent-hover/10 text-content-accent-hover'
      } `}
    >
      {label}
    </span>
  );
};

export default PluginsBadge;
