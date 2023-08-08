import {useCallback, useEffect} from 'react';

import {UserIcon} from '@heroicons/react/24/solid';

import {getChatMessageApi} from '@/services/chat.service';
import {useChatStore} from '@/store';
import {IChatMessage} from '@/types';

import {MarkdownContent} from './markdown';
import {AnimateDots, LogoIcon} from './svgs';

interface IMessageItem {
  item: IChatMessage;
}

export const MessageItem = ({item}: IMessageItem) => {
  const {updateMessage} = useChatStore();
  const loading = item.status === 'Asked';

  const checkMessageResponse = useCallback(
    (after: number) => {
      setTimeout(() => {
        getChatMessageApi(item.chat_id, item.id).then((res) => {
          if (res.data.status === 'Asked') {
            checkMessageResponse(2000);
          } else {
            updateMessage(res.data);
          }
        });
      }, after);
    },
    [item.chat_id, item.id, updateMessage],
  );

  useEffect(() => {
    if (item.status === 'Asked') {
      const estimationResponseTime = new Date(item.estimated_response_at);
      const now = new Date();
      const diffTime = estimationResponseTime.valueOf() - now.valueOf();
      checkMessageResponse(diffTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  return (
    <div className='mt-3 text-15 font-medium'>
      <div className='flex gap-3 items-center'>
        <div className='w-9 h-9 flex items-center justify-center bg-content-black rounded-full'>
          <UserIcon className='w-6 h-6 text-content-grey-100' />
        </div>
        {item.message}
      </div>
      <div className='mt-3 flex gap-3'>
        <div className='w-9 h-9 flex items-center justify-center bg-content-black rounded-full'>
          <LogoIcon width={22} height={20} color='#F5F5F5' />
        </div>
        <div className='flex-1 py-4 px-5 bg-content-black rounded-[20px] rounded-tl-none'>
          {loading ? <AnimateDots /> : <MarkdownContent content={item.response} />}
        </div>
      </div>
    </div>
  );
};
