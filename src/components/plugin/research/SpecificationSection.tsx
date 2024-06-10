import React, {useState} from 'react';
import {AxiosError} from 'axios';
import toast from 'react-hot-toast';
import {PencilSquareIcon, PlusIcon, XMarkIcon} from '@heroicons/react/24/outline';

import {Button, IconButton} from '@/components/buttons';
import {clearWhitespaces} from '@/helpers';
import {IKeywordsCollection, IPostSpecificationsResponseParsed, IPostTopicResponse, TExemplaryKeywords} from './types';
import {RESEARCHSTEPS} from './researchConstant';
import apiHub from '@/hooks/useApiClient';

type Props = {
  specifcations: IKeywordsCollection[] | undefined;
  handleOpenAddNewKeywordDialog: (id: string, type: 'in' | 'out') => void;
  editKeywordsValue: string;
  definitionTitleOnEditMode: string;
  editKeywordsTitle: string;
  setEditKeywordsTitle: React.Dispatch<React.SetStateAction<string>>;
  checkEnterKeyPressed: (e: React.KeyboardEvent<HTMLInputElement>) => boolean;
  submitChangeKeywordsTitle: () => void;
  clearKeywordTitleToEditMode: () => void;
  setKeywordTitleOnEditMode: React.Dispatch<React.SetStateAction<string>>;
  setEditKeywordsValue: (value: React.SetStateAction<string>) => void;
  setSpecifications: React.Dispatch<React.SetStateAction<IKeywordsCollection[] | undefined>>;
  setExemplaryKeywords: React.Dispatch<React.SetStateAction<TExemplaryKeywords[] | undefined>>;
  setResearchSteps: React.Dispatch<React.SetStateAction<number>>;

  topic: string;
};

