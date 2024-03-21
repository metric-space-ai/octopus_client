import React, {useRef, useState} from 'react';
import {Button} from '../../buttons';

import {AddNewKeyword} from './AddKeywordModal';

import {clearWhitespaces} from '@/helpers';

import {FUNDSTEPS} from './fundingConstant';
import {
  IFormulationResultCommunicateResponse,
  IFormulationResultCreateNewFundingTopicParsed,
  IFormulationResultImprovePhraseParsed,
  IFundingBulletPoint,
  IFundingImprovePhraseRequest,
  IFundingImproveWritingResultParsed,
  IFundingResultCreateTextsParsed,
  IFundingText,
} from './types';
import HeaderSection from './HeaderSection';
import TextAreaSection from './TextAreaSection';
import FormulationSection from './FormulationSection';
import apiHub from '@/hooks/useApiClient';
import {AxiosError} from 'axios';
import toast from 'react-hot-toast';
import ApplicationSectionRow from './ApplicationSectionRow';

type Props = {};

const Funding = (props: Props) => {
  const [formulationResults, setFormulationResults] = useState<IFundingText[]>();
  const [currentStep, setStep] = useState(FUNDSTEPS.CoreIdea);
  const [coreIdea, setCoreIdea] = useState('');
  const [addNewKeywordCategoryId, setAddNewKeywordCategoryId] = useState('');
  const [addKewordModal, setAddKewordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [improvePhraseLoading, setImprovePhraseLoading] = useState(false);

  const [bulletPoints, setBulletPoints] = useState<IFundingBulletPoint[] | undefined>();

  const handleAddNewKeyWord = (keyword: string) => {
    if (!bulletPoints) return;
    const result: IFundingBulletPoint[] = bulletPoints.flatMap((cat) =>
      clearWhitespaces(cat.title) === addNewKeywordCategoryId
        ? {
            ...cat,
            phrases: [...cat.phrases, keyword],
          }
        : cat,
    );

    setBulletPoints(result);
    setAddNewKeywordCategoryId('');
    setAddKewordModal(false);
  };

  const handleImproveWritingText = async (row: IFundingText) => {
    setIsLoading(true);
    const payload = {
      text: row.text,
      language: 'de',
    };
    try {
      const {status, data} = await apiHub.post<IFormulationResultCommunicateResponse>(
        'api/v1/ai-functions/direct-call',
        {
          name: 'improve_writing',
          parameters: payload,
        },
      );
      if (status === 201) {
        if (data.Error) {
          const parsedData: {error: string} = JSON.parse(data.Error.error);
          toast.error(parsedData.error);
        } else if (data.Mixed && data.Mixed.length > 0) {
          const {Text} = data.Mixed[0];
          if (!Text?.response) return;
          const parsedData: IFundingImproveWritingResultParsed = JSON.parse(Text.response);

          if (parsedData.status === 'ok') {
            console.log({parsedData, formulationResults, row});
            setFormulationResults((prevFR) =>
              prevFR?.flatMap((formulation) =>
                formulation.title.trim() === row.title.trim() ? {...formulation, text: parsedData.result} : formulation,
              ),
            );
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

  const handleCreateNewFundingTopic = async () => {
    setIsLoading(true);
    try {
      const {status, data} = await apiHub.post<IFormulationResultCommunicateResponse>(
        'api/v1/ai-functions/direct-call',
        {
          name: 'get_stichpunkte',
          parameters: {
            topic: coreIdea,
          },
        },
      );

      if (data.Error) {
        const parsedData: {error: string} = JSON.parse(data.Error.error);
        toast.error(parsedData.error);
      } else if (data.Mixed && data.Mixed.length > 0) {
        const {Text} = data.Mixed[0];
        if (!Text?.response) return;
        const parsedData: IFormulationResultCreateNewFundingTopicParsed = JSON.parse(Text.response);

        if (parsedData.status === 'ok') {
          setBulletPoints(parsedData.result);
          setStep(FUNDSTEPS.Application);
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
  const handleGenerateTexts = async () => {
    if (!bulletPoints) return;
    const payload = {
      topic: coreIdea,
      phrases: bulletPoints,
    };
    setIsLoading(true);
    try {
      const {status, data} = await apiHub.post<IFormulationResultCommunicateResponse>(
        'api/v1/ai-functions/direct-call',
        {
          name: 'texte_erstellen',
          parameters: payload,
        },
      );
      if (data.Error) {
        const parsedData: {error: string} = JSON.parse(data.Error.error);
        toast.error(parsedData.error);
      } else if (data.Mixed && data.Mixed.length > 0) {
        const {Text} = data.Mixed[0];
        if (!Text?.response) return;
        const parsedData: IFundingResultCreateTextsParsed = JSON.parse(Text.response);
        console.log({formulation: parsedData.result});
        setFormulationResults(parsedData.result);
        setStep(FUNDSTEPS.Formulation);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleFundingImprovePhrase = async (bulletPoint: IFundingBulletPoint) => {
    if (!bulletPoints) return;
    const payload: IFundingImprovePhraseRequest = {
      topic: coreIdea,
      phrases: bulletPoint.phrases,
      kategorie: bulletPoint.title,
      pdf_urls: [],
      max_website: 0,
    };
    setImprovePhraseLoading(true);
    try {
      const {status, data} = await apiHub.post<IFormulationResultCommunicateResponse>(
        'api/v1/ai-functions/direct-call',
        {
          name: 'phrase_verbessern',
          parameters: payload,
        },
      );
      if (data.Error) {
        const parsedData: {error: string} = JSON.parse(data.Error.error);
        toast.error(parsedData.error);
      } else if (data.Mixed && data.Mixed.length > 0) {
        const {Text} = data.Mixed[0];
        if (!Text?.response) return;
        const parsedData: IFormulationResultImprovePhraseParsed = JSON.parse(Text.response);
        console.log({parsedData, bulletPoints, bulletPoint});
        if (parsedData.status === 'ok') {
          setBulletPoints((prevBPs) =>
            prevBPs?.flatMap((bp) =>
              bp.title === bulletPoint.title ? {...bulletPoint, phrases: parsedData.result} : bp,
            ),
          );
        }

        toast.success('Phrase Improved');
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setImprovePhraseLoading(false);
    }
  };

  return (
    <>
      <div className='flex flex-col rounded-20 bg-content-white px-5 pb-5 pt-4 flex-1'>
        <h1
          className='text-xl leading-7 font-semibold text-content-black mb-4'
          onClick={() => console.log({bulletPoints})}
        >
          Application for funding
        </h1>
        <div className='flex flex-col'>
          <HeaderSection currentStep={currentStep} />

          {currentStep === FUNDSTEPS.CoreIdea && (
            <TextAreaSection setValue={setCoreIdea} value={coreIdea} className='flex-1' />
          )}
          {currentStep === FUNDSTEPS.Application && (
            <div className='flex flex-col gap-5'>
              <div className='custom-scrollbar-thumb h-[402px] flex flex-col gap-4'>
                {bulletPoints &&
                  bulletPoints.map((bulletPoint, elemIndex) => (
                    <ApplicationSectionRow
                      key={clearWhitespaces(bulletPoint.title)}
                      bulletPoints={bulletPoints}
                      bulletPoint={bulletPoint}
                      setBulletPoints={setBulletPoints}
                      setAddKewordModal={setAddKewordModal}
                      setAddNewKeywordCategoryId={setAddNewKeywordCategoryId}
                      setStep={setStep}
                      handleFundingImprovePhrase={handleFundingImprovePhrase}
                      rowNumber={elemIndex + 1}
                      improvePhraseLoading={improvePhraseLoading}
                    />
                  ))}
              </div>
              <div className='flex gap-2.5'>
                <Button
                  title='Back to core-idea'
                  variant='outline'
                  onClick={() => setStep((currentStep) => currentStep - 1)}
                  className='rounded-[40px] w-[220px] !h-9'
                />
                <Button
                  title={isLoading ? '' : 'Confirm keywords'}
                  variant='primary'
                  loading={isLoading}
                  disabled={isLoading}
                  onClick={handleGenerateTexts}
                  className='rounded-[40px] w-[220px] !h-9'
                />
              </div>
            </div>
          )}

          {currentStep === FUNDSTEPS.Formulation && (
            <FormulationSection
              formulationResults={formulationResults}
              setStep={setStep}
              isLoading={isLoading}
              handleImproveWritingText={handleImproveWritingText}
            />
          )}

          {currentStep === FUNDSTEPS.CoreIdea && (
            <Button
              title={!isLoading ? 'Continue' : ''}
              disabled={isLoading || coreIdea.length < 5}
              loading={isLoading}
              onClick={handleCreateNewFundingTopic}
              className='rounded-[40px] w-[220px] !h-9'
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
