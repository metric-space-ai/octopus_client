/* eslint-disable @next/next/no-img-element */
// Markdown.tsx
import classNames from 'classnames';

import {IChatMessageFile} from '@/types';

interface FileMarkdownProps {
  content: [IChatMessageFile];
  width?: number;
  height?: number;
  className?: string;
}

export function FileMarkdownContent({content, width = 400, height = 200, className}: FileMarkdownProps) {
  return (
    <div className={classNames('flex items-center gap-2', className)}>
      <img src={'https://api.octopus-ai.app/' + content[0]?.file_name} width={width} height={height} alt='' />
    </div>
  );
}
