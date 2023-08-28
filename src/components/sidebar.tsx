import {useState} from 'react';

import {Switch} from '@headlessui/react';
import {MagnifyingGlassIcon, ShieldCheckIcon} from '@heroicons/react/24/outline';
import {PlusIcon} from '@heroicons/react/24/solid';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

import {useChatStore} from '@/store';

import {Button, IconButton} from './buttons';
import {AlertModal} from './modals';
import {SearchBar} from './search';
import {IconSideBar} from './svgs';
import Locale from '../locales';

const ChatList = dynamic(async () => (await import('./chat-list')).ChatList, {
  loading: () => null,
});

export function SideBar(props: {className?: string}) {
  const chatStore = useChatStore();
  const [enabled, setEnabled] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [showDeactivateConfirmationModal, setShowDeactivateConfirmationModal] = useState(false);

  return (
    <div
      className={classNames(
        'hidden sm:flex flex-col px-4 py-6 bg-content-grey-900 border-box rounded-[20px]',
        expanded && 'w-[320px]',
        props.className,
      )}
    >
      <div className='flex items-center justify-between'>
        {expanded && <h2 className='text-18 font-semibold text-content-white'>Chats</h2>}
        <IconButton variant='dark' onClick={() => setExpanded((prev) => !prev)}>
          <IconSideBar />
        </IconButton>
      </div>
      <div className='mt-6'>
        {expanded ? (
          <SearchBar />
        ) : (
          <IconButton variant='dark' onClick={() => setExpanded((prev) => !prev)}>
            <MagnifyingGlassIcon className='w-5 h-5 text-white' />
          </IconButton>
        )}
      </div>
      <div className='mt-5 flex-1'>
        <ChatList expanded={expanded} />
      </div>
      {expanded && (
        <div className='flex flex-col mt-4 gap-1'>
          <div className='flex justify-between'>
            <div className='flex items-center gap-1'>
              <ShieldCheckIcon className='w-5 h-5 text-content-accent-400' />
              <p className='text-12 text-content-grey-100 font-semibold'>Content Safety</p>
            </div>
            <Switch
              checked={enabled}
              onChange={(checked) => {
                if (!checked) {
                  setShowDeactivateConfirmationModal(true);
                } else {
                  setEnabled(true);
                }
              }}
              className={classNames(
                `${
                  enabled ? 'bg-content-accent' : 'bg-content-disabled'
                } relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`,
              )}
            >
              <span className='sr-only'>Use setting</span>
              <span
                aria-hidden='true'
                className={classNames(
                  `${
                    enabled ? 'translate-x-6' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`,
                )}
              />
            </Switch>
          </div>
          <p className='text-10 text-content-grey-400'>Your Personal Content is Secure</p>
        </div>
      )}
      <div className='mt-6 flex items-center'>
        <IconButton variant='primary'>
          <PlusIcon className='w-5 h-5 text-white' />
        </IconButton>
        {expanded && (
          <Button
            className='w-full'
            title={Locale.Home.NewTicket}
            onClick={() => {
              chatStore.newTicket();
            }}
          />
        )}
      </div>
      {showDeactivateConfirmationModal && (
        <AlertModal
          headTitle='Disable Content Safety'
          title='Disable Content Safety'
          description='With this feature disabled, your content will not be checked for sensitive information for the next 30 minutes.'
          confirmTitle='Deactivate Content Safety'
          open={showDeactivateConfirmationModal}
          onConfirm={() => {
            setEnabled(false);
            setShowDeactivateConfirmationModal(false);
          }}
          onClose={() => {
            setShowDeactivateConfirmationModal(false);
          }}
        />
      )}
    </div>
  );
}
