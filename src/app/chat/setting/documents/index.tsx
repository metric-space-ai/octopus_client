import React, {useState} from 'react';

import {Button} from '@/components/buttons';
import {CreateMarkdownModalDialog, DeleteFileModalDialog} from '@/components/modals';
import ShowFileContentModalDialog from '@/components/modals/filesModalDialog/showFileContentModalDialog';
import {IFile} from '@/types';

import DocumentsDetails from './documentsDetails';

const Documents = () => {
  // const [addDocumentsModal, setAddDocumentsModal] = useState(false);
  const [addMarkdownModal, setAddMarkdownModal] = useState(false);
  const [showFileDialogOpen, setShowFileDialogOpen] = useState(false);
  const [deleteFileDialogOpen, setDeleteFileDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);

  const handleOpenDeleteFileDialog = (file: IFile) => {
    setSelectedFile(file);
    setDeleteFileDialogOpen(true);
  };
  const handleCloseDeleteFileDialog = () => {
    setSelectedFile(null);
    setDeleteFileDialogOpen(false);
  };
  const handleOpenShowFileContentDialog = (file: IFile) => {
    setSelectedFile(file);
    setShowFileDialogOpen(true);
  };
  const handleCloseShowFileContentDialog = () => {
    setSelectedFile(null);
    setShowFileDialogOpen(false);
  };

  return (
    <>
      <div className='w-full pt-9 flex flex-col px-6'>
        <div className='flex flex-col w-full max-w-[608px] px-6 py-4 rounded-xl bg-grey-0'>
          <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
            <h1 className='text-lg leading-7 text-grey-900 font-semibold'>Uploaded documents</h1>
            <div className='flex items-center gap-6'>
              <Button
                className='!px-6 font-semibold text-sm !h-34-px'
                variant='primary'
                // title='pdf to Markdown'
                title='Upload Document'
                onClick={() => setAddMarkdownModal(true)}
              />
              {/* <Button
                className='!px-6 font-semibold text-sm !h-34-px'
                variant='primary'
                title='Upload Document'
                onClick={() => setAddDocumentsModal(true)}
              /> */}
            </div>
          </div>
          <div className='max-w-full'>
            <DocumentsDetails
              onDeleteFile={handleOpenDeleteFileDialog}
              // onEditFile={handleOpenEditFileDialog}
              onShowContent={handleOpenShowFileContentDialog}
            />
          </div>
        </div>
      </div>
      {/* <UploadDocumentModal open={addDocumentsModal} onClose={() => setAddDocumentsModal(false)} /> */}
      <CreateMarkdownModalDialog open={addMarkdownModal} onClose={() => setAddMarkdownModal(false)} />
      {deleteFileDialogOpen && (
        <DeleteFileModalDialog open={deleteFileDialogOpen} onClose={handleCloseDeleteFileDialog} file={selectedFile} />
      )}
      {/* {addFileModalOpen && (
        <UploadFileModalDialog onClose={handleCloseFileDialog} open={addFileModalOpen} selectedFile={selectedFile} />
      )} */}
      {showFileDialogOpen && (
        <ShowFileContentModalDialog
          onClose={handleCloseShowFileContentDialog}
          isOpen={showFileDialogOpen}
          file={selectedFile}
        />
      )}
    </>
  );
};

export default Documents;
