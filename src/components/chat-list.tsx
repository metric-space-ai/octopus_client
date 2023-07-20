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
  narrow?: boolean;
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
        'group relative px-[14px] py-[10px] rounded-[10px] border border-background-secondary',
        props.selected && 'border-background-white',
      )}
      onClick={props.onClick}
    >
      {props.narrow ? (
        <div className='flex flex-col'>
          <div className='text-24 text-center opacity-60'>{<ChatBubbleLeftRightIcon />}</div>
        </div>
      ) : (
        <>
          <div className='text-14 font-bold text-white whitespace-nowrap text-ellipsis overflow-hidden'>
            {props.title}
          </div>
          <div className='flex justify-between text-12 mt-2 text-content-white'>
            <div className='overflow-hidden text-ellipsis whitespace-nowrap'>{props.time}</div>
          </div>
        </>
      )}

      <div className='group-hover:opacity-100 opacity-0 absolute top-1 right-1' onClickCapture={props.onDelete}>
        <XCircleIcon className='w-4 h-4 text-white' />
      </div>
    </div>
  );
}

export function ChatList(props: {narrow?: boolean}) {
  const {tickets, currentTicketId, selectTicketId, deleteTicket} = useChatStore();

  return (
    <div className='min-w-[280px] flex flex-col gap-2'>
      {tickets.map((ticket) => (
        <ChatItem
          key={ticket.id}
          title={ticket.name}
          time={new Date(ticket.updated_at).toLocaleString()}
          selected={ticket.id === currentTicketId}
          onClick={() => {
            selectTicketId(ticket.id);
          }}
          onDelete={() => {
            if (!props.narrow || confirm(Locale.Home.DeleteChat)) {
              deleteTicket(ticket.id);
            }
          }}
          narrow={props.narrow}
        />
      ))}
    </div>
  );
}
