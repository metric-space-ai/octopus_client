import {Button} from '@/components/buttons';
import React, {useState} from 'react';
import DocumentsData from './documentsDetails';
import {UploadDocumentModal} from '@/components/modals/UploadDocumentModal';

type Props = {};

const Documents = (props: Props) => {
  const [addDocumentsModal, setAddDocumentsModal] = useState(false);
  return (
    <>
      <div className='w-full pt-9 flex flex-col px-6'>
        <div className='flex flex-col w-full max-w-[608px] px-6 py-4 rounded-xl bg-grey-0'>
          <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
            <h1 className='text-lg leading-7 text-grey-900 font-semibold'>Uploaded documents</h1>
            <Button
              className='!px-6 font-semibold text-sm !h-34-px'
              variant='primary'
              title='Upload Document'
              onClick={() => setAddDocumentsModal(true)}
            />
          </div>
          <div className='max-w-full'>
            <DocumentsData />
          </div>
        </div>
      </div>
      <UploadDocumentModal open={addDocumentsModal} onClose={() => setAddDocumentsModal(false)} />
    </>
  );
};

export default Documents;
