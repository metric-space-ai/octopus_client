import {useEffect, useRef} from 'react';

import {ChatBubbleLeftRightIcon} from '@heroicons/react/24/outline';
import {XCircleIcon} from '@heroicons/react/24/solid';
import classNames from 'classnames';

import {useChatStore} from '@/store';

import Locale from '../locales';

export function ChatItem(props: {
  onClick?: () => void;
  onDelete?: () => void;
  title: string;
  time: string;
  selected: boolean;
  expanded?: boolean;
}) {
  const draggableRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (props.selected && draggableRef.current) {
      draggableRef.current?.scrollIntoView({
        block: 'center',
      });
    }
  }, [props.selected]);
  return (
    <div
      className={classNames(
        'group relative px-3 py-[10px] rounded-full bg-content-black cursor-pointer',
        !props.expanded && '!px-[10px]',
        props.selected && 'bg-content-grey-100',
      )}
      onClick={props.onClick}
    >
      <div className='flex items-center gap-2'>
        {
          <ChatBubbleLeftRightIcon
            className={classNames('w-5 h-5 text-white', props.selected && '!text-content-black')}
          />
        }
        {props.expanded && (
          <div
            className={classNames(
              'flex-1 text-14 text-white whitespace-nowrap text-ellipsis overflow-hidden',
              props.selected && '!text-content-black',
            )}
          >
            {props.title}
          </div>
        )}
      </div>
      {false && (
        <div className='flex justify-between text-12 mt-2 text-content-white'>
          <div className='overflow-hidden text-ellipsis whitespace-nowrap'>{props.time}</div>
        </div>
      )}
      {props.expanded && (
        <div className='group-hover:opacity-100 opacity-0 absolute top-1 right-1' onClickCapture={props.onDelete}>
          <XCircleIcon className='w-4 h-4 text-white' />
        </div>
      )}
    </div>
  );
}

export function ChatList({expanded}: {expanded?: boolean}) {
  const {tickets, currentTicketId, selectTicketId, deleteTicket} = useChatStore();

  return (
    <div className={classNames('flex flex-col gap-3', expanded && 'min-w-[280px]')}>
      {tickets.map((ticket) => (
        <ChatItem
          key={ticket.id}
          title={ticket.name}
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
    </div>
  );
}
