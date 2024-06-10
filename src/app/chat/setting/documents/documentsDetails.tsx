import {useState, useEffect} from 'react';
import {Disclosure} from '@headlessui/react';

import {
  TrashIcon,
  GlobeAltIcon,
  PhotoIcon,
  DocumentTextIcon,
  FilmIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline';
import {IDocument} from '@/types';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@/app/lib/store';
import {selectDocuments} from '@/app/lib/features/documents/documentsSelector';
import {deleteDocumentById, getAllNextCloudDocuments} from '@/app/lib/features/documents/documentsSlice';
import {DeleteDocumentModalDialog} from '@/components/modals';
import {PdfTypeIcon} from '@/components/svgs';

export default function DocumentsDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const {entities: documents, isLoading} = useSelector(selectDocuments);

  const [openDeleteDocumentDialog, setOpenDeleteDocumentDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<IDocument>();

  const handleOpenDeleteDocumentDialog = (document: IDocument) => {
    setSelectedDocument(document);
    setOpenDeleteDocumentDialog(true);
  };

  const handleConfirmDeleteDocument = async () => {
    if (!selectedDocument) return;
    dispatch(deleteDocumentById(selectedDocument.id));
  };
  const getFileType = (fileName: string) => {
    const splited = fileName.split('.');
    if (splited.length > 1) return splited[splited.length - 1];
  };

  useEffect(() => {
    dispatch(getAllNextCloudDocuments());
  }, []);

  return (
    <>
      <div className='w-full'>
        <div className='mx-auto w-full max-w-[560px] rounded-lg bg-grey-0'>
          <div className='flex mb-2'>
            <div className='w-80 pl-7'>
              <span
                className='font-medium text-xs leading-5 text-grey-600'
              >
                original name
              </span>
            </div>
            <div className='w-28 flex justify-center ml-3'>
              <span className='font-medium text-xs leading-5 text-grey-600'>type</span>
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

            {!documents || documents?.length === 0
              ? !isLoading && (
                  <div className='flex justify-center py-3 items-center border-t'>
                    <h2 className='text-lg text-primary uppercase'>not found</h2>
                  </div>
                )
              : documents?.map((document, index) => (
                  <div className='flex justify-start py-3 items-center border-t'>
                    <div className='flex gap-3 w-80 items-center'>
                      {getFileType(document) === 'html' && (
                        <GlobeAltIcon className='w-4 h-4 text-primary-medium' />
                      )}
                      {getFileType(document) === 'txt' && (
                        <DocumentTextIcon className='w-4 h-4 text-primary-medium' />
                      )}
                      {(getFileType(document) === 'png' || getFileType(document) === 'jpg' || getFileType(document) === 'jpeg') && (
                        <PhotoIcon className='w-4 h-4 text-primary-medium' />
                      )}
                      {getFileType(document) === 'pdf' && <PdfTypeIcon className='w-4 h-4 text-primary-medium' />}
                      {getFileType(document)?.includes('mp4') && (
                        <FilmIcon className='w-4 h-4 text-primary-medium' />
                      )}
                      {getFileType(document)?.includes('mp3') && (
                        <MusicalNoteIcon className='w-4 h-4 text-primary-medium' />
                      )}
                      <p
                        className='text-xs leading-5 text-grey-900 font-semibold truncate ...'
                        title={document}
                      >
                        {document}
                      </p>
                    </div>
                    {/* <p
                      className='text-xxs leading-4 w-28 text-grey-800 font-medium pl-2 truncate ...'
                      title={document}
                    >
                      {document}
                    </p> */}
                    <p
                      className='flex justify-center items-center w-28 text-xs leading-5 text-grey-800 font-semibold ml-3 truncate ...'
                      title={getFileType(document) ?? ''}
                    >
                      {getFileType(document) ?? ''}
                    </p>
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
          {isLoading && (
            <Disclosure>
              {({open}) => (
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
}
