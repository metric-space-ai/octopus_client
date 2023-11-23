import {spaceBeforeCapitalLetters} from '@/helpers';
import React from 'react';

type Props = {
  variant?: 'Setup' | 'Error' | 'Running' | 'Stopped' | string;
  label: string;
};

const PluginsBadge = ({variant = 'Running', label = ''}: Props) => {
  return (
    <span
      className={`font-poppins-medium flex justify-center items-center h-6 px-1 w-24 rounded-20 font-medium truncate ...  ${
        variant === 'Error'
          ? 'bg-content-red-600/10 text-content-red-600'
          : variant === 'Stopped'
          ? 'bg-content-red-400/10 text-content-red-400'
          : variant === 'Setup'
          ? 'bg-content-blue-dark/10 text-content-blue-dark'
          : 'bg-content-accent-hover/10 text-content-accent-hover'
      } `}
    >
      <span title={spaceBeforeCapitalLetters(label)} className='w-[88px] overflow-hidden truncate ...'>
        {spaceBeforeCapitalLetters(label)}
      </span>
    </span>
  );
};

export default PluginsBadge;
