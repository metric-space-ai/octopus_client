import React, {Fragment, useEffect, useState} from 'react';

import {Dialog, Disclosure, Transition} from '@headlessui/react';
import {ArrowDownTrayIcon, ChevronUpIcon, LinkIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import {Button} from '@/components/buttons';
import {Spinner} from '@/components/spinner';
import {IDocumentMarkdown, IFile, IKnoledgebook} from '@/types';

// import Highlight from 'react-highlight';

const DynamicShowChaptersInDisclosure = dynamic(async () => (await import('./showChaptersInDisclosure')).default, {
  ssr: false,
  loading: () => <div className='flex items-center justify-center p-7 h-32 bg-grey-150 animate-pulse' />,
});
const DynamicMarkdownContent = dynamic(async () => (await import('../../markdown')).MarkdownContent, {
  ssr: false,
  loading: () => <div className='flex items-center justify-center p-7 h-32 bg-grey-150 animate-pulse' />,
});
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: IFile | null;
}

const ShowFileContentModalDialog = ({isOpen, onClose, file}: ModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [jsonData, setJsonData] = useState<IKnoledgebook | string | IDocumentMarkdown>('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (isOpen && file && ['KnowledgeBook', 'Document'].includes(file.type)) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(file.url);

          if (!response.ok) {
            throw new Error('Error fetching the JSON file');
          }

          const data: IKnoledgebook | string | IDocumentMarkdown = await response.json();
          setJsonData(data);
          console.log(data);
          // Creating a downloadable URL from the fetched JSON data
          const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);
          setError('');
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
    if (!open) {
      setJsonData('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-6xl transform overflow-hidden rounded-2xl bg-grey-50 dark:bg-background p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-grey-900 dark:text-grey-0 mb-2'>
                  Knowledge Book Content
                </Dialog.Title>
                <div className='flex flex-col justify-between flex-1 gap-6 overflow-hidden'>
                  {typeof jsonData === 'string' && (
                    <div
                      className={classNames(
                        'min-h-[240px] bg-grey-900 text-grey-0 dark:text-grey-0 p-1 flex flex-1 max-w-full',
                        isLoading && 'items-center justify-center',
                        !isLoading && 'text-left flex-col',
                        '[&_pre]:flex-1',
                      )}
                      style={{direction: 'rtl'}}
                    >
                      {isLoading && !jsonData ? (
                        <Spinner size='medium' />
                      ) : (
                        <>
                          {jsonData && (
                            <span style={{direction: 'ltr'}}>
                              <DynamicMarkdownContent content={jsonData ?? ''} />
                            </span>
                          )}
                          {error && (
                            <span style={{direction: 'ltr'}}>
                              <DynamicMarkdownContent content={error} />
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {typeof jsonData !== 'string' && (
                    <>
                      {'markdown' in jsonData ? (
                        <div className='flex flex-col gap-3 max-h-[70vh] custom-scrollbar-thumb'>
                          <Disclosure>
                            {({open}) => (
                              <>
                                <Disclosure.Button
                                  className={
                                    'w-full flex justify-between items-center rounded-2xl text-primary-medium bg-primary-150/10 px-6 py-4'
                                  }
                                >
                                  <h2 className='text-lg text-primary dark:text-grey-50 font-semibold'>Content</h2>
                                  <ChevronUpIcon
                                    className={classNames(
                                      'h-5 w-5 text-primary dark:text-grey-50',
                                      open && 'rotate-180 transform',
                                    )}
                                  />
                                </Disclosure.Button>
                                <Transition
                                  enter='transition duration-100 ease-out'
                                  enterFrom='transform scale-95 opacity-0'
                                  enterTo='transform scale-100 opacity-100'
                                  leave='transition duration-75 ease-out'
                                  leaveFrom='transform scale-100 opacity-100'
                                  leaveTo='transform scale-95 opacity-0'
                                >
                                  <Disclosure.Panel className={'w-full p-1 rounded-b-lg bg-primary-150/10'}>
                                    <div
                                      className={classNames(
                                        'min-h-[240px] max-h-[420px] p-1 flex flex-1 max-w-full text-left flex-col custom-scrollbar-thumb ',
                                        '[&_pre]:flex-1',
                                      )}
                                      style={{direction: 'rtl'}}
                                    >
                                      <span style={{direction: 'ltr'}}>
                                        <DynamicMarkdownContent content={jsonData.markdown ?? ''} />
                                      </span>
                                    </div>
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                          <Disclosure>
                            {({open}) => (
                              <>
                                <Disclosure.Button
                                  className={
                                    'w-full flex justify-between items-center rounded-2xl text-primary-medium bg-primary-150/10 px-6 py-4'
                                  }
                                >
                                  <h2 className='text-lg text-primary dark:text-grey-50 font-semibold'>Summary</h2>
                                  <ChevronUpIcon
                                    className={classNames(
                                      'h-5 w-5 text-primary dark:text-grey-50',
                                      open && 'rotate-180 transform',
                                    )}
                                  />
                                </Disclosure.Button>
                                <Transition
                                  enter='transition duration-100 ease-out'
                                  enterFrom='transform scale-95 opacity-0'
                                  enterTo='transform scale-100 opacity-100'
                                  leave='transition duration-75 ease-out'
                                  leaveFrom='transform scale-100 opacity-100'
                                  leaveTo='transform scale-95 opacity-0'
                                >
                                  <Disclosure.Panel className={'w-full p-1 rounded-b-lg bg-primary-150/10'}>
                                    <div
                                      className={classNames(
                                        'min-h-[240px] max-h-[420px] p-1 flex flex-1 max-w-full text-left flex-col custom-scrollbar-thumb ',
                                        '[&_pre]:flex-1',
                                      )}
                                      style={{direction: 'rtl'}}
                                    >
                                      <span style={{direction: 'ltr'}}>
                                        <DynamicMarkdownContent content={jsonData.summary ?? ''} />
                                      </span>
                                    </div>
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        </div>
                      ) : (
                        <div className='flex flex-col gap-3 max-h-[70vh] custom-scrollbar-thumb'>
                          <div className='flex flex-wrap gap-2.5'>
                            <h2 className='text-lg text-grey-800 dark:text-grey-0 font-semibold'>model</h2>
                            <p className='text-grey-600 dark:text-grey-0 pl-1'>{jsonData.model}</p>
                          </div>
                          <div className='flex flex-wrap gap-2.5'>
                            <h2 className='text-lg text-grey-900 dark:text-grey-0 font-semibold'>Topic</h2>
                            <p className='text-base text-grey-800 dark:text-grey-0 pl-1'>{jsonData.topic}</p>
                          </div>
                          <Disclosure>
                            {({open}) => (
                              <>
                                <Disclosure.Button
                                  className={
                                    'w-full flex justify-between items-center rounded-2xl text-primary-medium bg-primary-150/10 px-6 py-4'
                                  }
                                >
                                  <h2 className='text-lg text-primary dark:text-grey-50 font-semibold'>Chapters</h2>
                                  <ChevronUpIcon
                                    className={classNames(
                                      'h-5 w-5 text-primary dark:text-grey-50',
                                      open && 'rotate-180 transform',
                                    )}
                                  />
                                </Disclosure.Button>
                                <Transition
                                  enter='transition duration-100 ease-out'
                                  enterFrom='transform scale-95 opacity-0'
                                  enterTo='transform scale-100 opacity-100'
                                  leave='transition duration-75 ease-out'
                                  leaveFrom='transform scale-100 opacity-100'
                                  leaveTo='transform scale-95 opacity-0'
                                >
                                  <Disclosure.Panel className={'w-full p-1 rounded-b-lg bg-primary-150/10'}>
                                    <DynamicShowChaptersInDisclosure chapters={jsonData.chapters} />
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>

                          <Disclosure>
                            {({open}) => (
                              <>
                                <Disclosure.Button
                                  className={
                                    'w-full flex justify-between items-center rounded-2xl text-primary-medium bg-primary-150/10 px-6 py-4'
                                  }
                                >
                                  <h2 className='text-lg text-primary dark:text-grey-50 font-semibold'>Book</h2>
                                  <ChevronUpIcon
                                    className={classNames(
                                      'h-5 w-5 text-primary dark:text-grey-50',
                                      open && 'rotate-180 transform',
                                    )}
                                  />
                                </Disclosure.Button>
                                <Transition
                                  enter='transition duration-100 ease-out'
                                  enterFrom='transform scale-95 opacity-0'
                                  enterTo='transform scale-100 opacity-100'
                                  leave='transition duration-75 ease-out'
                                  leaveFrom='transform scale-100 opacity-100'
                                  leaveTo='transform scale-95 opacity-0'
                                >
                                  <Disclosure.Panel className={'w-full p-1 rounded-b-lg bg-primary-150/10'}>
                                    <div
                                      className={classNames(
                                        'min-h-[240px] max-h-[420px] p-1 flex flex-1 max-w-full text-left flex-col custom-scrollbar-thumb ',
                                        '[&_pre]:flex-1',
                                      )}
                                      style={{direction: 'rtl'}}
                                    >
                                      <span style={{direction: 'ltr'}}>
                                        <DynamicMarkdownContent content={jsonData.book ?? ''} />
                                      </span>
                                    </div>
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                          <Disclosure>
                            {({open}) => (
                              <>
                                <Disclosure.Button
                                  className={
                                    'w-full flex justify-between items-center rounded-2xl text-primary-medium bg-primary-150/10 px-6 py-4'
                                  }
                                >
                                  <h2 className='text-lg text-primary dark:text-grey-50 font-semibold'>Outline</h2>
                                  <ChevronUpIcon
                                    className={classNames(
                                      'h-5 w-5 text-primary dark:text-grey-50',
                                      open && 'rotate-180 transform',
                                    )}
                                  />
                                </Disclosure.Button>
                                <Transition
                                  enter='transition duration-100 ease-out'
                                  enterFrom='transform scale-95 opacity-0'
                                  enterTo='transform scale-100 opacity-100'
                                  leave='transition duration-75 ease-out'
                                  leaveFrom='transform scale-100 opacity-100'
                                  leaveTo='transform scale-95 opacity-0'
                                >
                                  <Disclosure.Panel className={'w-full p-1 rounded-b-lg bg-primary-150/10'}>
                                    <div
                                      className={classNames(
                                        'min-h-[240px] max-h-[420px] p-1 flex flex-1 max-w-full text-left flex-col custom-scrollbar-thumb ',
                                        '[&_pre]:flex-1',
                                      )}
                                      style={{direction: 'rtl'}}
                                    >
                                      <span style={{direction: 'ltr'}}>
                                        <DynamicMarkdownContent content={jsonData.outline ?? ''} />
                                      </span>
                                    </div>
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                          <Disclosure>
                            {({open}) => (
                              <>
                                <Disclosure.Button
                                  className={
                                    'w-full flex justify-between items-center rounded-2xl text-primary-medium bg-primary-150/10 px-6 py-4'
                                  }
                                >
                                  <h2 className='text-lg text-primary dark:text-grey-50 font-semibold'>Sources</h2>
                                  <ChevronUpIcon
                                    className={classNames(
                                      'h-5 w-5 text-primary dark:text-grey-50',
                                      open && 'rotate-180 transform',
                                    )}
                                  />
                                </Disclosure.Button>
                                <Transition
                                  enter='transition duration-100 ease-out'
                                  enterFrom='transform scale-95 opacity-0'
                                  enterTo='transform scale-100 opacity-100'
                                  leave='transition duration-75 ease-out'
                                  leaveFrom='transform scale-100 opacity-100'
                                  leaveTo='transform scale-95 opacity-0'
                                >
                                  <Disclosure.Panel className={'w-full p-3 rounded-b-lg bg-primary-150/10'}>
                                    <div className='flex flex-col gap-2'>
                                      {jsonData.sources.map((source, index) => (
                                        <Link
                                          className='flex gap-3 items-center text-primary-medium dark:text-grey-0 underline max-w-full truncate ...'
                                          key={`source-${source}-${index}`}
                                          href={source}
                                          target='_blank'
                                        >
                                          <LinkIcon className='w-4 h-4 min-w-fit' />
                                          {source}
                                        </Link>
                                      ))}
                                    </div>
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        </div>
                      )}
                    </>
                  )}
                  <div className='flex gap-4 px-4 md:px-8 lg:px-12 xl:px-20 mx-1 h-11'>
                    <Button
                      type='button'
                      className='flex-1 !h-11 !dark:text-grey-0'
                      variant='outline-dark'
                      title='close'
                      onClick={handleClose}
                    />
                    {downloadUrl && (
                      <Link
                        type='button'
                        className='rounded-xl flex-1 !h-11 flex items-center justify-center gap-4 border border-border bg-primary-150 hover:bg-primary-medium/50 transition-all duration-150'
                        download={file?.file_name}
                        target='_blank'
                        title='Download File'
                        href={downloadUrl}
                      >
                        <ArrowDownTrayIcon className='w-4 h-4' />
                        Download File
                      </Link>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ShowFileContentModalDialog;
