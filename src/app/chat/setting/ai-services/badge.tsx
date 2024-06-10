import {Spinner} from '@/components/spinner';
import {AI_SERVICES_SETUP_STATUS, PLUGINSTATUS} from '@/constant';
import {spaceBeforeCapitalLetters} from '@/helpers';
import {TPartialPluginStatus} from '@/types';
import classNames from 'classnames';
import React from 'react';

type Props = {
  variant?: TPartialPluginStatus;
  label: string;
  setupStatus?: string;
};

const PluginsBadge = ({variant = 'Running', label = '', setupStatus}: Props) => {
  return (
    <span
      className={classNames(
        `h-6 px-1 w-24 rounded-xl flex items-center justify-center`,
        variant === 'Error'
          ? 'bg-danger-500/10 text-danger-500'
          : variant === 'Stopped' || variant === PLUGINSTATUS.InstallationFinished
          ? 'bg-danger-300/10 text-danger-300'
          : variant === 'Setup'
          ? 'bg-secondary-700/10 text-secondary-700'
          : 'bg-primary-medium/10 text-primary-medium',
      )}
    >
      <span
        title={spaceBeforeCapitalLetters(label)}
        className='flex items-center justify-center gap-1 w-full truncate ...'
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
