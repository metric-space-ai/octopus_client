import {Dispatch, Fragment, SetStateAction, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';

import {LanguageType} from '@/types';

import {IconButton} from '@/components/buttons';
import {DropdownTranslateChat} from '@/components/dropdown/translateChat';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  selected: LanguageType;
  setSelected: Dispatch<SetStateAction<LanguageType>>;
  setShowOriginal: Dispatch<SetStateAction<boolean>>;
  setSelectedLanguage: Dispatch<SetStateAction<string>>;
}

export const TranslatorModal = ({
  open,
  onClose,
  text,
  setText,
  selected,
  setSelected,
  setShowOriginal,
  setSelectedLanguage,
}: ModalProps) => (
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
        <div className='flex min-h-full items-center justify-center p-4'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <Dialog.Panel className='w-1/2 lg:w-1/3 flex flex-col transform border border-content-primary bg-grey-100 px-10 py-10 rounded-xl shadow-xl transition-all gap-3'>
              <div className='flex justify-between items-center'>
                <Dialog.Title className='text-[24px] font-semibold text-grey-900'>
                  Translation Language
                </Dialog.Title>
                <IconButton className='absolute right-4' onClick={onClose}>
                  <XMarkIcon className='w-5 h-5 text-content-primary' />
                </IconButton>
              </div>
              <div>
                <p className='text-base text-grey-50'>Specify your preferred language for translations. </p>
                <div className='space-y-2 mt-2'>
                  <p className='text-xs text-grey-900'>language</p>
                  <div>
                    <DropdownTranslateChat
                      text={text}
                      setText={setText}
                      onClose={onClose}
                      selected={selected}
                      setSelected={setSelected}
                      setShowOriginal={setShowOriginal}
                      setSelectedLanguage={setSelectedLanguage}
                    />
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);
