import React, {useState} from 'react';

// import {Button} from '@/components/buttons';
import {DeleteFileModalDialog} from '@/components/modals';
import ShowFileContentModalDialog from '@/components/modals/filesModalDialog/showFileContentModalDialog';
import {IFile} from '@/types';

import KnowledgeBookDetails from './knowledgeBookDetails';

const KnowledgeBooks = () => {
  // const [addFileModalOpen, setAddFileDialogOpen] = useState(false);
  const [showFileDialogOpen, setShowFileDialogOpen] = useState(false);
  const [deleteFileDialogOpen, setDeleteFileDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);

  // const handleCloseFileDialog = () => {
  //   setSelectedFile(null);
  //   setAddFileDialogOpen(false);
  // };
  // const handleOpenUploadNewFileDialog = () => {
  //   setSelectedFile(null);
  //   setAddFileDialogOpen(true);
  // };
  // const handleOpenEditFileDialog = (file: IFile) => {
  //   setSelectedFile(file);
  //   setAddFileDialogOpen(true);
  // };

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
            <h1 className='text-lg leading-7 text-grey-900 font-semibold'>Uploaded Files</h1>
            {/* <Button
              className='!px-6 font-semibold text-sm !h-34-px'
              variant='primary'
              title='Upload New'
              onClick={handleOpenUploadNewFileDialog}
            /> */}
          </div>
          <div className='max-w-full'>
            <KnowledgeBookDetails
              onDeleteFile={handleOpenDeleteFileDialog}
              // onEditFile={handleOpenEditFileDialog}
              onShowContent={handleOpenShowFileContentDialog}
            />
          </div>
        </div>
      </div>
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

export default KnowledgeBooks;
