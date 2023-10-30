import React from 'react';

type Props = {
  variant?: 'Setup' | 'Error' | 'Running' | 'Stopped' | string;
  label: string;
};

const PluginsBadge = ({variant = 'Running', label = ''}: Props) => {
  return (
    <span
      className={`font-poppins-medium flex justify-center items-center w-20 h-6 rounded-20 font-medium  ${
        variant === 'Error'
          ? 'bg-content-red-600/10 text-content-red-600'
          : variant === 'Stopped'
          ? 'bg-content-red-400/10 text-content-red-400'
          : variant === 'Setup'
          ? 'bg-content-blue-dark/10 text-content-blue-dark'
          : 'bg-content-accent-hover/10 text-content-accent-hover'
      } `}
    >
      {label}
    </span>
  );
};

export default PluginsBadge;
