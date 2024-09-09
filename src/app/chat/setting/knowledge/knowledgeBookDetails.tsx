/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect} from 'react';

import {Disclosure} from '@headlessui/react';
import {
  DocumentTextIcon,
  EyeIcon,
  FilmIcon,
  GlobeAltIcon,
  MusicalNoteIcon,
  // PencilSquareIcon,
  PhotoIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {useDispatch, useSelector} from 'react-redux';

import {selectFiles} from '@/app/lib/features/files/filesSelector';
import {getAllFiles} from '@/app/lib/features/files/filesSlice';
import {AppDispatch} from '@/app/lib/store';
import {PdfTypeIcon} from '@/components/svgs';
import {IFile} from '@/types';

type Props = {
  // onEditFile: (file: IFile) => void;
  onDeleteFile: (file: IFile) => void;
  onShowContent: (file: IFile) => void;
};
const KnowledgeBookDetails = ({onDeleteFile, onShowContent}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const {entities: files, isLoading} = useSelector(selectFiles);

  const getFileType = (fileName: string) => {
    const splited = fileName.split('.');
    if (splited.length > 1) return splited[splited.length - 1];
  };

  useEffect(() => {
    dispatch(getAllFiles());
  }, []);

  return (
    <>
      <div className='w-full'>
        <div className='mx-auto w-full max-w-[560px] rounded-lg bg-grey-0'>
          <div className='flex mb-2'>
            <div className='w-40 pl-7'>
              <span className='font-medium text-xs leading-5 text-grey-600'>original name</span>
            </div>
            <div className='w-24 flex justify-center ml-3'>
              <span className='font-medium text-xs leading-5 text-grey-600'>Access Type</span>
            </div>
            <div className='w-24 flex justify-start ml-3'>
              <span className='font-medium text-xs leading-5 text-grey-600'>Link</span>
            </div>
            <div className='w-20 ml-3 text-center'>
              <span className='font-medium text-xs leading-5 text-grey-600'>Format</span>
            </div>
          </div>

          <div className='max-h-[420px] overflow-auto custom-scrollbar-thumb relative -mr-2'>
            {/* {reloadPluginIsAvailable && (
              <div className='w-full'>
                <h2
                  className='uppercase text-primary cursor-pointer text-center py-6 hover:underline'
                  onClick={() => getAllPlugins()}
                >
                  try again
                </h2>
              </div>
            )} */}
            {/* <div className='flex justify-center py-3 items-center border-t'></div> */}

            {!files || files?.length === 0
              ? !isLoading && (
                  <div className='flex justify-center py-3 items-center border-t'>
                    <h2 className='text-lg text-primary uppercase'>not found</h2>
                  </div>
                )
              : files?.map((file) => (
                  <div className='flex justify-start py-3 items-center border-t' key={file.id}>
                    <div className='flex gap-3 w-40 items-center'>
                      {getFileType(file.file_name) === 'html' && (
                        <GlobeAltIcon className='w-4 h-4 text-primary-medium min-w-[12px]' />
                      )}
                      {(getFileType(file.file_name) === 'txt' || getFileType(file.file_name) === 'json') && (
                        <DocumentTextIcon className='w-4 h-4 text-primary-medium min-w-[12px]' />
                      )}
                      {(getFileType(file.file_name) === 'png' ||
                        getFileType(file.file_name) === 'jpg' ||
                        getFileType(file.file_name) === 'jpeg') && (
                        <PhotoIcon className='w-4 h-4 text-primary-medium min-w-[12px]' />
                      )}
                      {getFileType(file.file_name) === 'pdf' && (
                        <PdfTypeIcon className='w-4 h-4 text-primary-medium min-w-[12px]' />
                      )}
                      {getFileType(file.file_name)?.includes('mp4') && (
                        <FilmIcon className='w-4 h-4 text-primary-medium min-w-[12px]' />
                      )}
                      {getFileType(file.file_name)?.includes('mp3') && (
                        <MusicalNoteIcon className='w-4 h-4 text-primary-medium min-w-[12px]' />
                      )}
                      <p
                        className='text-xs leading-5 text-grey-900 font-semibold truncate ...'
                        title={file.original_file_name}
                      >
                        {file.original_file_name}
                      </p>
                    </div>
                    {/* <p
                      className='text-xxs leading-4 w-28 text-grey-800 font-medium pl-2 truncate ...'
                      title={document}
                    >
                      {document}
                    </p> */}
                    <p
                      className='flex justify-center items-center w-24 text-xs leading-5 text-grey-800 font-semibold ml-3 truncate ...'
                      title={file.access_type ?? ''}
                    >
                      {file.access_type ?? ''}
                    </p>

                    <Link
                      href={file.url}
                      target='_blank'
                      className='flex justify-start items-center w-24 text-xs leading-5 font-semibold ml-3 truncate ... underline text-primary-medium'
                      title={file.url ?? ''}
                    >
                      {file.url ?? ''}
                    </Link>

                    <p
                      className='flex justify-center items-center w-20 text-xs leading-5 text-grey-800 font-semibold ml-3 truncate ...'
                      title={getFileType(file.file_name) ?? ''}
                    >
                      {getFileType(file.file_name) ?? ''}
                    </p>
                    <div className='ml-auto flex gap-3'>
                      {['KnowledgeBook', 'Document'].includes(file.type) && getFileType(file.file_name) === 'json' && (
                        <EyeIcon
                          width={16}
                          height={16}
                          className='text-grey-900 cursor-pointer'
                          onClick={() => onShowContent(file)}
                        />
                      )}
                      {/* <PencilSquareIcon
                        width={16}
                        height={16}
                        onClick={() => onEditFile(file)}
                        className='text-secondary-soft hover:text-secondary-700 cursor-pointer'
                      /> */}
                      <TrashIcon
                        width={16}
                        height={16}
                        className='text-danger-500 hover:text-danger-500/50 cursor-pointer'
                        onClick={() => onDeleteFile(file)}
                      />
                    </div>
                    {/* 
                    <span
                      className='ml-auto p-1.5 hover:bg-danger-500/10 cursor-pointer transition rounded-full'
                      onClick={() => handleOpenDeleteDocumentDialog(document)}
                    >
                      <TrashIcon width={16} height={16} className='text-grey-800 cursor-pointer' />
                    </span> */}
                  </div>
                ))}
          </div>
          {isLoading && !files && (
            <Disclosure>
              {() => (
                <>
                  <div className='flex justify-start py-3 items-center animate-pulse'>
                    <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-80 ml-3'></div>

                    <div className='w-28 ml-3 h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>
                    {/* <div className='w-16 mx-2 h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div> */}

                    {/* <div className='ml-auto h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-5 mx-1.5'></div> */}
                  </div>
                </>
              )}
            </Disclosure>
          )}
        </div>
      </div>
      {/* {selectedDocument && (
        <DeleteDocumentModalDialog
          onDelete={handleConfirmDeleteDocument}
          open={openDeleteDocumentDialog}
          document={selectedDocument}
          onClose={() => {
            setOpenDeleteDocumentDialog(false);
            setSelectedDocument(undefined);
          }}
        />
      )} */}
    </>
  );
};
export default KnowledgeBookDetails;
