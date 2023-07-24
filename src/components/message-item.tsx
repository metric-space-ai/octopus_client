import {IChatMessage} from '@/types';

interface IMessageItem {
  item: IChatMessage;
}

export const MessageItem = ({item}: IMessageItem) => {
  return <div>{item.message}</div>;
};
