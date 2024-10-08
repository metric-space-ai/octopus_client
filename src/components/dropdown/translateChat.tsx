import {Dispatch, Fragment, SetStateAction, useState} from 'react';

import {Combobox, Transition} from '@headlessui/react';
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid';
import {AxiosError} from 'axios';
import toast from 'react-hot-toast';

import {Button} from '@/components/buttons';
import {LANGUAGES} from '@/constant';
import {directCall} from '@/services/chat.service';
import {LanguageType} from '@/types';

export const DropdownTranslateChat = ({
  text,
  setText,
  onClose,
  selected,
  setSelected,
  setShowOriginal,
  setSelectedLanguage,
}: {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  onClose: () => void;
  selected: LanguageType;
  setSelected: Dispatch<SetStateAction<LanguageType>>;
  setShowOriginal: Dispatch<SetStateAction<boolean>>;
  setSelectedLanguage: Dispatch<SetStateAction<string>>;
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const filteredPeople =
    query === ''
      ? LANGUAGES
      : LANGUAGES.filter((lang) =>
          lang.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, '')),
        );

  const handleTranslator = async () => {
    setLoading(true);
    const payload = {
      name: 'function_translator',
      parameters: {
        source_language: 'English',
        target_language: selected?.name,
        text: text,
      },
    };
    try {
      const {data, status} = await directCall(payload);
      if (status === 201) {
        if (data.Error) {
          const parsedError: {error: string} = JSON.parse(data.Error.error);
          toast.error(parsedError.error);
        } else if (data.Mixed && data.Mixed.length > 0) {
          const {Text} = data.Mixed[0];
          if (!Text?.response) return;
          setText(Text.response);
          setSelectedLanguage(selected?.name);
          setShowOriginal(true);
          onClose();
        }
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='w-full'>
      <Combobox value={selected} onChange={setSelected}>
        <div className='relative mt-1'>
          {!open ? (
            <div className='relative w-full cursor-default overflow-hidden rounded-xl bg-grey-0 text-left shadow-md sm:text-sm'>
              <Combobox.Input
                className='w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none'
                displayValue={(lang: LanguageType) => lang.name}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Combobox.Button
                className='absolute inset-y-0 right-0 flex items-center pr-2'
                onClick={() => setOpen(!open)}
              >
                <ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </Combobox.Button>
            </div>
          ) : null}
          <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
            <Combobox.Options
              className='relative mt-1 max-h-60 w-full overflow-auto rounded-xl bg-grey-0 py-1 text-base shadow-lg ring-1 ring-grey-900 ring-opacity-5 focus:outline-none sm:text-sm'
              onClick={() => setOpen(false)}
            >
              <div>
                {filteredPeople.length === 0 && query !== '' ? (
                  <div className='relative cursor-default select-none py-2 px-4 text-gray-700'>Nothing found.</div>
                ) : (
                  filteredPeople.map((person) => (
                    <Combobox.Option
                      key={person.id}
                      className={({active}) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-purple-600 text-grey-0' : 'text-gray-900'
                        }`
                      }
                      value={person}
                    >
                      {({selected, active}) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {person.name}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-grey-0' : 'text-purple-600'
                              }`}
                            >
                              <CheckIcon className='h-5 w-5' aria-hidden='true' />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </div>
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      <div className='flex justify-center space-x-2 mt-6'>
        <p
          className={`bg-grey-0 text-grey-900 border border-grey-900 flex justify-center items-center w-36 rounded-full ${
            loading ? 'cursor-not-allowed hover:bg-slate-100' : 'cursor-pointer'
          }`}
          onClick={() => {
            !loading ? onClose() : null;
          }}
        >
          Cancel
        </p>
        <Button title='Select Language' onClick={handleTranslator} loading={loading} disabled={loading} />
      </div>
    </div>
  );
};
