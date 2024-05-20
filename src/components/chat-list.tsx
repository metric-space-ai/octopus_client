import {useCallback, useEffect, useRef, useState} from 'react';

import {ChatBubbleLeftRightIcon, CheckIcon, PencilSquareIcon, TrashIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {XCircleIcon} from '@heroicons/react/24/solid';
import classNames from 'classnames';

import {useChatStore} from '@/store';

import Locale from '../locales';
import {whenDidItHappened} from '@/helpers/whenDidItHappened';
import {ITicket} from '@/types';
import {Button, IconButton} from './buttons';

export function ChatItem({
  onClick,
  onDelete,
  title,
  time,
  selected,
  expanded,
  onRename = () => {},
  isNewTicketOn = false,
  newTicketToggler = () => {},
}: {
  onClick?: () => void;
  onDelete?: () => void;
  onRename?: (name: string) => void;
  title: string;
  time: string;
  selected: boolean;
  expanded?: boolean;
  isNewTicketOn?: boolean;
  newTicketToggler?: (toggle: boolean) => void;
}) {
  const draggableRef = useRef<HTMLDivElement | null>(null);

  const [editName, setEditName] = useState(title);
  const [editable, setEditable] = useState(false);

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onRename(editName);
    setEditable(false);
  };

  useEffect(() => {
    if (selected && draggableRef.current) {
      draggableRef.current?.scrollIntoView({
        block: 'center',
      });
    }
  }, [selected]);
  const handleSwitchOffNewTicket = () => {
    newTicketToggler(false);
  };
  return (
    <div
      className={classNames(
        'flex justify-between relative px-3 py-[10px] rounded-full bg-content-black ',
        !expanded && '!px-[10px]',
        selected && 'bg-content-grey-100',
        (!selected || isNewTicketOn) && 'cursor-pointer',
      )}
      onClick={!selected ? onClick : handleSwitchOffNewTicket}
    >
      <div className='flex items-center gap-2 w-full max-w-[210px]'>
        {<ChatBubbleLeftRightIcon className={classNames('w-5 h-5 text-white', selected && '!text-content-black')} />}
        {expanded &&
          (editable ? (
            <form onSubmit={handleSubmitForm} className='relative flex items-center flex-1 -my-1'>
              <input
                className={`rounded-20 bg-transparent border border-content-accent px-2 text-xs w-full py-1 ${
                  selected ? 'text-content-grey-900' : 'text-content-white'
                }`}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <button
                title='submit rename ticket'
                className='bg-content-accent absolute right-1 !p-0 w-5 h-5 flex rounded-full items-center justify-center'
                type='submit'
              >
                <CheckIcon className='w-4 h-4 text-content-white' />
              </button>
            </form>
          ) : (
            <div
              className={classNames(
                'flex-1 text-sm text-white whitespace-nowrap text-ellipsis overflow-hidden',
                selected ? '!text-content-black' : '',
              )}
              title={title}
            >
              {title}
            </div>
          ))}
      </div>
      {false && (
        <div className='flex justify-between text-xs mt-2 text-content-white'>
          <div className='overflow-hidden text-ellipsis whitespace-nowrap'>{time}</div>
        </div>
      )}
      {expanded && (
        <div className='flex gap-2 items-center'>
          {editable ? (
            <div
              className='text-content-grey-600 hover:text-content-grey-900 cursor-pointer'
              onClickCapture={() => setEditable(false)}
            >
              <XMarkIcon className='w-4 h-4' />
            </div>
          ) : (
            <div
              className='text-content-grey-600 hover:text-content-grey-900 cursor-pointer'
              onClickCapture={() => setEditable(true)}
            >
              <PencilSquareIcon className='w-4 h-4' />
            </div>
          )}
          <div className='text-content-grey-600 hover:text-content-grey-900 cursor-pointer' onClickCapture={onDelete}>
            <TrashIcon className='w-4 h-4' />
          </div>
        </div>
      )}
    </div>
  );
}

