import React, {useState} from 'react';
import {Button} from '../../buttons';
import {clearWhitespaces} from '@/helpers';
import {AddDefinitionModal} from './AddDefinitionModal';
import {
  IKeywordsCollection,
  IPostSpecificationsResponseParsed,
  IPostTopicResponse,
  IResearchResult,
  TExemplaryKeywords,
} from './types';
import ResearchItemRow from './ResearchItemRow';
import {RESEARCHRESULTS, RESEARCHSTEPS} from './researchConstant';
import apiHub from '@/hooks/useApiClient';
import {AxiosError} from 'axios';
import toast from 'react-hot-toast';
import SpecificationSection from './SpecificationSection';
import HeaderSection from './HeaderSection';
import TopicSection from './TopicSection';

type Props = {};

const Research = (props: Props) => {
  // const formRef = useRef<HTMLFormElement>(null);

  const [topic, setTopic] = useState('');
  const [researchSteps, setResearchSteps] = useState(RESEARCHSTEPS.startTopic);
  const [exemplaryKeywords, setExemplaryKeywords] = useState<TExemplaryKeywords[] | undefined>(undefined);
  const [researchResults, setResearchResults] = useState<IResearchResult[]>(RESEARCHRESULTS);
  const [coreIdea, setCoreIdea] = useState('');
  const [definitionTitleOnEditMode, setKeywordTitleOnEditMode] = useState('');
  const [addNewKeywordCategoryId, setAddNewKeywordCategoryId] = useState('');
  const [editKeywordsTitle, setEditKeywordsTitle] = useState('');
  const [editKeywordsValue, setEditKeywordsValue] = useState('');
  const [addKewordModal, setAddKewordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [specifcations, setSpecifications] = useState<IKeywordsCollection[] | undefined>(undefined);
  const [addDefinitionType, setAddDefinitionType] = useState<'in' | 'out' | ''>('');

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
      console.log('search_in_google ... runs');
      if (status === 201) {
        if (data.Text?.response) {
          const parsedData: IPostSpecificationsResponseParsed = JSON.parse(data.Text.response);
          console.log({parsedData: JSON.parse(data.Text.response)});
          // if (parsedData.status === 'ok') {
          //   setExemplaryKeywords(parsedData.result);
          //   setResearchSteps(RESEARCHSTEPS.Examples);
          // }
        } else if (data.Error?.error) {
          const parsedData: {error: string} = JSON.parse(data.Error.error);
          toast.error(parsedData.error);
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

  return (
    <>
      <div className='flex flex-col rounded-20 bg-content-white px-5 pb-5 pt-4 w-full flex-1'>
        <h1 className='text-xl leading-7 font-semibold text-content-black mb-3'>Research application</h1>
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
                  <h3 className='font-semibold text-xs leading-5 text-content-black '>
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
                  title='Confirm keywords'
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
