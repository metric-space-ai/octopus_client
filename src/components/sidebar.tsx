import {useEffect, useRef} from 'react';

import {PlusIcon, XMarkIcon} from '@heroicons/react/24/solid';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/navigation';

import {IconButton} from './buttons';
import {SearchBar} from './search';
import {MAX_SIDEBAR_WIDTH, MIN_SIDEBAR_WIDTH, NARROW_SIDEBAR_WIDTH, Path} from '../constant';
import Locale from '../locales';
import {useAppConfig, useChatStore} from '../store';
import {useMobileScreen} from '../utils';

const ChatList = dynamic(async () => (await import('./chat-list')).ChatList, {
  loading: () => null,
});

function useHotKey() {
  const chatStore = useChatStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.altKey || e.ctrlKey) {
        const n = chatStore.sessions.length;
        const limit = (x: number) => (x + n) % n;
        const i = chatStore.currentSessionIndex;
        if (e.key === 'ArrowUp') {
          chatStore.selectSession(limit(i - 1));
        } else if (e.key === 'ArrowDown') {
          chatStore.selectSession(limit(i + 1));
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });
}

function useDragSideBar() {
  const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x);

  const config = useAppConfig();
  const startX = useRef(0);
  const startDragWidth = useRef(config.sidebarWidth ?? 300);
  const lastUpdateTime = useRef(Date.now());

  const handleMouseMove = useRef((e: MouseEvent) => {
    if (Date.now() < lastUpdateTime.current + 50) {
      return;
    }
    lastUpdateTime.current = Date.now();
    const d = e.clientX - startX.current;
    const nextWidth = limit(startDragWidth.current + d);
    config.update((config) => (config.sidebarWidth = nextWidth));
  });

  const handleMouseUp = useRef(() => {
    startDragWidth.current = config.sidebarWidth ?? 300;
    window.removeEventListener('mousemove', handleMouseMove.current);
    window.removeEventListener('mouseup', handleMouseUp.current);
  });

  const onDragMouseDown = (e: MouseEvent) => {
    startX.current = e.clientX;

    window.addEventListener('mousemove', handleMouseMove.current);
    window.addEventListener('mouseup', handleMouseUp.current);
  };
  const isMobileScreen = useMobileScreen();
  const shouldNarrow = !isMobileScreen && config.sidebarWidth < MIN_SIDEBAR_WIDTH;

  useEffect(() => {
    const barWidth = shouldNarrow ? NARROW_SIDEBAR_WIDTH : limit(config.sidebarWidth ?? 300);
    const sideBarWidth = isMobileScreen ? '100vw' : `${barWidth}px`;
    document.documentElement.style.setProperty('--sidebar-width', sideBarWidth);
  }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);

  return {
    onDragMouseDown,
    shouldNarrow,
  };
}

export function SideBar(props: {className?: string}) {
  const chatStore = useChatStore();

  // drag side bar
  const {shouldNarrow} = useDragSideBar();
  const router = useRouter();

  useHotKey();

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
      <div
        className='mt-5 flex-1'
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            router.push(Path.Home);
          }
        }}
      >
        <ChatList narrow={shouldNarrow} />
      </div>

      <div>
        <div className='inline-flex'>
          <div className='hidden'>
            <IconButton
              icon={<XMarkIcon className='text-white' />}
              onClick={() => {
                if (confirm(Locale.Home.DeleteChat)) {
                  chatStore.deleteSession(chatStore.currentSessionIndex);
                }
              }}
            />
          </div>
        </div>
        <IconButton
          className='w-full'
          icon={<PlusIcon className='text-white' />}
          text={shouldNarrow ? undefined : Locale.Home.NewChat}
          onClick={() => {
            chatStore.newSession();
            router.push(Path.Chat);
          }}
          shadow
        />
      </div>
    </div>
  );
}
