import {Spinner} from '@/components/spinner';
import {AI_SERVICES_SETUP_STATUS, PLUGINSTATUS} from '@/constant';
import {spaceBeforeCapitalLetters} from '@/helpers';
import {TPartialPluginStatus} from '@/types';
import React from 'react';

type Props = {
  variant?: TPartialPluginStatus;
  label: string;
  setupStatus?: string;
};

const PluginsBadge = ({variant = 'Running', label = '', setupStatus}: Props) => {
  return (
    <span
      className={`h-6 px-1 w-24 rounded-20 flex items-center ${
        variant === 'Error'
          ? 'bg-content-red-600/10 text-content-red-600'
          : variant === 'Stopped' || variant === PLUGINSTATUS.InstallationFinished
          ? 'bg-content-red-400/10 text-content-red-400'
          : variant === 'Setup'
          ? 'bg-content-blue-dark/10 text-content-blue-dark'
          : 'bg-content-accent-hover/10 text-content-accent-hover'
      } `}
    >
      <span
        title={spaceBeforeCapitalLetters(label)}
        className='flex items-center justify-center gap-1 w-[88px] overflow-hidden truncate ... text-center'
      >
        {[PLUGINSTATUS.InstallationFinished, PLUGINSTATUS.Setup, PLUGINSTATUS.InstallationStarted].includes(variant) &&
          setupStatus === AI_SERVICES_SETUP_STATUS.NotPerformed && <Spinner size='small' />}
        {variant === PLUGINSTATUS.InstallationFinished && setupStatus === AI_SERVICES_SETUP_STATUS.NotPerformed
          ? 'In Progress'
          : spaceBeforeCapitalLetters(label)}
      </span>
    </span>
  );
};

export default PluginsBadge;
