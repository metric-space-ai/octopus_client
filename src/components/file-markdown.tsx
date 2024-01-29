/* eslint-disable @next/next/no-img-element */
// Markdown.tsx
import {useState} from 'react';
import classNames from 'classnames';

import {IChatMessageFile} from '@/types';
import {ImagesBaseUrl} from '@/constant';
import Image from 'next/image';

interface FileMarkdownProps {
  content: [IChatMessageFile];
  width?: number;
  height?: number;
  className?: string;
  title?: string;
}

export function FileMarkdownContent({content, width = 400, height = 200, className, title}: FileMarkdownProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={classNames('flex items-center gap-2 relative', className)}>
      <>
        {/* <img
        src={`${ImagesBaseUrl}${content[0]?.file_name}`}
        width={width}
        height={height}
        alt={title ?? ''}
        loading='lazy'
        // onLoad={(e) => setLoaded(true)}
        className='rounded-4'
      /> */}
        <Image
          src={`${ImagesBaseUrl}${content[0]?.file_name}`}
          width={width}
          height={height}
          alt={title ?? ''}
          loading='lazy'
          onLoad={(e) => setLoaded(true)}          
          className='rounded-4'
        />
        {!loaded && (
          <div
            className={`mx-2 bg-gray-300 rounded-4 dark:bg-gray-600 absolute left-0 animate-pulse`}
            style={{width, height}}
          ></div>
        )}
      </>
    </div>
  );
}
