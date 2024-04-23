/* eslint-disable @next/next/no-img-element */
// File Markdown.tsx
import {useEffect, useState} from 'react';
import classNames from 'classnames';

import {IChatMessageFile} from '@/types';
import {APPREQUESTBASEURL, ImagesBaseUrl} from '@/constant';
import {Button, IconButton} from './buttons';
import {ArrowDownTrayIcon, ArrowsPointingOutIcon} from '@heroicons/react/24/outline';
import {ExpandMediaDialog} from './modals/expandMediaDialog';
import AppIframe from './app-iframe';
import {nanoid} from '@reduxjs/toolkit';

interface FileMarkdownProps {
  messageId: string;
  mediaFiles: IChatMessageFile[];
  width?: number;
  height?: number;
  className?: string;
  title?: string;
}

type TextFileContentType = {file_name: string; content: string[]};

export function FileMarkdownContent({
  messageId,
  mediaFiles,
  width = 400,
  height = 200,
  className,
  title,
}: FileMarkdownProps) {
  // const [loaded, setLoaded] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<IChatMessageFile>();
  const [openExpandMediaDialog, setOpenExpandMediaDialog] = useState(false);
  const [textFileContent, setTextFileContent] = useState<TextFileContentType[]>([]);

  const handleOpenMedaIndialog = (media: IChatMessageFile) => {
    setSelectedMedia(media);
    setOpenExpandMediaDialog(true);
  };

  const handleCloseExpandMediaDialog = () => {
    setSelectedMedia(undefined);
    setOpenExpandMediaDialog(false);
  };
  const handleGetTextFileContent = async () => {
    console.log('handleGetTextFileContent');
    if (mediaFiles.length === 0) return;

    for (const mediaFile of mediaFiles) {
      if (mediaFile.media_type.includes('text/plain')) {
        try {
          const response = await fetch(`${ImagesBaseUrl}${mediaFile.file_name}`);
          const text = await response.text();
          const content = text.split('\n');
          setTextFileContent([...textFileContent, {file_name: mediaFile.file_name, content}]);
        } catch (error) {
          console.error('fetching failed:', error);
        }
      }
    }
  };
  const handleDownloadTextFile = async (file_name: string, URL: string) => {
    try {
      const response = await fetch(URL);
      console.log({URL, response});
      const blob = await response.blob();
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('download faild:', error);
    }
  };
  useEffect(() => {
    console.log('check handleGetTextFileContent');
    setTextFileContent([]);
    handleGetTextFileContent();
  }, [mediaFiles]);
  return (
    <>
      <div className='flex flex-col gap-6 pt-6'>
        {mediaFiles.map((media) => (
          <div key={media.id} className={classNames('flex items-center gap-2 relative', className)}>
            {media.media_type.includes('image') && (
              <div className='flex relative'>
                <img
                  src={`${ImagesBaseUrl}${media.file_name}`}
                  width={width}
                  height={height}
                  alt={title ?? ''}
                  loading='lazy'
                  // onLoad={(e) => setLoaded(true)}
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

            {media.media_type.includes('text/plain') && media.original_file_name && (
              <div className='flex flex-col gap-6'>
                <Button
                  className='!px-6 font-poppins-semibold text-sm !h-34-px hidden'
                  iconBefore={<ArrowDownTrayIcon className='text-content-white w-4 h-4' />}
                  variant='primary'
                  title={'download file'}
                  onClick={() =>
                    handleDownloadTextFile(media.original_file_name ?? '', `${ImagesBaseUrl}${media.file_name}`)
                  }
                />
                {textFileContent.length > 0 &&
                  textFileContent.map((file) => {
                    if (file.file_name !== media.file_name) return null;
                    return (
                      <div key={`media-text-file-${file.file_name}`} className='flex flex-col text-content-white'>
                        {textFileContent && file.content.map((text) => <pre key={nanoid(6)}>{`${text}`}</pre>)}
                      </div>
                    );
                  })}
              </div>
            )}
            {media.media_type.includes('text/html') && (
              <div className='w-full text-center'>
                <AppIframe
                  src={`${APPREQUESTBASEURL}api/v1/chat-message-files/${messageId}/${media.id}/render-html`}
                  loadingTitle='the model is Loading'
                />
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
