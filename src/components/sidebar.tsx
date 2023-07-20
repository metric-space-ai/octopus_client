import {PlusIcon} from '@heroicons/react/24/solid';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

import {useChatStore} from '@/store';

import {Button, IconButton} from './buttons';
import {SearchBar} from './search';
import Locale from '../locales';

const ChatList = dynamic(async () => (await import('./chat-list')).ChatList, {
  loading: () => null,
});

export function SideBar(props: {className?: string}) {
  const chatStore = useChatStore();

  return (
    <div
      className={classNames(
        'w-[320px] hidden sm:flex flex-col px-4 py-6 bg-content-grey-900 border-box rounded-[20px]',
        props.className,
      )}
    >
      <div className='flex items-center'>
        <h2 className='text-18 font-semibold text-content-white'>Ticket</h2>
      </div>
      <SearchBar className='mt-6' />
      <div className='mt-5 flex-1'>
        <ChatList />
      </div>
      <div className='flex items-center'>
        <IconButton variant='primary'>
          <PlusIcon className='w-5 h-5 text-white' />
        </IconButton>
        <Button
          className='w-full'
          title={Locale.Home.NewTicket}
          onClick={() => {
            chatStore.newTicket();
          }}
        />
      </div>
    </div>
  );
}
