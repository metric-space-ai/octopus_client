import React from 'react';

import {Spinner} from '@/components/spinner';
import {AI_SERVICES_SETUP_STATUS, APPSTATUS} from '@/constant';
import {spaceBeforeCapitalLetters} from '@/helpers';

type Props = {
  variant?: 'Setup' | 'Error' | 'Running' | 'Stopped' | string;
  label: string;
  setupStatus?: string;
};

const AppsBadge = ({variant = 'Running', label = '', setupStatus}: Props) => {
  return (
    <span
      className={`h-6 px-1 w-24 rounded-xl flex items-center ${
        variant === 'Error'
          ? 'bg-danger-500/10 text-danger-500'
          : variant === 'Stopped' || variant === APPSTATUS.InstallationFinished
          ? 'bg-danger-300/10 text-danger-300'
          : variant === 'Setup'
          ? 'bg-secondary-700/10 text-secondary-700'
          : 'bg-primary-medium/10 text-primary-medium'
      } `}
    >
      <span
        title={spaceBeforeCapitalLetters(label)}
        className='flex items-center justify-center gap-1 w-[88px] overflow-hidden truncate ... text-center'
      >
        {[APPSTATUS.InstallationFinished, APPSTATUS.Setup, APPSTATUS.InstallationStarted].includes(variant) &&
          setupStatus === AI_SERVICES_SETUP_STATUS.NotPerformed && <Spinner size='small' />}
        {variant === APPSTATUS.InstallationFinished ? 'In Progress' : spaceBeforeCapitalLetters(label)}
      </span>
    </span>
  );
};

export default AppsBadge;
