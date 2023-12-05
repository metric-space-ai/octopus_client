import {Fragment, useEffect, useState, useRef} from 'react';
import {Combobox, Transition} from '@headlessui/react';

import {CheckIcon, ChevronDownIcon, XMarkIcon} from '@heroicons/react/20/solid';

import {LANGUAGES} from '@/constant';
import {IUserProfile} from '@/types';

type Props = {
  currentLanguage: string | undefined;
  user: IUserProfile | null;
};

const LanguageSettings = ({currentLanguage, user}: Props) => {
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredLanguages, setFilteredLanguages] = useState(LANGUAGES);

  // const clearQuery = () => setQuery('');

  useEffect(() => {
    setFilteredLanguages(
      query === ''
        ? LANGUAGES
        : LANGUAGES.filter((lang) =>
            lang.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, '')),
          ),
    );
  }, [query]);

  return (
    <Combobox value={selectedLanguage} onChange={setSelectedLanguage}>
      {({open}) => (
        <>
          <p
            className='text-xs text-grey-900 mb-2'
            onClick={() => console.log({0: LANGUAGES[0], selectedLanguage, currentLanguage})}
          >
            language
          </p>

          <div className={`relative w-full cursor-default bg-white pl-5 pr-12 ${open ? 'rounded-t-20' : 'rounded-20'}`}>
            <Combobox.Input
              className={`w-full border-none h-10 text-sm leading-5 text-left sm:text-sm text-gray-900 focus:outline-none bg-transparent`}
              displayValue={(lang: any) => lang?.name}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className='absolute inset-y-0 right-0 block pr-5 z-10 '>
              {open ? (
                <XMarkIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              ) : (
                <ChevronDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              )}
            </Combobox.Button>
            {/* <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-5' onClick={() => setActive(!active)}>
          </Combobox.Button> */}
          </div>
          <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
            <Combobox.Options className='max-h-60 w-full overflow-auto rounded-b-2xl bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              <div>
                {filteredLanguages.length === 0 && query !== '' ? (
                  <div className='relative cursor-default select-none py-2 px-4 text-gray-700'>Nothing found.</div>
                ) : (
                  filteredLanguages.map((lang) => (
                    <Combobox.Option
                      key={lang.id}
                      className={({active}) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-purple-600 text-white' : 'text-gray-900'
                        }`
                      }
                      value={lang}
                    >
                      {({selected, active}) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {lang.name}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-purple-600'
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
        </>
      )}
    </Combobox>
  );
};

export default LanguageSettings;
