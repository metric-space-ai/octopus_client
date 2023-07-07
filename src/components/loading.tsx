import {EllipsisHorizontalIcon} from '@heroicons/react/24/solid';

import BotIcon from '../icons/bot.svg';

export function Loading(props: {noLogo?: boolean}) {
  return (
    <div className='flex flex-col w-full h-full items-center justify-center'>
      {!props.noLogo && <BotIcon />}
      <EllipsisHorizontalIcon className='w-6 h-6 text-content-accent' />
    </div>
  );
}
