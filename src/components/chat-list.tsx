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
        'flex justify-between relative px-3 py-[10px] rounded-xl',
        !expanded && '!px-[10px]',
        selected && 'bg-grey-100',
        (!selected || isNewTicketOn) && 'cursor-pointer bg-grey-0 dark:bg-grey-900',
      )}
      onClick={!selected ? onClick : handleSwitchOffNewTicket}
    >
      <div className='flex items-center gap-2 w-full max-w-[210px]'>
        {
          <ChatBubbleLeftRightIcon
            className={classNames(
              'w-5 h-5 text-grey-900',
              (!selected || isNewTicketOn) && 'dark:text-grey-0',
              selected && 'text-primary dark:text-primary',
            )}
          />
        }
        {expanded &&
          (editable ? (
            <form onSubmit={handleSubmitForm} className='relative flex items-center flex-1 -my-1'>
              <input
                className={classNames(
                  `rounded-xl bg-transparent border border-primary px-2 text-xs w-full py-1 text-grey-800`,
                  (!selected || isNewTicketOn) && 'dark:text-grey-0',
                )}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <button
                title='submit rename ticket'
                className='bg-primary absolute right-1 !p-0 w-5 h-5 flex rounded-full items-center justify-center'
                type='submit'
              >
                <CheckIcon className='w-4 h-4 text-grey-0' />
              </button>
            </form>
          ) : (
            <div
              className={classNames(
                'flex-1 text-sm whitespace-nowrap text-ellipsis overflow-hidden text-grey-900',
                // selected ? '!text-grey-900' : '',
                (!selected || isNewTicketOn) && 'dark:text-grey-0',
              )}
              title={title}
            >
              {title}
            </div>
          ))}
      </div>
      {false && (
        <div className='flex justify-between text-xs mt-2 text-grey-0'>
          <div className='overflow-hidden text-ellipsis whitespace-nowrap'>{time}</div>
        </div>
      )}
      {expanded && (
        <div className='flex gap-2 items-center'>
          {editable ? (
            <div className='text-grey-600 hover:text-grey-800 cursor-pointer' onClickCapture={() => setEditable(false)}>
              <XMarkIcon className='w-4 h-4' />
            </div>
          ) : (
            <div className='text-grey-600 hover:text-grey-800 cursor-pointer' onClickCapture={() => setEditable(true)}>
              <PencilSquareIcon className='w-4 h-4' />
            </div>
          )}
          <div className='text-grey-600 hover:text-grey-800 cursor-pointer' onClickCapture={onDelete}>
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
            <h6 className='text-xs leading-5 font-semibold text-grey-600 dark:text-grey-100/50 pt-3'>Today</h6>
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
            <h6 className='text-xs leading-5 font-semibold text-grey-600 dark:text-grey-100/50 pt-3'>
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
            <h6 className='text-xs leading-5 font-semibold text-grey-600 dark:text-grey-100/50 pt-3'>
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
            <h6 className='text-xs leading-5 font-semibold text-grey-600 dark:text-grey-100/50 pt-3'>Older</h6>
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
