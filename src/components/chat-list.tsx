import {useEffect, useRef} from 'react';

import {DragDropContext, Draggable, Droppable, OnDragEndResponder} from '@hello-pangea/dnd';
import {XCircleIcon} from '@heroicons/react/24/solid';
import classNames from 'classnames';
import {useRouter} from 'next/navigation';

import {MaskAvatar} from './mask';
import {Path} from '../constant';
import Locale from '../locales';
import {useChatStore} from '../store';
import {Mask} from '../store/mask';

export function ChatItem(props: {
  onClick?: () => void;
  onDelete?: () => void;
  title: string;
  count: number;
  time: string;
  selected: boolean;
  id: number;
  index: number;
  narrow?: boolean;
  mask: Mask;
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
    <Draggable draggableId={`${props.id}`} index={props.index}>
      {(provided) => (
        <div
          className={classNames(
            'group relative px-[14px] py-[10px] rounded-[10px] border border-background-secondary',
            props.selected && 'border-background-white',
          )}
          onClick={props.onClick}
          ref={(ele) => {
            draggableRef.current = ele;
            provided.innerRef(ele);
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          title={`${props.title}\n${Locale.ChatItem.ChatItemCount(props.count)}`}
        >
          {props.narrow ? (
            <div className='flex flex-col'>
              <div className='flex opacity-20 absolute'>
                <MaskAvatar mask={props.mask} />
              </div>
              <div className='text-24 text-center opacity-60'>{props.count}</div>
            </div>
          ) : (
            <>
              <div className='text-14 font-bold text-white whitespace-nowrap text-ellipsis overflow-hidden'>
                {props.title}
              </div>
              <div className='flex justify-between text-12 mt-2 text-content-white'>
                <div className='overflow-hidden text-ellipsis whitespace-nowrap'>
                  {Locale.ChatItem.ChatItemCount(props.count)}
                </div>
                <div className='overflow-hidden text-ellipsis whitespace-nowrap'>{props.time}</div>
              </div>
            </>
          )}

          <div className='group-hover:opacity-100 opacity-0 absolute top-1 right-1' onClickCapture={props.onDelete}>
            <XCircleIcon className='w-4 h-4 text-white' />
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function ChatList(props: {narrow?: boolean}) {
  const [sessions, selectedIndex, selectSession, moveSession] = useChatStore((state) => [
    state.sessions,
    state.currentSessionIndex,
    state.selectSession,
    state.moveSession,
  ]);
  const chatStore = useChatStore();
  const router = useRouter();

  const onDragEnd: OnDragEndResponder = (result) => {
    const {destination, source} = result;
    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    moveSession(source.index, destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='chat-list'>
        {(provided) => (
          <div className='flex flex-col' ref={provided.innerRef} {...provided.droppableProps}>
            {sessions.map((item, i) => (
              <ChatItem
                title={item.topic}
                time={new Date(item.lastUpdate).toLocaleString()}
                count={item.messages.length}
                key={item.id}
                id={item.id}
                index={i}
                selected={i === selectedIndex}
                onClick={() => {
                  router.push(Path.Chat);
                  selectSession(i);
                }}
                onDelete={() => {
                  if (!props.narrow || confirm(Locale.Home.DeleteChat)) {
                    chatStore.deleteSession(i);
                  }
                }}
                narrow={props.narrow}
                mask={item.mask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
