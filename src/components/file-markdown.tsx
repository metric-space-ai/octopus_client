/* eslint-disable @next/next/no-img-element */
// File Markdown.tsx
import {useState} from 'react';
import classNames from 'classnames';

import {IChatMessageFile} from '@/types';
import {ImagesBaseUrl} from '@/constant';
import Image from 'next/image';

interface FileMarkdownProps {
  mediaFiles: IChatMessageFile[];
  width?: number;
  height?: number;
  className?: string;
  title?: string;
}

export function FileMarkdownContent({mediaFiles, width = 400, height = 200, className, title}: FileMarkdownProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className='flex flex-col gap-6'>
      {mediaFiles.map((media) => (
        <div key={media.id} className={classNames('flex items-center gap-2 relative', className)}>
          {media.media_type.includes('image') && (
            <>
              <Image
                src={`${ImagesBaseUrl}${media.file_name}`}
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
          )}
          {media.media_type.includes('video') && (
            <div>
              <video width='400' className='w-full' controls>
                <source src={`${ImagesBaseUrl}${media.file_name}`} type={media.media_type} />
              </video>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
