import {Fragment, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {ExclamationCircleIcon, XMarkIcon} from '@heroicons/react/24/outline';

import {IconButton} from '../buttons';
import classNames from 'classnames';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  src: string;
  bgColor: string;
  description?: string;
}

export const IframeWithSrcDialog = ({open, onClose, src, bgColor, description = ''}: ModalProps) => {
  const [openTooltip, setOpenTooltip] = useState(false);

  const handleToggleTooltip = () => {
    setOpenTooltip((prev) => !prev);
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
                    backgroundColor: bgColor,
                  }}
                  className='w-full h-full relative transform border border-content-primary bg-grey-100 p-6 rounded-xl align-middle shadow-xl transition-all'
                >
                  <IconButton className='absolute top-4 right-4' onClick={onClose}>
                    <XMarkIcon className='w-5 h-5 text-content-primary' />
                  </IconButton>
                  <div className='relative'>
                    {description && (
                      <ExclamationCircleIcon
                        className='w-5 h-5 absolute -left-6 top-0 cursor-pointer text-grey-800 hover:text-primary'
                        onClick={handleToggleTooltip}
                      />
                    )}
                    <div
                      className={classNames(
                        'shadow-[0px_10px_20px_0px] shadow-grey-900/5 rounded-xl pl-5 pr-6 py-4 bg-grey-0 absolute -left-6 top-8',
                        openTooltip && 'block',
                        !openTooltip && 'hidden',
                      )}
                    >
                      <p className='text-grey-900 text-sm font-normal '>{description}</p>
                    </div>
                    <iframe
                      style={{
                        height: 'calc(100vh - 108px)',
                        width: 'calc(100vw - 108px)',
                        backgroundColor: bgColor ?? '',
                      }}
                      className={`w-full h-full [&_body]:m-0 flex-1`}
                      src={src}
                    ></iframe>
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