export function ChatList({expanded}: {expanded?: boolean}) {
  const {tickets, currentTicketId, selectTicketId, deleteTicket, renameTicket, isNewTicket, changeNewTicketToggle} =
    useChatStore();

  const {defaultValue, today, yesterday, older, prev7Days} = whenDidItHappened(tickets, 'updated_at');

  if (tickets)
    return (
      <div className={classNames('flex flex-col gap-3', expanded && 'min-w-[280px]')}>
        {today && today.length > 0 && (
          <>
            <h6 className='text-xs leading-5 font-poppins-semibold text-content-grey-100/50 pt-3'>Today</h6>
            {today?.map((ticket) => (
              <ChatItem
                key={ticket.id}
                title={ticket.name}
                isNewTicketOn={isNewTicket}
                newTicketToggler={changeNewTicketToggle}
                time={new Date(ticket.updated_at).toLocaleString()}
                expanded={expanded}
                selected={ticket.id === currentTicketId}
                onClick={() => {
                  selectTicketId(ticket.id);
                }}
                onRename={(name) => {
                  renameTicket(ticket.id, {name});
                }}
                onDelete={() => {
                  if (confirm(Locale.Home.DeleteChat)) {
                    deleteTicket(ticket.id);
                  }
                }}
              />
            ))}
          </>
        )}
        {yesterday && yesterday.length > 0 && (
          <>
            <h6 className='text-xs leading-5 font-poppins-semibold text-content-grey-100/50 pt-3'>
              {expanded ? 'Yesterday' : 'Yest...'}
            </h6>
            {yesterday?.map((ticket) => (
              <ChatItem
                key={ticket.id}
                title={ticket.name}
                isNewTicketOn={isNewTicket}
                newTicketToggler={changeNewTicketToggle}
                time={new Date(ticket.updated_at).toLocaleString()}
                expanded={expanded}
                selected={ticket.id === currentTicketId}
                onClick={() => {
                  selectTicketId(ticket.id);
                }}
                // onRenamed={() =>
                //   deleteTicket(ticket.id)}
                onDelete={() => {
                  if (confirm(Locale.Home.DeleteChat)) {
                    deleteTicket(ticket.id);
                  }
                }}
              />
            ))}
          </>
        )}
        {prev7Days && prev7Days.length > 0 && (
          <>
            <h6 className='text-xs leading-5 font-poppins-semibold text-content-grey-100/50 pt-3'>
              {expanded ? 'Previous 7 Days' : 'Pre 7...'}
            </h6>
            {prev7Days?.map((ticket) => (
              <ChatItem
                key={ticket.id}
                title={ticket.name}
                isNewTicketOn={isNewTicket}
                newTicketToggler={changeNewTicketToggle}
                time={new Date(ticket.updated_at).toLocaleString()}
                expanded={expanded}
                selected={ticket.id === currentTicketId}
                onClick={() => {
                  selectTicketId(ticket.id);
                }}
                onDelete={() => {
                  if (confirm(Locale.Home.DeleteChat)) {
                    deleteTicket(ticket.id);
                  }
                }}
              />
            ))}
          </>
        )}
        {older && older.length > 0 && (
          <>
            <h6 className='text-xs leading-5 font-poppins-semibold text-content-grey-100/50 pt-3'>Older</h6>
            {older?.map((ticket) => (
              <ChatItem
                key={ticket.id}
                title={ticket.name}
                isNewTicketOn={isNewTicket}
                newTicketToggler={changeNewTicketToggle}
                time={new Date(ticket.updated_at).toLocaleString()}
                expanded={expanded}
                selected={ticket.id === currentTicketId}
                onClick={() => {
                  selectTicketId(ticket.id);
                }}
                onDelete={() => {
                  if (confirm(Locale.Home.DeleteChat)) {
                    deleteTicket(ticket.id);
                  }
                }}
              />
            ))}
          </>
        )}
      </div>
      // <div className={classNames('flex flex-col gap-3', expanded && 'min-w-[280px]')}>
      //   {tickets.map((ticket) => (
      //     <ChatItem
      //       key={ticket.id}
      //       title={ticket.name}
      //       time={new Date(ticket.updated_at).toLocaleString()}
      //       expanded={expanded}
      //       selected={ticket.id === currentTicketId}
      //       onClick={() => {
      //         selectTicketId(ticket.id);
      //       }}
      //       onDelete={() => {
      //         if (confirm(Locale.Home.DeleteChat)) {
      //           deleteTicket(ticket.id);
      //         }
      //       }}
      //     />
      //   ))}
      // </div>
    );
}
