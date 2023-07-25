import {UserCircleIcon} from '@heroicons/react/24/solid';
import Image from 'next/image';

import Logo44 from '@/assets/icons/logo-44.png';
import {IChatMessage} from '@/types';

interface IMessageItem {
  item: IChatMessage;
}

export const MessageItem = ({item}: IMessageItem) => {
  return (
    <div className='text-15 font-medium'>
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
          <p className='text-white'>{item.response}</p>
        </div>
      </div>
    </div>
  );
};