const SpecificationSection = ({
  specifcations,
  handleOpenAddNewKeywordDialog,
  editKeywordsValue,
  definitionTitleOnEditMode,
  editKeywordsTitle,
  setEditKeywordsTitle,
  checkEnterKeyPressed,
  submitChangeKeywordsTitle,
  clearKeywordTitleToEditMode,
  setKeywordTitleOnEditMode,
  setEditKeywordsValue,
  setSpecifications,
  setExemplaryKeywords,
  topic,
  setResearchSteps,
}: Props) => {
  const [openEditKeywordvalue, setOpenEditKeywordValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addKeywordTitleToEditMode = (title: string) => {
    setKeywordTitleOnEditMode(clearWhitespaces(title));
    setEditKeywordsTitle(title);
  };

  const handleOpenEditKeywordValue = (definition: string) => {
    setEditKeywordsValue(definition);
    setOpenEditKeywordValue(clearWhitespaces(definition));
  };

  const handleCloseEditKeywordValue = () => {
    setEditKeywordsValue('');
    setOpenEditKeywordValue('');
  };

  const submitChangeKeywordsDirectKeywordValue = (definitionIndex: number, scopeIndex: number, type: 'in' | 'out') => {
    if (!editKeywordsValue || !specifcations) return;
    const result = [...specifcations];
    if (type === 'in') {
      result[definitionIndex].in_scope[scopeIndex] = editKeywordsValue;
    } else {
      result[definitionIndex].out_scope[scopeIndex] = editKeywordsValue;
    }
    setSpecifications(result);
    handleCloseEditKeywordValue();
  };

  const handleConfirmSpecifications = async () => {
    if (!specifcations) return;
    setIsLoading(true);
    try {
      const {status, data} = await apiHub.post<IPostTopicResponse>('api/v1/ai-functions/direct-call', {
        name: 'confirm_specification',
        parameters: {
          topic,
          specification: specifcations,
        },
      });

      if (status === 201) {
        if (data.Error) {
          const parsedData: {error: string} = JSON.parse(data.Error.error);
          toast.error(parsedData.error);
        } else if (data.Mixed && data.Mixed.length > 0) {
          const {Text} = data.Mixed[0];
          if (!Text) return;
          const parsedData: IPostSpecificationsResponseParsed = JSON.parse(Text.response);
          console.log({parsedData: JSON.parse(Text.response)});
          if (parsedData.status === 'ok' && typeof parsedData.result !== 'string') {
            setExemplaryKeywords(parsedData.result);
            setResearchSteps(RESEARCHSTEPS.Examples);
          } else if (typeof parsedData.result === 'string') {
            toast.error(parsedData.result);
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

  return (
    <div className='flex flex-col gap-5'>
      <div className='custom-scrollbar-thumb h-[402px] flex flex-col gap-4'>
        {specifcations &&
          specifcations.map((elem, elemIndex) => (
            <div className='flex flex-col gap-3 mb-4' key={`sepecification-section-${clearWhitespaces(elem.title)}`}>
              {definitionTitleOnEditMode === clearWhitespaces(elem.title) ? (
                <div className='flex items-center relative max-w-fit'>
                  <input
                    className='text-xs text-content-grey-900 pl-2 pr-8 py-1 border-r outline-content-accent rounded-4 bg-content-grey-100'
                    value={editKeywordsTitle}
                    name='definitionsTitle'
                    // defaultValue={editKeywordsTitle}
                    onChange={(e) => setEditKeywordsTitle(e.target.value)}
                    onKeyDown={(e) => checkEnterKeyPressed(e) && submitChangeKeywordsTitle()}
                  />
                  <span className='block absolute w-[1px] h-4 bg-content-grey-400 right-8' />
                  <IconButton className='!p-0 absolute right-2' onClick={clearKeywordTitleToEditMode}>
                    <XMarkIcon className='w-4 h-4 text-content-grey-900' />
                  </IconButton>
                </div>
              ) : (
                <div className='flex gap-2 items-center'>
                  <h3 className='font-semibold text-xs leading-5 text-content-grey-900'>{`${elemIndex + 1}. ${
                    elem.title
                  }`}</h3>
                  <IconButton className='!p-0' onClick={() => addKeywordTitleToEditMode(elem.title)}>
                    <PencilSquareIcon className='w-4 h-4 text-content-grey-900' />
                  </IconButton>
                </div>
              )}
              <div className='flex flex-col gap-3'>
                <div className='flex flex-col'>
                  <i className='mb-2 text-content-grey-400 text-xs leading-5'>In scope</i>
                  <div className='flex flex-wrap gap-2'>
                    {elem.in_scope.map((definition, scopIndex) => (
                      <div className='flex flex-col'>
                        {clearWhitespaces(definition) === openEditKeywordvalue ? (
                          <div className='flex items-center relative max-w-fit' key={clearWhitespaces(definition)}>
                            <input
                              className='text-xs text-content-grey-900 pl-2 pr-8 py-1.5 border-r outline-content-accent rounded-4 bg-content-grey-100'
                              value={editKeywordsValue}
                              name='definitionsTitle'
                              // defaultValue={editKeywordsTitle}
                              onChange={(e) => setEditKeywordsValue(e.target.value)}
                              onKeyDown={(e) =>
                                checkEnterKeyPressed(e) &&
                                submitChangeKeywordsDirectKeywordValue(elemIndex, scopIndex, 'in')
                              }
                            />
                            <span className='block absolute w-[1px] h-4 bg-content-grey-400 right-8' />
                            <IconButton className='!p-0 absolute right-2' onClick={handleCloseEditKeywordValue}>
                              <XMarkIcon className='w-4 h-4 text-content-grey-900' />
                            </IconButton>
                          </div>
                        ) : (
                          <div
                            className='flex items-center px-2 py-1.5 gap-2 bg-content-grey-100 rounded-4'
                            key={clearWhitespaces(definition)}
                          >
                            <span className='text-xs leading-5 text-content-grey-900'>{definition}</span>
                            <IconButton className='!p-0' onClick={() => handleOpenEditKeywordValue(definition)}>
                              <PencilSquareIcon className='w-4 h-4 text-content-grey-600' />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    ))}
                    <div
                      className='flex items-center bg-content-grey-100 text-content-accent rounded-4 gap-2 py-1 px-2 
                            cursor-pointer transition-all hover:text-content-accent-hover'
                      onClick={() => handleOpenAddNewKeywordDialog(elem.title, 'in')}
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
                    {elem.out_scope.map((definition, scopeIndex) => (
                      <div className='flex flex-col'>
                        {clearWhitespaces(definition) === openEditKeywordvalue ? (
                          <div className='flex items-center relative max-w-fit' key={clearWhitespaces(definition)}>
                            <input
                              className='text-xs text-content-grey-900 pl-2 pr-8 py-1 border-r outline-content-accent rounded-4 bg-content-grey-100'
                              value={editKeywordsValue}
                              name='definitionsTitle'
                              // defaultValue={editKeywordsTitle}
                              onChange={(e) => setEditKeywordsValue(e.target.value)}
                              onKeyDown={(e) =>
                                checkEnterKeyPressed(e) &&
                                submitChangeKeywordsDirectKeywordValue(elemIndex, scopeIndex, 'out')
                              }
                            />
                            <span className='block absolute w-[1px] h-4 bg-content-grey-400 right-8' />
                            <IconButton className='!p-0 absolute right-2' onClick={handleCloseEditKeywordValue}>
                              <XMarkIcon className='w-4 h-4 text-content-grey-900' />
                            </IconButton>
                          </div>
                        ) : (
                          <div
                            className='flex items-center px-2 py-1 gap-2 bg-content-grey-100 rounded-4'
                            key={clearWhitespaces(definition)}
                          >
                            <span className='text-xs leading-5 text-content-grey-900'>{definition}</span>
                            <IconButton className='!p-0' onClick={() => handleOpenEditKeywordValue(definition)}>
                              <PencilSquareIcon className='w-4 h-4 text-content-grey-600' />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    ))}
                    <div
                      className='flex items-center bg-content-grey-100 text-content-accent rounded-4 gap-2 py-1 px-2 
                            cursor-pointer transition-all hover:text-content-accent-hover'
                      onClick={() => handleOpenAddNewKeywordDialog(elem.title, 'out')}
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
        <Button
          title='Back to core-idea'
          variant='outline'
          onClick={() => setResearchSteps((currentStep) => currentStep - 1)}
          className='rounded-[40px] w-[220px] !h-9'
        />
        <Button
          title={isLoading ? '' : 'Confirm specification'}
          variant='primary'
          onClick={handleConfirmSpecifications}
          // onClick={handleGoToScondLevel}
          className='rounded-[40px] w-[220px] !h-9'
          disabled={isLoading}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default SpecificationSection;
