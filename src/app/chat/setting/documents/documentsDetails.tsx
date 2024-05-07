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
import {deleteDocumentById, getAllDocuments} from '@/app/lib/features/documents/documentsSlice';
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

  useEffect(() => {
    dispatch(getAllDocuments());
  }, []);

  return (
    <>
      <div className='w-full'>
        <div className='mx-auto w-full max-w-[560px] rounded-2xl bg-white'>
          <div className='flex mb-2'>
            <div className='w-52'>
              <span
                className='font-poppins-medium text-xs leading-5 text-content-grey-600'
                onClick={() => console.log({documents})}
              >
                original name
              </span>
            </div>
            <div className='w-28'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600 pl-2'>name</span>
            </div>
            <div className='w-28 flex justify-center'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>type</span>
            </div>
          </div>

          <div className='max-h-[420px] overflow-auto custom-scrollbar-thumb relative -mr-2'>
            {/* {reloadPluginIsAvailable && (
              <div className='w-full'>
                <h2
                  className='uppercase text-content-accent cursor-pointer text-center py-6 hover:underline'
                  onClick={() => getAllPlugins()}
                >
                  try again
                </h2>
              </div>
            )} */}
            {/* <div className='flex justify-center py-3 items-center border-t border-content-grey-100'></div> */}

            {!documents || documents?.length === 0
              ? !isLoading && (
                  <div className='flex justify-center py-3 items-center border-t border-content-grey-100'>
                    <h2 className='text-lg text-content-accent uppercase'>not found</h2>
                  </div>
                )
              : documents?.map((document, index) => (
                  <div className='flex justify-start py-3 items-center border-t border-content-grey-100'>
                    <div className='flex gap-3 w-52 items-center'>
                      {document.media_type === 'text/html' && (
                        <GlobeAltIcon className='w-4 h-4 text-content-accent-hover' />
                      )}
                      {document.media_type === 'text/plain' && (
                        <DocumentTextIcon className='w-4 h-4 text-content-accent-hover' />
                      )}
                      {document.media_type.includes('image') && (
                        <PhotoIcon className='w-4 h-4 text-content-accent-hover' />
                      )}
                      {document.media_type === 'application/pdf' && (
                        <PdfTypeIcon className='w-4 h-4 text-content-accent-hover' />
                      )}
                      {document.media_type.includes('video') && (
                        <FilmIcon className='w-4 h-4 text-content-accent-hover' />
                      )}
                      {document.media_type.includes('audio') && (
                        <MusicalNoteIcon className='w-4 h-4 text-content-accent-hover' />
                      )}
                      <p
                        className='text-xs leading-5 text-content-black font-poppins-semibold truncate ...'
                        title={document.original_file_name}
                      >
                        {document.original_file_name}
                      </p>
                    </div>
                    <p
                      className='text-xxs leading-4 w-28 text-content-grey-900 font-poppins-medium pl-2 truncate ...'
                      title={document.file_name}
                    >
                      {document.file_name}
                    </p>
                    <p
                      className='flex justify-center items-center w-28 text-xs leading-5 text-content-grey-900 font-poppins-semibold ml-3 truncate ...'
                      title={document.media_type}
                    >
                      {document.media_type}
                    </p>

                    <span
                      className='ml-auto p-1.5 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
                      onClick={() => handleOpenDeleteDocumentDialog(document)}
                    >
                      <TrashIcon width={16} height={16} className='text-content-grey-900 cursor-pointer' />
                    </span>
                  </div>
                ))}
          </div>
          {isLoading && (
            <Disclosure>
              {({open}) => (
                <>
                  <div className='flex justify-start py-3 items-center animate-pulse'>
                    <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-52'></div>

                    <div className='w-24 mx-2 h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>
                    <div className='w-24  h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>
                    <div className='w-16 mx-2 h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>

                    <div className='ml-auto h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-5 mx-1.5'></div>
                  </div>
                </>
              )}
            </Disclosure>
          )}
        </div>
      </div>
      {selectedDocument && (
        <DeleteDocumentModalDialog
          onDelete={handleConfirmDeleteDocument}
          open={openDeleteDocumentDialog}
          document={selectedDocument}
          onClose={() => {
            setOpenDeleteDocumentDialog(false);
            setSelectedDocument(undefined);
          }}
        />
      )}
    </>
  );
}
