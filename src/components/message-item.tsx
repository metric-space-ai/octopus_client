import {useCallback, useEffect} from 'react';

import {UserCircleIcon} from '@heroicons/react/24/solid';
import Image from 'next/image';

import Logo44 from '@/assets/icons/logo-44.png';
import {getChatMessageApi} from '@/services/chat.service';
import {useChatStore} from '@/store';
import {IChatMessage} from '@/types';

import {AnimateDots} from './svgs';

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
        <UserCircleIcon className='w-9 h-9 text-content-grey-900' />
        {item.message}
      </div>
      <div className='mt-3 flex gap-3'>
        <Image
          className='w-9 h-9 object-cover rounded-full'
          width={0}
          height={0}
          priority
          sizes='100vw'
          src={Logo44}
          alt='logo'
        />
        <div className='py-4 px-5 bg-content-black rounded-[20px] rounded-tl-none'>
          {loading ? <AnimateDots /> : <p className='text-white'>{item.response}</p>}
        </div>
      </div>
    </div>
  );
};
