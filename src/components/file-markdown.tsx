/* eslint-disable @next/next/no-img-element */
// File Markdown.tsx
import {useState} from 'react';
import classNames from 'classnames';

import {IChatMessageFile} from '@/types';
import {ImagesBaseUrl} from '@/constant';
import Image from 'next/image';
import {IconButton} from './buttons';
import {ArrowsPointingOutIcon} from '@heroicons/react/24/outline';
import {ExpandMediaDialog} from './modals/expandMediaDialog';

interface FileMarkdownProps {
  mediaFiles: IChatMessageFile[];
  width?: number;
  height?: number;
  className?: string;
  title?: string;
}

export function FileMarkdownContent({mediaFiles, width = 400, height = 200, className, title}: FileMarkdownProps) {
  const [loaded, setLoaded] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<IChatMessageFile>();
  const [openExpandMediaDialog, setOpenExpandMediaDialog] = useState(false);

  const handleOpenMedaIndialog = (media: IChatMessageFile) => {
    setSelectedMedia(media);
    setOpenExpandMediaDialog(true);
  };

  const handleCloseExpandMediaDialog = () => {
    setSelectedMedia(undefined);
    setOpenExpandMediaDialog(false);
  };
  return (
    <>
      <div className='flex flex-col gap-6'>
        {mediaFiles.map((media) => (
          <div key={media.id} className={classNames('flex items-center gap-2 relative', className)}>
            {media.media_type.includes('image') && (
              <div className='flex relative'>
                <img
                  src={`${ImagesBaseUrl}${media.file_name}`}
                  width={width}
                  height={height}
                  alt={title ?? ''}
                  className='rounded-4'
                  onClick={() => handleOpenMedaIndialog(media)}
                />
                {/* {!loaded && (
                  <div
                    className={`mx-2 bg-gray-300 rounded-4 dark:bg-gray-600 absolute left-0 animate-pulse`}
                    style={{width, height}}
                  ></div>
                )} */}
                <IconButton
                  className='absolute -bottom-10 left-0 rounded-full hover:bg-content-grey-50'
                  onClick={() => handleOpenMedaIndialog(media)}
                >
                  <ArrowsPointingOutIcon className='w-5 h-5 text-content-grey-400' />
                </IconButton>
              </div>
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
      {selectedMedia && (
        <ExpandMediaDialog
          media={selectedMedia}
          open={openExpandMediaDialog}
          onClose={handleCloseExpandMediaDialog}
          width={600}
          height={600}
        />
      )}
    </>
  );
}
