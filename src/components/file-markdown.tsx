/* eslint-disable @next/next/no-img-element */
// File Markdown.tsx
import {useEffect, useState} from 'react';
import classNames from 'classnames';

import {Disclosure, Transition} from '@headlessui/react';

import {IChatMessageFile} from '@/types';
import {APPREQUESTBASEURL, ImagesBaseUrl} from '@/constant';
import {IconButton} from './buttons';
import {ArrowDownTrayIcon, ArrowsPointingOutIcon, DocumentTextIcon, MusicalNoteIcon} from '@heroicons/react/24/outline';
import {ExpandMediaDialog} from './modals/expandMediaDialog';
import AppIframe from './app-iframe';
import {nanoid} from '@reduxjs/toolkit';
import {PdfTypeIcon} from './svgs';
import {PdfViewerDialog} from './modals';

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
  const [pdfUrl, setPdfUrl] = useState('');
  const [openPdfViewer, setOpenPdfViewer] = useState(false);

  const handleOpenMedaIndialog = (media: IChatMessageFile) => {
    setSelectedMedia(media);
    setOpenExpandMediaDialog(true);
  };

  const handleOpenPdfViewer = async (media: IChatMessageFile) => {
    const url = `${ImagesBaseUrl}${media.file_name}`;
    console.log('handleOpenPdfViewer...', {url, media});
    // const response = await fetch(url);
    // const blob = await response.blob();
    // const response = await fetch(url);
    // console.log({URL, response});
    // const blob = await response.blob();
    // const href = window.URL.createObjectURL(blob);
    setSelectedMedia(media);
    setPdfUrl(url);
    setOpenPdfViewer(true);
  };
  const handleClosePdfViewer = () => {
    setSelectedMedia(undefined);
    setPdfUrl('');
    setOpenPdfViewer(false);
  };
  const handleCloseExpandMediaDialog = () => {
    setSelectedMedia(undefined);
    setOpenExpandMediaDialog(false);
  };
  const handleGetTextFileContent = async () => {
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
    setTextFileContent([]);
    handleGetTextFileContent();
  }, [mediaFiles]);
  return (
    <>
      <div className='flex flex-col gap-6 pt-6'>
        {mediaFiles.map((media) => (
          <div key={media.id} className={classNames('flex items-center gap-4 relative', className)}>
            {media.media_type.includes('image') && (
              <div className='flex relative'>
                <img
                  src={`${ImagesBaseUrl}${media.file_name}`}
                  width={width}
                  height={height}
                  alt={title ?? ''}
                  loading='lazy'
                  // onLoad={(e) => setLoaded(true)}
                  className='rounded-2xs'
                  onClick={() => handleOpenMedaIndialog(media)}
                />
                {/* {!loaded && (
                  <div
                    className={`mx-2 bg-gray-300 rounded-2xs dark:bg-gray-600 absolute left-0 animate-pulse`}
                    style={{width, height}}
                  ></div>
                )} */}
                <IconButton
                  className='absolute -bottom-10 left-0 rounded-full hover:bg-grey-600'
                  onClick={() => handleOpenMedaIndialog(media)}
                >
                  <ArrowsPointingOutIcon className='w-5 h-5 text-grey-400' />
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

            {media.media_type.includes('application/pdf') && (media.file_name || media.original_file_name) && (
              <div className='flex flex-col gap-3 relative items-start w-full'>
                <div className='flex pl-3 pt-2.5 pb-3 pr-6 min-w-[285px] bg-grey-800 rounded-xl gap-3 flex-wrap cursor-pointer max-w-[298px]'>
                  <div className='flex items-center justify-center w-10 h-10 p-1 rounded-sm bg-[#DC0F4B] '>
                    <PdfTypeIcon className='w-4 text-grey-0' />
                  </div>
                  <div className='flex gap-[25px] items-center'>
                    <div className='flex flex-col'>
                      <p className='text-grey-0 text-sm leading-relaxed font-semibold max-w-[152px] truncate ...'>
                        {media.original_file_name ?? media.id}
                      </p>
                      <span
                        className='block text-grey-100 text-xs leading-relaxed font-normal'
                        onClick={() => handleOpenPdfViewer(media)}
                      >
                        View<b>{` PDF `}</b>here
                      </span>
                    </div>
                    <ArrowDownTrayIcon
                      className='flex items-center justify-center h-8 w-8 p-1.5 text-grey-0 bg-grey-900 rounded-4xl'
                      onClick={() =>
                        handleDownloadTextFile(
                          media.original_file_name ?? `${media.file_name}.pdf`,
                          `${ImagesBaseUrl}${media.file_name}`,
                        )
                      }
                    />
                  </div>
                </div>
                <Disclosure>
                  {({open}) => (
                    <>
                      <Disclosure.Panel className={"w-full"}>
                        <embed
                            src={`${ImagesBaseUrl}${media.file_name}`}
                            className={classNames('w-full h-[480px] flex-1')}
                            type='application/pdf'
                            width='100%'
                            height='100%'
                          />
                      </Disclosure.Panel>
                      <Disclosure.Button>
                        <span className='text-grey-100 text-sm font-semibold'>{open ? 'Collapse' : 'Expand'}</span>
                      </Disclosure.Button>
                    </>
                  )}
                </Disclosure>
              </div>
            )}
            {media.media_type.includes('audio/aa') && (media.file_name || media.original_file_name) && (
              <div className='flex flex-col gap-4'>
                <div
                  className={classNames(
                    'flex pl-3 pt-2.5 pb-3 pr-6 min-w-[285px] bg-grey-800 rounded-xl gap-3 flex-wrap cursor-pointer',
                    'hidden',
                  )}
                  onClick={() =>
                    handleDownloadTextFile(
                      media.original_file_name ?? `${media.file_name}.aac`,
                      `${ImagesBaseUrl}${media.file_name}`,
                    )
                  }
                >
                  <div className='flex items-center justify-center w-10 h-10 p-1 rounded-sm bg-primary '>
                    <MusicalNoteIcon className='w-4 text-grey-0' />
                  </div>
                  <div className='flex flex-col'>
                    <p className='text-grey-0 text-sm leading-relaxed font-semibold'>
                      {media.original_file_name ?? media.id}
                    </p>
                    <span className='block text-grey-100/60 text-xs leading-relaxed font-normal'>aac</span>
                  </div>
                </div>
                <figure>
                  <figcaption className='text-grey-0 mb-2'>Listen to : {media.original_file_name}</figcaption>
                  <audio className='w-full' controls src={`${ImagesBaseUrl}${media.file_name}`}></audio>
                </figure>
              </div>
            )}

            {media.media_type.includes('text/plain') && media.original_file_name && (
              <div className='flex flex-col gap-3'>
                <div
                  className={classNames(
                    'flex pl-3 pt-2.5 pb-3 pr-6 min-w-[285px] mr-auto bg-grey-800 rounded-xl gap-3 flex-wrap cursor-pointer',
                  )}
                  onClick={() =>
                    handleDownloadTextFile(media.original_file_name ?? '', `${ImagesBaseUrl}${media.file_name}`)
                  }
                >
                  <div className='flex items-center justify-center w-10 h-10 p-1 rounded-sm bg-primary '>
                    <DocumentTextIcon className='w-4 text-grey-0' />
                  </div>
                  <div className='flex flex-col'>
                    <p className='text-grey-0 text-sm leading-relaxed font-semibold'>
                      {media.original_file_name ?? media.id}
                    </p>
                    <span className='block text-grey-100/60 text-xs leading-relaxed font-normal'>txt</span>
                  </div>
                </div>
                {textFileContent.length > 0 &&
                  textFileContent.map((file) => {
                    if (file.file_name !== media.file_name) return null;
                    return (
                      <div key={`media-text-file-${file.file_name}`} className='flex flex-col text-grey-0'>
                        {textFileContent &&
                          file.content.map((text) => (
                            <pre key={nanoid(6)} className='whitespace-pre-wrap leading-tight mb-1'>{`${text}`}</pre>
                          ))}
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
      {pdfUrl && <PdfViewerDialog url={pdfUrl} open={openPdfViewer} onClose={handleClosePdfViewer} />}
    </>
  );
}
