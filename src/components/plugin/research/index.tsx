import React, {Fragment, useEffect, useRef, useState} from 'react';
import {Button, IconButton} from '../../buttons';
import classNames from 'classnames';
import {
  ArrowPathIcon,
  ChevronUpIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  PlusIcon,
  StopIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {useDebouncedCallback} from 'use-debounce';
import {autoGrowTextArea} from '@/helpers';
import {AddDefinitionModal} from './AddDefinitionModal';
import {IExamples, IKeyword, IKeywordsCollection, IResearchResult} from './types';
import ResearchItemRow from './ResearchItemRow';

type Props = {};

const RESEARCHSTEPS = {Specification: 1, Examples: 2, ResearchResults: 3};

const KEYWORDSCOLLECTION: IKeywordsCollection[] = [
  {
    id: '101',
    title: 'Laundry Care',
    definitions_in: [
      {definitionId: '101-1', value: 'Heavy-duty detergents'},
      {definitionId: '101-2', value: 'Fabric softeners'},
      {definitionId: '101-3', value: 'Mild and special detergents'},
      {definitionId: '101-4', value: 'Detergents for colors'},
      {definitionId: '101-5', value: 'Powdered and liquid detergents'},
    ],
    definitions_out: [
      {definitionId: '101-6', value: 'Detergents for bulk consumers (B2B; e. textile industry)'},
      {definitionId: '101-7', value: 'Textile care services (e.g. launderettes)'},
    ],
  },
  {
    id: '102',
    title: 'Household Cleaners',
    definitions_in: [
      {definitionId: '102-1', value: 'Household Cleaners'},
      {definitionId: '102-2', value: 'Surface cleaners'},
      {definitionId: '102-3', value: 'Floor care'},
      {definitionId: '102-4', value: 'Toilet care'},
      {definitionId: '102-5', value: 'Window cleaning products'},
    ],
    definitions_out: [
      {definitionId: '102-6', value: 'Polishes (for floor cleaning/care or furniture)'},
      {definitionId: '102-7', value: 'Cleaning equipment (e.g. mops or cleaning cloths)'},
    ],
  },
];
const EXAMPLES: IExamples[] = [
  {
    id: 'abc1001',
    value: 'industry data detergent xxx(country)xxx pdf',
  },
  {
    id: 'abc1002',
    value: 'ukcpi statistics home care market pdf',
  },
  {
    id: 'abc1003',
    value: 'uk market analysis laundry care',
  },
  {
    id: 'abc1004',
    value: 'uk laundry detergent statistics',
  },
  {
    id: 'abc1005',
    value: 'uk home cleaning market revenue pdf',
  },
  {
    id: 'abc1006',
    value: 'uk dishwashing statistics',
  },
  {
    id: 'abc1007',
    value: 'uk cleaning detergent statistics',
  },
  {
    id: 'abc1008',
    value: 'uk dishwashing market revenue',
  },
  {
    id: 'abc1009',
    value: 'kozmodet market revenue laundry detergent',
  },
  {
    id: 'abc1010',
    value: 'serbia market revenue laundry detergent pdf',
  },
  {
    id: 'abc1011',
    value: 'serbia market revenue cleaning detergent pdf',
  },
  {
    id: 'abc1012',
    value: 'serbia market revenue dishwashing detergent pdf',
  },
  {
    id: 'abc1013',
    value: 'saudi arabia laundry care market revenue',
  },
  {
    id: 'abc1014',
    value: 'russia association household cleaning market size',
  },
  {
    id: 'abc1015',
    value: 'russia associatin laundry detergent market size',
  },
];

const RESEARCHRESULTS: IResearchResult[] = [
  {
    id: 'def1001',
    name: 'Euromonitor',
    url: 'https://www.euromonitor.co...',
    grade: 1,
    information: 'text',
    messages: [
      {
        id: 'question-001',
        message:
          "What key insights does Euromonitor's research provide regarding the laundry care and household cleaners industry?",
        response:
          "Euromonitor's research offers valuable insights into the laundry care and household cleaners industry",
        status: 'answered',
      },
      {
        id: 'question-002',
        message:
          "How does Euromonitor's research address the impact of emerging technologies on product innovation within the laundry care and household cleaners market?",
        response:
          "Euromonitor's research provides a comprehensive analysis of the impact of emerging technologies on product innovation within the laundry care and household cleaners market.",
        status: 'answered',
      },
    ],
  },
  {
    id: 'def1002',
    name: 'Nielsen',
    url: 'https://www.nielsen.com/d...',
    grade: 1,
    information: 'text',
    messages: [
      {
        id: 'question-003',
        message:
          "How does Euromonitor's research address the impact of emerging technologies on product innovation within the laundry care and household cleaners market?",
        response: '',
        status: 'asking',
      },
    ],
  },
  {
    id: 'def1003',
    name: 'IKW',
    url: 'https://www.ikw.org/hausha...',
    grade: 1,
    information: 'text',
    messages: [],
  },
  {
    id: 'def1004',
    name: 'TechSci Research',
    url: 'https://www.techsciresearc...',
    grade: 1,
    information: 'text',
    messages: [],
  },
  {
    id: 'def1005',
    name: 'Wiener Zeitung',
    url: 'https://www.wienerzeitung...',
    grade: 1,
    information: 'text',
    messages: [],
  },
  {
    id: 'def1006',
    name: 'Digitalmag',
    url: 'http://www.digitalmag.net/',
    grade: 1,
    information: 'text',
    messages: [],
  },
];

const Research = (props: Props) => {
  const formRef = useRef<HTMLFormElement>(null);

  const [definitionsCollection, setKeywordsCollection] = useState(KEYWORDSCOLLECTION);
  const [researchSteps, setResearchSteps] = useState(RESEARCHSTEPS.Specification);
  const [examplesResults, setExamplesResults] = useState<IExamples[]>(EXAMPLES);
  const [researchResults, setResearchResults] = useState<IResearchResult[]>(RESEARCHRESULTS);
  const [coreIdea, setCoreIdea] = useState('');
  const [definitionTitleOnEditMode, setKeywordTitleOnEditMode] = useState({id: '', title: ''});
  const [addNewKeywordCategoryId, setAddNewKeywordCategoryId] = useState('');
  const [editKeywordsTitle, setEditKeywordsTitle] = useState('');
  const [openEditKeywordvalue, setOpenEditKeywordValue] = useState({id: '', parentId: ''});
  const [editKeywordsValue, setEditKeywordsValue] = useState('');
  const [addKewordModal, setAddKewordModal] = useState(false);
  const [addDefinitionType, setAddDefinitionType] = useState<'in' | 'out' | ''>('');

  const handleCloseAddDefinitionModal = () => {
    setAddKewordModal(false);
    setAddDefinitionType('');
  };

  const handleAddNewKeyWord = (definition: string) => {
    const result = definitionsCollection.flatMap((collection) =>
      collection.id === addNewKeywordCategoryId
        ? addDefinitionType === 'in'
          ? {
              ...collection,
              definitions_in: [
                ...collection.definitions_in,
                {definitionId: (Math.floor(Math.random() * 9999) + 1000).toString(), value: definition},
              ],
            }
          : {
              ...collection,
              definitions_out: [
                ...collection.definitions_out,
                {definitionId: (Math.floor(Math.random() * 9999) + 1000).toString(), value: definition},
              ],
            }
        : collection,
    );

    setKeywordsCollection(result);
    setAddNewKeywordCategoryId('');
    setAddKewordModal(false);
  };

  const addKeywordTitleToEditMode = (id: string, title: string) => {
    setKeywordTitleOnEditMode({id, title});
    setEditKeywordsTitle(title);
  };
  const clearKeywordTitleToEditMode = () => {
    setKeywordTitleOnEditMode({id: '', title: ''});
    setEditKeywordsTitle('');
  };

  const handleOpenEditKeywordValue = (definition: IKeyword, parentId: string) => {
    setEditKeywordsValue(definition.value);
    setOpenEditKeywordValue({id: definition.definitionId, parentId});
  };

  const handleCloseEditKeywordValue = () => {
    setEditKeywordsValue('');
    setOpenEditKeywordValue({id: '', parentId: ''});
  };

  const submitChangeKeywordsDirectKeywordValue = () => {
    if (!editKeywordsValue) return;
    const result = definitionsCollection.flatMap((item) =>
      item.id === openEditKeywordvalue.parentId
        ? {
            ...item,
            definitions_in: [
              ...item.definitions_in.flatMap((definition) =>
                definition.definitionId === openEditKeywordvalue.id
                  ? {...definition, value: editKeywordsValue}
                  : definition,
              ),
            ],
            definitions_out: [
              ...item.definitions_out.flatMap((definition) =>
                definition.definitionId === openEditKeywordvalue.id
                  ? {...definition, value: editKeywordsValue}
                  : definition,
              ),
            ],
          }
        : item,
    );
    setKeywordsCollection(result);
    handleCloseEditKeywordValue();
  };

  const submitChangeKeywordsTitle = () => {
    if (!editKeywordsTitle) return;
    const result = definitionsCollection.flatMap((item) =>
      item.id === definitionTitleOnEditMode.id ? {...item, title: editKeywordsTitle} : item,
    );
    console.log({result, definitionsCollection});
    setKeywordsCollection(result);
    clearKeywordTitleToEditMode();
  };
  const checkEnterKeyPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return true;
    }
    return false;
  };

  return (
    <>
      <div className='flex flex-col rounded-20 bg-content-white px-5 pb-5 pt-4'>
        <h1 className='text-xl leading-7 font-semibold text-content-black mb-3'>Research application</h1>
        <div className='flex flex-col'>
          {researchSteps === RESEARCHSTEPS.Specification && (
            <>
              <h2 className='font-semibold text-sm leading-5 mb-1 text-content-accent-hover'>Proposed specification</h2>
              <p className='text-xs leading-5 text-content-black mb-4'>
                Check and edit proposed specification of the AI
              </p>
            </>
          )}
          {researchSteps === RESEARCHSTEPS.Examples && (
            <>
              <h2 className='font-semibold text-sm leading-5 mb-1 text-content-accent-hover'>Search examples</h2>
              <p className='text-xs leading-5 text-content-black mb-3'>Check Search Examples</p>
            </>
          )}

          {researchSteps === RESEARCHSTEPS.ResearchResults && (
            <>
              <h2 className='font-semibold text-sm leading-5 mb-4 text-content-accent-hover'>List research results</h2>
            </>
          )}

          {researchSteps === RESEARCHSTEPS.Specification && (
            <div className='flex flex-col gap-5'>
              <div className='custom-scrollbar-thumb h-[402px] flex flex-col gap-4'>
                {definitionsCollection.map((elem, elemIndex) => (
                  <div className='flex flex-col gap-3 mb-4' key={elem.id}>
                    {definitionTitleOnEditMode.id === elem.id ? (
                      <div className='flex items-center relative max-w-fit'>
                        <input
                          className='text-xs text-content-black pl-2 pr-8 py-1 border-r outline-content-accent rounded-4 bg-content-grey-100'
                          value={editKeywordsTitle}
                          name='definitionsTitle'
                          // defaultValue={editKeywordsTitle}
                          onChange={(e) => setEditKeywordsTitle(e.target.value)}
                          onKeyDown={(e) => checkEnterKeyPressed(e) && submitChangeKeywordsTitle()}
                        />
                        <span className='block absolute w-[1px] h-4 bg-content-grey-400 right-8' />
                        <IconButton className='!p-0 absolute right-2' onClick={clearKeywordTitleToEditMode}>
                          <XMarkIcon className='w-4 h-4 text-content-black' />
                        </IconButton>
                      </div>
                    ) : (
                      <div className='flex gap-2 items-center'>
                        <h3 className='font-semibold text-xs leading-5 text-content-black'>{`${elemIndex + 1}. ${
                          elem.title
                        }`}</h3>
                        <IconButton className='!p-0' onClick={() => addKeywordTitleToEditMode(elem.id, elem.title)}>
                          <PencilSquareIcon className='w-4 h-4 text-content-black' />
                        </IconButton>
                      </div>
                    )}
                    <div className='flex flex-wrap gap-3'>
                      <div className='flex flex-col'>
                        <i className='mb-2 text-content-grey-400 text-xs leading-5'>In scope</i>
                        <div className='flex flex-wrap gap-2'>
                          {elem.definitions_in.map((definition) => (
                            <div className='flex flex-col'>
                              {definition.definitionId === openEditKeywordvalue.id ? (
                                <div className='flex items-center relative max-w-fit' key={definition.definitionId}>
                                  <input
                                    className='text-xs text-content-black pl-2 pr-8 py-1.5 border-r outline-content-accent rounded-4 bg-content-grey-100'
                                    value={editKeywordsValue}
                                    name='definitionsTitle'
                                    // defaultValue={editKeywordsTitle}
                                    onChange={(e) => setEditKeywordsValue(e.target.value)}
                                    onKeyDown={(e) =>
                                      checkEnterKeyPressed(e) && submitChangeKeywordsDirectKeywordValue()
                                    }
                                  />
                                  <span className='block absolute w-[1px] h-4 bg-content-grey-400 right-8' />
                                  <IconButton className='!p-0 absolute right-2' onClick={handleCloseEditKeywordValue}>
                                    <XMarkIcon className='w-4 h-4 text-content-black' />
                                  </IconButton>
                                </div>
                              ) : (
                                <div
                                  className='flex items-center px-2 py-1.5 gap-2 bg-content-grey-100 rounded-4'
                                  key={definition.definitionId}
                                >
                                  <span className='text-xs leading-5 text-content-black'>{definition.value}</span>
                                  <IconButton
                                    className='!p-0'
                                    onClick={() => handleOpenEditKeywordValue(definition, elem.id)}
                                  >
                                    <PencilSquareIcon className='w-4 h-4 text-content-grey-600' />
                                  </IconButton>
                                </div>
                              )}
                            </div>
                          ))}
                          <div
                            className='flex items-center bg-content-grey-100 text-content-accent rounded-4 gap-2 py-1 px-2 
                            cursor-pointer transition-all hover:text-content-accent-hover'
                            onClick={() => {
                              setAddNewKeywordCategoryId(elem.id);
                              setAddKewordModal(true);
                              setAddDefinitionType('in');
                            }}
                          >
                            <span className='text-xs '>Add definition</span>
                            <IconButton className='!p-0'>
                              <PlusIcon className='w-4 h-4 text-content-accent' />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-col'>
                        <i className='mb-2 text-content-grey-400 text-xs leading-5'>Out of scope</i>
                        <div className='flex flex-wrap gap-2'>
                          {elem.definitions_out.map((definition) => (
                            <div className='flex flex-col'>
                              {definition.definitionId === openEditKeywordvalue.id ? (
                                <div className='flex items-center relative max-w-fit' key={definition.definitionId}>
                                  <input
                                    className='text-xs text-content-black pl-2 pr-8 py-1 border-r outline-content-accent rounded-4 bg-content-grey-100'
                                    value={editKeywordsValue}
                                    name='definitionsTitle'
                                    // defaultValue={editKeywordsTitle}
                                    onChange={(e) => setEditKeywordsValue(e.target.value)}
                                    onKeyDown={(e) =>
                                      checkEnterKeyPressed(e) && submitChangeKeywordsDirectKeywordValue()
                                    }
                                  />
                                  <span className='block absolute w-[1px] h-4 bg-content-grey-400 right-8' />
                                  <IconButton className='!p-0 absolute right-2' onClick={handleCloseEditKeywordValue}>
                                    <XMarkIcon className='w-4 h-4 text-content-black' />
                                  </IconButton>
                                </div>
                              ) : (
                                <div
                                  className='flex items-center px-2 py-1 gap-2 bg-content-grey-100 rounded-4'
                                  key={definition.definitionId}
                                >
                                  <span className='text-xs leading-5 text-content-black'>{definition.value}</span>
                                  <IconButton
                                    className='!p-0'
                                    onClick={() => handleOpenEditKeywordValue(definition, elem.id)}
                                  >
                                    <PencilSquareIcon className='w-4 h-4 text-content-grey-600' />
                                  </IconButton>
                                </div>
                              )}
                            </div>
                          ))}
                          <div
                            className='flex items-center bg-content-grey-100 text-content-accent rounded-4 gap-2 py-1 px-2 
                            cursor-pointer transition-all hover:text-content-accent-hover'
                            onClick={() => {
                              setAddNewKeywordCategoryId(elem.id);
                              setAddKewordModal(true);
                              setAddDefinitionType('out');
                            }}
                          >
                            <span className='text-xs '>Add definition</span>
                            <IconButton className='!p-0'>
                              <PlusIcon className='w-4 h-4 text-content-accent' />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex gap-2.5'>
                {/* <Button
                title='Back to core-idea'
                variant='outline'
                onClick={() => setResearchSteps((currentStep) => currentStep - 1)}
                className='rounded-[40px] w-[220px] !h-9'
            /> */}
                <Button
                  title='Confirm specification'
                  variant='primary'
                  onClick={() => setResearchSteps((currentStep) => currentStep + 1)}
                  // onClick={handleGoToScondLevel}
                  className='rounded-[40px] w-[220px] !h-9'
                />
              </div>
            </div>
          )}

          {researchSteps === RESEARCHSTEPS.Examples && (
            <div className='flex flex-col gap-7'>
              <div className='custom-scrollbar-thumb max-h-[402px] min-h-[243px] flex flex-col gap-4'>
                <div className='flex gap-3 flex-col'>
                  <h3 className='font-semibold text-xs leading-5 text-content-black '>
                    Exemplary keywords for searches
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {examplesResults.map((example) => (
                      <div key={example.id} className='py-1.5 px-2 bg-content-grey-100 rounded'>
                        <p className='text-xs '>{example.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className='flex gap-2.5'>
                <Button
                  title='Back to specification'
                  variant='outline'
                  onClick={() => setResearchSteps((currentStep) => currentStep - 1)}
                  className='rounded-[40px] w-[220px] !h-9'
                />
                <Button
                  title='Confirm keywords'
                  variant='primary'
                  onClick={() => setResearchSteps((currentStep) => currentStep + 1)}
                  className='rounded-[40px] w-[220px] !h-9'
                />
              </div>
            </div>
          )}

          {researchSteps === RESEARCHSTEPS.ResearchResults && (
            <div className='flex flex-col gap-5 overflow-hidden'>
              <div className='w-full px-0.5 rounded-2xl bg-white custom-scrollbar-thumb max-h-[435px]'>
                <div className='flex flex-col min-w-[763px] max-w-[800px] '>
                  <div className='flex mb-2'>
                    <div className='w-36'>
                      <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>Source name</span>
                    </div>
                    <div className='ml-1 w-36'>
                      <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>Source link</span>
                    </div>
                    <div className='ml-1 w-24'>
                      <span className='font-poppins-medium text-xs leading-5 text-content-grey-600 '>
                        Quality grade
                      </span>
                    </div>
                    <div className='w-[200px] ml-[5px]'>
                      <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>
                        Contained research information
                      </span>
                    </div>
                  </div>
                  {researchResults.map((research) => (
                    <ResearchItemRow
                      key={research.id}
                      researchItem={research}
                      // onInput={onInput}
                      // onInputKeyDown={onInputKeyDown}
                      // doSubmit={doSubmit}
                    />
                  ))}
                </div>
              </div>
              <Button
                title='Back to search examples'
                variant='outline'
                onClick={() => setResearchSteps((currentStep) => currentStep - 1)}
                className='rounded-[40px] w-[220px] !h-9'
              />
            </div>
          )}
        </div>
      </div>

      <AddDefinitionModal
        open={addKewordModal}
        onClose={handleCloseAddDefinitionModal}
        addKeyword={(definition: string) => handleAddNewKeyWord(definition)}
        // addKeyword={(definition: string) => console.log(definition)}
      />
    </>
  );
};

export default Research;
