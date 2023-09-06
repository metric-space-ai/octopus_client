// Markdown.tsx
import classNames from 'classnames';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

import {IChatMessageFile} from '@/types';

interface FileMarkdownProps {
  content: [IChatMessageFile];
  width?: number;
  height?: number;
  className?: string;
}

export function FileMarkdownContent({content, width = 1200, height = 200, className}: FileMarkdownProps) {
  return (
    <div className={classNames('flex items-center gap-2', className)}>
      <Image src={'https://api.octopus-ai.app/' + content[0]?.file_name} width={1200} height={200} alt={''} />
    </div>
  );
}
