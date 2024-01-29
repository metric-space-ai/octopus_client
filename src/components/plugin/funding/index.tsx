import React, {useEffect, useRef, useState} from 'react';
import {Button, IconButton} from '../../buttons';
import classNames from 'classnames';
import {
  ArrowPathIcon,
  ChevronUpIcon,
  PaperAirplaneIcon,
  PencilIcon,
  PencilSquareIcon,
  PlusIcon,
  StopIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {AddNewKeyword} from '../../modals/AddKeywordModal';
import userImageSample from './../../../public/images/user-sample.png';
import {AnimateDots, LogoIcon} from '../../svgs';
import {useDebouncedCallback} from 'use-debounce';
import {autoGrowTextArea} from '@/helpers';
import {Disclosure} from '@headlessui/react';

type Props = {};

const FUNDSTEPS = {CoreIdea: 1, Application: 2, Formulation: 3};

const KEYWORDSCOLLECTION: IKeywordsCollection[] = [
  {
    id: '100',
    title: 'Project title',
    keywords: [
      {keywordId: '100-1', value: 'AI-based feeding automaton'},
      {keywordId: '100-2', value: 'Recognition and feeding'},
      {keywordId: '100-3', value: 'Squirrels'},
      {keywordId: '100-4', value: 'Individuals'},
    ],
  },
  {
    id: '101',
    title: 'Aim of the project',
    keywords: [
      {keywordId: '101-1', value: 'AI-based squirrel feeding station'},
      {keywordId: '101-2', value: 'Autonomous recognition of individuals'},
      {keywordId: '101-3', value: 'Special food with additives (vitamins)'},
      {keywordId: '101-4', value: 'Wildlife camera'},
      {keywordId: '101-5', value: 'IR camera'},
      {keywordId: '101-6', value: 'Motion sensors'},
      {keywordId: '101-7', value: 'Deep Learning algorithms'},
      {keywordId: '101-8', value: '90% safety'},
      {keywordId: '101-9', value: 'Malnutrition'},
    ],
  },
  {
    id: '102',
    title: 'Description of all work',
    keywords: [
      {keywordId: '102-1', value: 'Adaptation of the algorithm/station'},
      {keywordId: '102-2', value: 'Test of the whole station under different conditions'},
      {keywordId: '102-3', value: 'Algorithm test'},
      {keywordId: '102-4', value: 'PyTorch'},
      {keywordId: '102-5', value: 'Identification of squirrels based on head features'},
      {keywordId: '102-6', value: 'Algorithm test'},
      {keywordId: '102-7', value: 'Test of the whole station under different conditions'},
      {keywordId: '102-8', value: 'Adaptation of the algorithm/station'},
    ],
  },
  {
    id: '103',
    title: 'Novelty',
    keywords: [
      {keywordId: '103-1', value: 'Identification of single squirrel individuals'},
      {keywordId: '103-2', value: 'Development of model elements for YOLO algorithm'},
      {keywordId: '103-3', value: 'Algorithm test'},
    ],
  },
  {
    id: '104',
    title: 'Routine delineation',
    keywords: [
      {keywordId: '104-1', value: 'Building competencies in AI-based object recognition'},
      {keywordId: '104-2', value: 'Development of an AI solution for individual feeding'},
      {keywordId: '104-3', value: 'First automated station'},
      {keywordId: '104-4', value: 'Product portfolio of manually operated automatic feeders'},
    ],
  },
  {
    id: '105',
    title: 'Scientific-technical risks',
    keywords: [
      {keywordId: '105-1', value: 'Risk of insufficient identification by AI'},
      {keywordId: '105-2', value: 'Minimal difference in external characteristics of squirrels'},
      {keywordId: '105-3', value: 'Seasonal and age-related'},
      {keywordId: '105-4', value: 'Positioning of squirrels in front of the camera'},
      {keywordId: '105-5', value: 'Time factor and speed of the system'},
      {keywordId: '105-6', value: 'Image quality and missing colour information in IR images'},
    ],
  },
];
const FORMULATIONRESULT: IFormulationResult[] = [
  {
    id: 'abc1000',
    title: 'Project title',
    description: 'AI-based automatic feeder for the recognition and feeding of single individuals of squirrels',
    communicates: [
      {
        id: 'def10001',
        message:
          'What measures or strategies are being considered or implemented to address the challenges posed by the variability in external features, seasonal changes, and limited time availability, ensuring the AI system can accurately and swiftly identify squirrels despite these complexities?',
        response:
          "To address these challenges, ongoing efforts involve refining the AI algorithms to adapt to variable external features and seasonal changes, utilizing advanced image processing techniques, and optimizing the system's speed to operate efficiently within the brief time window of less than 5 seconds when squirrels are present",
        status: 'asking',
      },
      {
        id: 'def10002',
        message:
          'lorem ipsum dolor sit am equivalents of ver lorem ipsum dolor sit am equivalents of ver lorem ipsum dolor sit am equivalents of ver ',
        response: '',
        status: 'answered',
      },
    ],
  },
  {
    id: 'abc1001',
    title: 'Project title',
    description:
      'An AI-based squirrel feeding station is to be developed which independently recognises individuals of a population and dispenses special food with additives (e.g. vitamins) to individual animals. The automatic feeder has both a normal wildlife camera (for daytime recordings) and an IR camera (for twilight recordings) with motion sensors. After a movement detection, images are taken, transmitted to a server one after the other and evaluated using Deep Learning algorithms. As soon as the individual is correctly identified with 90% certainty, the signal is given to open the container with special food. An accuracy of less than 90% would result in undesirable severe malnutrition of the animals.',
    communicates: [],
  },
  {
    id: 'abc1002',
    title: 'Project title',
    description: `WP1: Design and construction of an automatic feeder with cameras and motion sensors, recording of 1000 images of 50 different squirrels with an IR camera. Squirrels with an IR and normal wildlife camera.
    WP2: Development of YOLO (You Only Look Once) model elements for squirrel recognition, implementation with PyTorch and YOLO Package.
    WP3: Data preparation, training and validation of the squirrel identification model using images of a test population based on head features (ears, nose, mouth, fur colour and tactile hairs).
    WP4: Algorithm test with IR and wildlife camera data
    WP5: Test of the entire station under various conditions (weather, day/night). (weather, day/night) and adaptation of the algorithm/station.`,
    communicates: [],
  },
  {
    id: 'abc1003',
    title: 'Scientific and technical risks',
    description:
      'The greatest risk is that the AI will not be able to identify the squirrels with the required speed and accuracy on the basis of the few images available. The reasons for this are that the individual animals differ only minimally in their external features, decisive features (e.g. fur and ear tufts) change seasonally and in the course of life, and the squirrel is not always positioned frontally in front of the camera. Therefore, it is not foreseeable whether the image quality will be sufficient to clearly distinguish the animals from each other. Furthermore, important colour information for differentiation is missing in the IR images. In addition, the time factor is relevant, as the wild animals only stay in the same place for a very short time and therefore the system must work for less than 5 s.',
    communicates: [],
  },
];

interface IKeywordsCollection {
  id: string;
  title: string;
  keywords: IKeyword[];
}

interface IKeyword {
  keywordId: string;
  value: string;
}

interface IFormulationResult {
  id: string;
  title: string;
  description: string;
  communicates: IFormulationResultCommunicate[];
}
interface IFormulationResultCommunicate {
  id: string;
  message: string;
  response: string;
  status: 'asking' | 'answered';
}
const Funding = (props: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [keywordsCollection, setKeywordsCollection] = useState(KEYWORDSCOLLECTION);
  const [formulationResults, setFormulationResults] = useState<IFormulationResult[]>(FORMULATIONRESULT);
  const [selectedResult, setSelectedResult] = useState<string>();
  const [fundSteps, setFundSteps] = useState(FUNDSTEPS.CoreIdea);
  const [coreIdea, setCoreIdea] = useState('');
  const [keywordOnEditMode, setKeywordOnEditMode] = useState('');
  const [keywordTitleOnEditMode, setKeywordTitleOnEditMode] = useState({id: '', title: ''});
  const [addNewKeywordCategoryId, setAddNewKeywordCategoryId] = useState('');
  const [editKeywordsTitle, setEditKeywordsTitle] = useState('');
  const [openEditKeywordvalue, setOpenEditKeywordValue] = useState({id: '', parentId: ''});
  const [editKeywordsValue, setEditKeywordsValue] = useState('');
  const [addKewordModal, setAddKewordModal] = useState(false);
  const [inputRows, setInputRows] = useState(1);
  const [userInput, setUserInput] = useState('');

  const measure = useDebouncedCallback(
    () => {
      const rows = inputRef.current ? autoGrowTextArea(inputRef.current) : 1;
      const inputRows = Math.min(20, Math.max(1, rows));

      setInputRows(inputRows > 10 ? 10 : inputRows);
    },
    100,
    {
      leading: true,
      trailing: true,
    },
  );

  const onInput = (text: string) => {
    setUserInput(text);
  };

  const doSubmit = (userInput: string) => {
    if (userInput.trim() === '') return;
    // newMessage(userInput, !enabledContentSafety);
    // setUserInput('');
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return false;
    if (e.key === 'Enter' && e.nativeEvent.isComposing) return false;
    if (e.altKey || e.ctrlKey || e.shiftKey) {
      doSubmit(userInput);
      e.preventDefault();
    }
  };

  const handleGoToScondLevel = () => {
    setFundSteps(FUNDSTEPS.Application);
  };

  const handleAddNewKeyWord = (keyword: string) => {
    const result = keywordsCollection.flatMap((cat) =>
      cat.id === addNewKeywordCategoryId
        ? {
            ...cat,
            keywords: [
              ...cat.keywords,
              {keywordId: (Math.floor(Math.random() * 9999) + 1000).toString(), value: keyword},
            ],
          }
        : cat,
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

  const handleOpenEditKeywordValue = (keyword: IKeyword, parentId: string) => {
    setEditKeywordsValue(keyword.value);
    setOpenEditKeywordValue({id: keyword.keywordId, parentId});
  };

  const handleCloseEditKeywordValue = () => {
    setEditKeywordsValue('');
    setOpenEditKeywordValue({id: '', parentId: ''});
  };

  const submitChangeKeywordsDirectKeywordValue = () => {
    if (!editKeywordsValue) return;
    const result = keywordsCollection.flatMap((item) =>
      item.id === openEditKeywordvalue.parentId
        ? {
            ...item,
            keywords: [
              ...item.keywords.flatMap((keyword) =>
                keyword.keywordId === openEditKeywordvalue.id ? {...keyword, value: editKeywordsValue} : keyword,
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
    const result = keywordsCollection.flatMap((item) =>
      item.id === keywordTitleOnEditMode.id ? {...item, title: editKeywordsTitle} : item,
    );
    console.log({result, keywordsCollection});
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(measure, [userInput]);

  return (
    <>
      <div className='flex flex-col rounded-20 bg-content-white px-5 pb-5 pt-4'>
        <h1 className='text-xl leading-7 font-semibold text-content-black mb-4'>Application for funding</h1>
        <div className='flex flex-col'>
          {fundSteps === FUNDSTEPS.CoreIdea && (
            <>
              <h2 className='font-semibold text-sm leading-5 mb-1 text-content-accent-hover'>Core-idea:</h2>
              <p className='text-xs leading-5 text-content-black mb-3'>Provide details about your idea.</p>
            </>
          )}
          {fundSteps === FUNDSTEPS.Application && (
            <>
              <h2 className='font-semibold text-sm leading-5 mb-1 text-content-accent-hover'>
                Keywords generated based on your core-idea
              </h2>
              <p className='text-xs leading-5 text-content-black mb-3'>
                Check your keywords and edit them if necessary.
              </p>
            </>
          )}
          {fundSteps === FUNDSTEPS.Formulation && (
            <>
              <h2 className='font-semibold text-sm leading-5 mb-4 text-content-accent-hover'>Formulation results</h2>
            </>
          )}
          {fundSteps === FUNDSTEPS.CoreIdea && (
            <div className='flex flex-1 relative items-center mb-5'>
              <textarea
                //   ref={inputRef}
                className={`w-full border py-2 px-4 pb-6 rounded-[18px] resize-none outline-none 
                            focus:border-content-black custom-scrollbar-thumb bg-content-grey-100`}
                placeholder='Core-idea'
                onInput={(e) => setCoreIdea(e.currentTarget.value)}
                value={coreIdea}
                //   onKeyDown={(e) => onInputKeyDown(e, answerInput, response)}
                rows={15}
                autoFocus={true}
              />
              <span
                className={classNames(`text-content-grey-400 text-xs absolute right-3 bottom-2`, {
                  '!text-content-red-600': coreIdea.length > 1000,
                })}
              >{`${coreIdea.length}/1000`}</span>
            </div>
          )}

          {fundSteps === FUNDSTEPS.Application && (
            <div className='flex flex-col gap-5'>
              <div className='custom-scrollbar-thumb h-[402px] flex flex-col gap-4'>
                {keywordsCollection.map((elem, elemIndex) => (
                  <div className='flex flex-col gap-3 mb-4' key={elem.id}>
                    {keywordTitleOnEditMode.id === elem.id ? (
                      <div className='flex items-center relative max-w-fit'>
                        <input
                          className='text-xs text-content-black pl-2 pr-8 py-1 border-r outline-content-accent rounded-4 bg-content-grey-100'
                          value={editKeywordsTitle}
                          name='keywordsTitle'
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
                    <div className='flex flex-wrap gap-2'>
                      {elem.keywords.map((keyword, index) =>
                        keyword.keywordId === openEditKeywordvalue.id ? (
                          <div className='flex items-center relative max-w-fit' key={keyword.keywordId}>
                            <input
                              className='text-xs text-content-black pl-2 pr-8 py-1 border-r outline-content-accent rounded-4 bg-content-grey-100'
                              value={editKeywordsValue}
                              name='keywordsTitle'
                              // defaultValue={editKeywordsTitle}
                              onChange={(e) => setEditKeywordsValue(e.target.value)}
                              onKeyDown={(e) => checkEnterKeyPressed(e) && submitChangeKeywordsDirectKeywordValue()}
                            />
                            <span className='block absolute w-[1px] h-4 bg-content-grey-400 right-8' />
                            <IconButton className='!p-0 absolute right-2' onClick={handleCloseEditKeywordValue}>
                              <XMarkIcon className='w-4 h-4 text-content-black' />
                            </IconButton>
                          </div>
                        ) : (
                          <div
                            className='flex items-center px-2 py-1 gap-2 bg-content-grey-100 rounded-4'
                            key={keyword.keywordId}
                          >
                            <span className='text-xs leading-5 text-content-black'>{keyword.value}</span>
                            <IconButton className='!p-0' onClick={() => handleOpenEditKeywordValue(keyword, elem.id)}>
                              <PencilSquareIcon className='w-4 h-4 text-content-grey-600' />
                            </IconButton>
                          </div>
                        ),
                      )}

                      <div
                        className='flex items-center bg-content-grey-100 text-content-accent rounded-4 gap-2 py-1 px-2 
                        cursor-pointer transition-all hover:text-content-accent-hover'
                        onClick={() => {
                          setAddNewKeywordCategoryId(elem.id);
                          setAddKewordModal(true);
                        }}
                      >
                        <span className='text-xs '>Add keyword</span>
                        <IconButton className='!p-0'>
                          <PlusIcon className='w-4 h-4 text-content-accent' />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex gap-2.5'>
                <Button
                  title='Back to core-idea'
                  variant='outline'
                  onClick={() => setFundSteps((currentStep) => currentStep - 1)}
                  className='rounded-[40px] w-[220px] !h-9'
                />
                <Button
                  title='Confirm keywords'
                  variant='primary'
                  onClick={() => setFundSteps((currentStep) => currentStep + 1)}
                  // onClick={handleGoToScondLevel}
                  className='rounded-[40px] w-[220px] !h-9'
                />
              </div>
            </div>
          )}

          {fundSteps === FUNDSTEPS.Formulation && (
            <div className='flex flex-col gap-5'>
              <div className='custom-scrollbar-thumb h-[402px] flex flex-col gap-8'>
                {formulationResults.map((result, index) => (
                  <div className='flex flex-col' key={result.id}>
                    <h3
                      className='font-semibold text-xs leading-5 text-content-black mb-1.5'
                      onClick={() => console.log({result, formulationResults})}
                    >
                      {result.title}
                    </h3>
                    <p className='text-xs text-content-black mb-3.5'>{result.description}</p>
                    {selectedResult === result.id || result.communicates.length > 0 ? (
                      <Disclosure>
                        {({open}) => (
                          <div className='flex flex-col py-3 px-4 gap-4 bg-content-grey-100 rounded-3xl'>
                            <div className='flex justify-between'>
                              <h4 className='font-semibold text-xs leading-5 text-content-accent'>{`Question (${result.communicates.length})`}</h4>
                              <Disclosure.Button className='flex items-center'>
                                <ChevronUpIcon
                                  className={classNames(
                                    {'rotate-180 transform': !open},
                                    'h-5 w-5 text-purple-500 transition-all',
                                  )}
                                />
                              </Disclosure.Button>
                            </div>
                            <Disclosure.Panel className='flex flex-col gap-4'>
                              {result.communicates.map((question) => (
                                <div className='flex flex-col gap-4' key={question.id}>
                                  <div className='flex items-start gap-2'>
                                    <div className='mr-1'>
                                      <img src={userImageSample.src} className='rounded-full w-8 h-8' />
                                    </div>
                                    <p className='text-sm flex-1'>{question.message}</p>
                                    <IconButton className='!p-0'>
                                      <PencilSquareIcon className='w-4 h-4 text-content-grey-600' />
                                    </IconButton>
                                  </div>
                                  <div className='flex gap-2 items-start'>
                                    <div className='flex items-center justify-center w-8 h-8 bg-content-black mr-1 rounded-full'>
                                      <LogoIcon width={19} height={12} color='#F5F5F5' />
                                    </div>
                                    {question.status === 'answered' && (
                                      <>
                                        <p className='text-sm flex-1'>{question.response}</p>
                                        <IconButton className='!p-0'>
                                          <ArrowPathIcon className='w-4 h-4 text-content-grey-600' />
                                        </IconButton>
                                      </>
                                    )}
                                    {question.status === 'asking' && (
                                      <div className='flex flex-col gap-4 flex-1'>
                                        <div className='flex items-center justify-center py-[11px] px-4 rounded-b-2xl rounded-tr-2xl bg-content-black w-16'>
                                          <AnimateDots />
                                        </div>

                                        <div className='mx-auto'>
                                          <Button
                                            className='bg-white h-9'
                                            variant='transparent'
                                            size='small'
                                            iconBefore={<StopIcon className='w-4 h-4' />}
                                            title='Stop generating...'
                                            // onClick={() => deleteMessage(item, false)}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <div className='flex gap-3 items-start'>
                                <div>
                                  <img src={userImageSample.src} className='rounded-full w-8 h-8' />
                                </div>
                                <div className='relative flex-1 flex items-center'>
                                  <textarea
                                    ref={inputRef}
                                    className={`text-sm w-full border py-[7px] pr-[96px] pl-5 rounded-3xl resize-none outline-none focus:border-content-black custom-scrollbar-thumb`}
                                    placeholder='Ask anything'
                                    onInput={(e) => onInput(e.currentTarget.value)}
                                    value={userInput}
                                    onKeyDown={onInputKeyDown}
                                    rows={inputRows}
                                    autoFocus={true}
                                  />
                                  <span
                                    className={classNames('text-content-grey-400 text-xs right-12 absolute', {
                                      'text-content-red-600': userInput.length > 300,
                                    })}
                                  >{`${userInput.length}/300`}</span>
                                  <IconButton
                                    className='absolute right-0 !w-9 !h-9'
                                    onClick={() => doSubmit(userInput)}
                                  >
                                    <PaperAirplaneIcon className='w-5 h-5 text-content-grey-600' />
                                  </IconButton>
                                </div>
                              </div>
                            </Disclosure.Panel>
                          </div>
                        )}
                      </Disclosure>
                    ) : (
                      <Button
                        size='small'
                        title='Ask question'
                        variant='primary'
                        fontWeight='normal'
                        onClick={() => setSelectedResult(result.id)}
                        className='rounded-[40px] w-[103px] !h-7 !px-1'
                      />
                    )}
                  </div>
                ))}
              </div>
              <Button
                title='Back to keywords list'
                variant='outline'
                onClick={() => setFundSteps((currentStep) => currentStep - 1)}
                className='rounded-[40px] w-[220px] !h-9'
              />
            </div>
          )}

          {fundSteps === FUNDSTEPS.CoreIdea && (
            <Button
              title='Continue'
              disabled={coreIdea.length < 5}
              onClick={handleGoToScondLevel}
              className='rounded-[40px] w-[220px] !h-9'
              //   iconBefore={<ArrowPathIcon className='w-5 h-5 text-white' />}
            />
          )}
        </div>
      </div>

      <AddNewKeyword
        open={addKewordModal}
        onClose={() => setAddKewordModal(false)}
        addKeyword={(keyword: string) => handleAddNewKeyWord(keyword)}
      />
    </>
  );
};

export default Funding;
