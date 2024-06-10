import React, {useState} from 'react';
import {AxiosError} from 'axios';
import toast from 'react-hot-toast';

import {Button} from '../../buttons';
import {clearWhitespaces} from '@/helpers';
import {AddDefinitionModal} from './AddDefinitionModal';
import {
  IChatItem,
  IChatResponseResult,
  IKeywordsCollection,
  IPostTopicResponse,
  IResearchResult,
  ISearchInGoogleResponse,
  TExemplaryKeywords,
} from './types';
import ResearchItemRow from './ResearchItemRow';
import {RESEARCHSTEPS} from './researchConstant';
import apiHub from '@/hooks/useApiClient';
import SpecificationSection from './SpecificationSection';
import HeaderSection from './HeaderSection';
import TopicSection from './TopicSection';
import {ContainedInformationDialog} from './ContainedInformationDialog';

type Props = {};

const Research = (props: Props) => {
  const [topic, setTopic] = useState('');
  const [researchSteps, setResearchSteps] = useState(RESEARCHSTEPS.startTopic);
  const [exemplaryKeywords, setExemplaryKeywords] = useState<TExemplaryKeywords[] | undefined>(undefined);
  const [researchResults, setResearchResults] = useState<IResearchResult[]>();
  const [definitionTitleOnEditMode, setKeywordTitleOnEditMode] = useState('');
  const [addNewKeywordCategoryId, setAddNewKeywordCategoryId] = useState('');
  const [editKeywordsTitle, setEditKeywordsTitle] = useState('');
  const [editKeywordsValue, setEditKeywordsValue] = useState('');
  const [addKewordModal, setAddKewordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [specifcations, setSpecifications] = useState<IKeywordsCollection[] | undefined>(undefined);
  const [addDefinitionType, setAddDefinitionType] = useState<'in' | 'out' | ''>('');
  const [showContainedInformationDialog, setShowContainedInformationDialog] = useState(false);
  const [containedInformationText, setContainedInformationText] = useState('');

  const handleCloseAddDefinitionModal = () => {
    setAddKewordModal(false);
    setAddDefinitionType('');
  };

  const handleAddNewKeyWord = (definition: string) => {
    if (!specifcations) return;
    const result = specifcations.flatMap((collection) =>
      clearWhitespaces(collection.title) === addNewKeywordCategoryId
        ? addDefinitionType === 'in'
          ? {
              ...collection,
              in_scope: [...collection.in_scope, definition],
            }
          : {
              ...collection,
              out_scope: [...collection.out_scope, definition],
            }
        : collection,
    );

    setSpecifications(result);
    setAddNewKeywordCategoryId('');
    setAddKewordModal(false);
  };

  const handleOpenAddNewKeywordDialog = (title: string, type: 'in' | 'out') => {
    setAddNewKeywordCategoryId(clearWhitespaces(title));
    setAddKewordModal(true);
    setAddDefinitionType(type);
  };

  const clearKeywordTitleToEditMode = () => {
    setKeywordTitleOnEditMode('');
    setEditKeywordsTitle('');
  };

  const handleConfirmGoogleSearchKeywords = async () => {
    if (!exemplaryKeywords) return;
    const query = [...exemplaryKeywords].flatMap((keywords) => keywords.map((keyword) => keyword));
    setIsLoading(true);
    try {
      console.log('search_in_google ... runs');
      const {status, data} = await apiHub.post<IPostTopicResponse>('api/v1/ai-functions/direct-call', {
        name: 'search_in_google',
        parameters: {
          topic,
          queries: [
            {
              query,
              number_check_results: 1,
            },
          ],
        },
      });
      if (status === 201) {
        if (data.Error) {
          const parsedData: {error: string} = JSON.parse(data.Error.error);
          toast.error(parsedData.error);
        } else if (data.Mixed && data.Mixed.length > 0) {
          const {Text} = data.Mixed[0];
          if (Text?.response) {
            const parsedData: ISearchInGoogleResponse = JSON.parse(Text.response);
            console.log({parsedData});
            if (parsedData.status === 'ok') {
              const payload: IResearchResult[] = parsedData.result.flatMap((res) => ({
                containedInformation: res['Contained information'],
                index: res.Index,
                occurrences: res.Occurrences,
                sourceLink: res['Source link'],
                sourceName: res['Source name'],
                text: res.Text,
                messages: null,
              }));
              setResearchResults(payload);
              setResearchSteps(RESEARCHSTEPS.ResearchResults);
            }
          }
        }
      }
      // }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const submitChangeKeywordsTitle = () => {
    if (!editKeywordsTitle || !specifcations) return;
    const result = specifcations.flatMap((item) =>
      clearWhitespaces(item.title) === definitionTitleOnEditMode ? {...item, title: editKeywordsTitle} : item,
    );
    console.log({result, specifcations});
    setSpecifications(result);
    clearKeywordTitleToEditMode();
  };
  const checkEnterKeyPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return true;
    }
    return false;
  };

  const handleShowContainedInformation = (text: string) => {
    setShowContainedInformationDialog(true);
    setContainedInformationText(text);
  };

  const handleSubmitChat = async (userInput: string, researchItem: IResearchResult) => {
    setIsLoading(true);
    try {
      console.log('chat ... runs');
      const {status, data} = await apiHub.post<IPostTopicResponse>('api/v1/ai-functions/direct-call', {
        name: 'chat',
        parameters: {
          question: userInput,
          chat: researchItem.messages ?? [],
          information: researchItem.containedInformation ?? '',
        },
      });
      if (status === 201) {
        if (data.Error) {
          const parsedData: {error: string} = JSON.parse(data.Error.error);
          toast.error(parsedData.error);
        } else if (data.Mixed && data.Mixed.length > 0) {
          const {Text} = data.Mixed[0];
          if (Text?.response) {
            const parsedData: IChatResponseResult = JSON.parse(Text.response);
            console.log({parsedData: parsedData.chat, researchItem});
            const filteredChat: IChatItem[] = parsedData.chat.flat().filter((ch) => 'content' in ch);
            if (!researchResults) return;
            const result = researchResults.flatMap((research) =>
              clearWhitespaces(research.sourceName) === clearWhitespaces(researchItem.sourceName)
                ? {...research, messages: filteredChat}
                : research,
            );
            setResearchResults(result);
          }
        }
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='flex flex-col rounded-20 bg-content-grey-0 px-5 pb-5 pt-4 w-full flex-1'>
        <h1 className='text-xl leading-7 font-semibold text-content-grey-900 mb-3'>Research application</h1>
        <div className='flex flex-col'>
          <HeaderSection researchSteps={researchSteps} />

          {researchSteps === RESEARCHSTEPS.startTopic && (
            <TopicSection
              topic={topic}
              setTopic={setTopic}
              setSpecifications={setSpecifications}
              setResearchSteps={setResearchSteps}
            />
          )}

          {researchSteps === RESEARCHSTEPS.Specification && (
            <SpecificationSection
              specifcations={specifcations}
              handleOpenAddNewKeywordDialog={handleOpenAddNewKeywordDialog}
              editKeywordsValue={editKeywordsValue}
              definitionTitleOnEditMode={definitionTitleOnEditMode}
              editKeywordsTitle={editKeywordsTitle}
              setEditKeywordsTitle={setEditKeywordsTitle}
              checkEnterKeyPressed={checkEnterKeyPressed}
              submitChangeKeywordsTitle={submitChangeKeywordsTitle}
              clearKeywordTitleToEditMode={clearKeywordTitleToEditMode}
              setKeywordTitleOnEditMode={setKeywordTitleOnEditMode}
              setEditKeywordsValue={setEditKeywordsValue}
              setSpecifications={setSpecifications}
              setExemplaryKeywords={setExemplaryKeywords}
              topic={topic}
              setResearchSteps={setResearchSteps}
            />
          )}

          {researchSteps === RESEARCHSTEPS.Examples && (
            <div className='flex flex-col gap-7'>
              <div className='custom-scrollbar-thumb max-h-[402px] min-h-[243px] flex flex-col gap-4'>
                <div className='flex gap-3 flex-col'>
                  <h3 className='font-semibold text-xs leading-5 text-content-grey-900 '>
                    Exemplary keywords for searches
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {exemplaryKeywords &&
                      exemplaryKeywords.map((examples) =>
                        examples.map((example) => (
                          <div key={clearWhitespaces(example)} className='py-1.5 px-2 bg-content-grey-100 rounded'>
                            <p className='text-xs '>{example}</p>
                          </div>
                        )),
                      )}
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
                  title={isLoading ? '' : 'Confirm keywords'}
                  variant='primary'
                  onClick={handleConfirmGoogleSearchKeywords}
                  className='rounded-[40px] w-[220px] !h-9'
                  disabled={isLoading}
                  loading={isLoading}
                />
              </div>
            </div>
          )}

          {researchSteps === RESEARCHSTEPS.ResearchResults && (
            <div className='flex flex-col gap-5 overflow-hidden'>
              <div className='w-full px-0.5 rounded-2xl bg-content-grey-0 custom-scrollbar-thumb max-h-[435px]'>
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
                  {researchResults &&
                    researchResults.map((research) => (
                      <ResearchItemRow
                        key={`research-number-${research.index}`}
                        researchItem={research}
                        handleShowContainedInformation={handleShowContainedInformation}
                        submitChat={handleSubmitChat}
                        isLoading={isLoading}
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
      {addKewordModal && (
        <AddDefinitionModal
          open={addKewordModal}
          onClose={handleCloseAddDefinitionModal}
          addKeyword={(definition: string) => handleAddNewKeyWord(definition)}
          // addKeyword={(definition: string) => console.log(definition)}
        />
      )}
      {showContainedInformationDialog && (
        <ContainedInformationDialog
          open={showContainedInformationDialog}
          containedInformation={containedInformationText}
          onClose={() => {
            setShowContainedInformationDialog(false);
            setContainedInformationText('');
          }}
        />
      )}
    </>
  );
};

export default Research;
