/* eslint-disable @typescript-eslint/no-explicit-any */
import EmojiPicker, {Emoji, EmojiStyle, Theme as EmojiTheme} from 'emoji-picker-react';

import BlackBotIcon from '@/assets/icons/black-bot.svg';
import BotIcon from '@/assets/icons/bot.svg';

export function getEmojiUrl(unified: string, style: EmojiStyle) {
  return `https://cdn.staticfile.org/emoji-datasource-apple/14.0.0/img/${style}/64/${unified}.png`;
}

export function AvatarPicker(props: {onEmojiClick: (emojiId: string) => void}) {
  return (
    <EmojiPicker
      lazyLoadEmojis
      theme={EmojiTheme.AUTO}
      getEmojiUrl={getEmojiUrl}
      onEmojiClick={(e) => {
        props.onEmojiClick(e.unified);
      }}
    />
  );
}

export function Avatar(props: {model?: any; avatar?: string}) {
  if (props.model) {
    return (
      <div className='no-dark'>
        {props.model?.startsWith('gpt-4') ? (
          <BlackBotIcon className='user-avatar' />
        ) : (
          <BotIcon className='user-avatar' />
        )}
      </div>
    );
  }

  return <div className='user-avatar'>{props.avatar && <EmojiAvatar avatar={props.avatar} />}</div>;
}

export function EmojiAvatar(props: {avatar: string; size?: number}) {
  return <Emoji unified={props.avatar} size={props.size ?? 18} getEmojiUrl={getEmojiUrl} />;
}
