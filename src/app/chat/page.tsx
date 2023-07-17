'use client';

import dynamic from 'next/dynamic';

import {Loading} from '@/components/loading';

const Chat = dynamic(async () => (await import('../../components/chat')).Chat, {
  loading: () => <Loading noLogo />,
});

export default function ChatPage() {
  return (
    <div className='h-full flex flex-col'>
      <Chat />
    </div>
  );
}
