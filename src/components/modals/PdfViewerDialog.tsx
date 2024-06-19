import {Fragment, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';

import {XMarkIcon} from '@heroicons/react/24/outline';

import {IconButton} from '../buttons';
import classNames from 'classnames';
import {Spinner} from '../spinner';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
}

export const PdfViewerDialog = ({open, onClose, url}: ModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleOnloadStart = () => {
    setLoading(true);
  };
  const handleOnloaded = () => {
    setLoading(false);
  };
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog className='relative z-10' as='div' onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-grey-900/50 transition-opacity' />
          </Transition.Child>
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel
                  style={{
                    minHeight: 'calc(100vh - 60px)',
                    minWidth: 'calc(100vw - 60px)',
                  }}
                  className='flex flex-col w-full h-full relative transform border border-content-primary bg-grey-100 p-6 rounded-xl align-middle shadow-xl transition-all'
                >
                  <IconButton className='absolute top-4 right-4' onClick={onClose}>
                    <XMarkIcon className='w-5 h-5 text-content-primary' />
                  </IconButton>
                  <div className={classNames('flex flex-1 pt-8', loading && ' items-center justify-center')}>
                    {loading && <Spinner size='medium' />}
                    <embed
                      src={url}
                      className={classNames('w-full h-auto flex-1', loading && 'hidden')}
                      type='application/pdf'
                      width='100%'
                      height='100%'
                      onLoadStart={handleOnloadStart}
                      onLoad={handleOnloaded}
                    />
                    {/* <iframe
                      width={600}
                      height={600}
                      className={classNames('w-full h-auto flex-1', loading && 'hidden')}
                      src={url}
                      onLoadStart={handleOnloadStart}
                      onLoad={handleOnloaded}
                 
                    /> */}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
