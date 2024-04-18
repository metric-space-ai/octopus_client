import React, {useEffect, useState} from 'react';
import {IFundingBulletPoint} from './types';
import {clearWhitespaces} from '@/helpers';
import {Button, IconButton} from '@/components/buttons';
import {PencilSquareIcon, PlusIcon, TrashIcon, XMarkIcon} from '@heroicons/react/24/outline';

type Props = {
  bulletPoints: IFundingBulletPoint[];
  bulletPoint: IFundingBulletPoint;
  setBulletPoints: (value: React.SetStateAction<IFundingBulletPoint[] | undefined>) => void;
  setAddKewordModal: (value: React.SetStateAction<boolean>) => void;
  setAddNewKeywordCategoryId: (value: React.SetStateAction<string>) => void;
  setStep: (value: React.SetStateAction<number>) => void;
  handleFundingImprovePhrase: (bulletPoint: IFundingBulletPoint) => Promise<void>;
  rowNumber: number;
  improvePhraseLoading: boolean;
};

const ApplicationSectionRow = ({
  bulletPoints,
  bulletPoint,
  setBulletPoints,
  setAddKewordModal,
  setAddNewKeywordCategoryId,
  setStep,
  handleFundingImprovePhrase,
  rowNumber,
  improvePhraseLoading,
}: Props) => {
  const [keywordTitleOnEditMode, setKeywordTitleOnEditMode] = useState({key: '', title: ''});
  const [editKeywordsTitle, setEditKeywordsTitle] = useState('');
  const [editKeywordsValue, setEditKeywordsValue] = useState('');
  const [openEditKeywordvalue, setOpenEditKeywordValue] = useState({phraseKey: '', parentKey: ''});
  const [isLoading, setIsLoading] = useState(false);

  const checkEnterKeyPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return true;
    }
    return false;
  };

  const addKeywordTitleToEditMode = (title: string) => {
    setKeywordTitleOnEditMode({key: clearWhitespaces(title), title});
    setEditKeywordsTitle(title);
  };
  const handleRemoveBulletPointPhrase = (title: string, index: number) => {
    const result = bulletPoints.flatMap((item) =>
      clearWhitespaces(item.title) === clearWhitespaces(title)
        ? {...item, phrases: item.phrases.filter((_, idx) => index !== idx)}
        : item,
    );
    setBulletPoints(result);
  };
  const clearKeywordTitleToEditMode = () => {
    setKeywordTitleOnEditMode({key: '', title: ''});
    setEditKeywordsTitle('');
  };

  const submitChangeKeywordsTitle = () => {
    if (!editKeywordsTitle || !bulletPoints) return;
    const result = bulletPoints.flatMap((item) =>
      clearWhitespaces(item.title) === keywordTitleOnEditMode.key ? {...item, title: editKeywordsTitle} : item,
    );
    console.log({result, bulletPoints});
    setBulletPoints(result);
    clearKeywordTitleToEditMode();
  };

  const handleOpenEditKeywordValue = (phrase: string, parentKey: string) => {
    setEditKeywordsValue(phrase);
    setOpenEditKeywordValue({phraseKey: clearWhitespaces(phrase), parentKey: clearWhitespaces(parentKey)});
  };

  const handleCloseEditKeywordValue = () => {
    setEditKeywordsValue('');
    setOpenEditKeywordValue({phraseKey: '', parentKey: ''});
  };

  const submitChangeKeywordsDirectKeywordValue = () => {
    if (!editKeywordsValue || !bulletPoints) return;
    const result = bulletPoints.flatMap((item) =>
      clearWhitespaces(item.title) === openEditKeywordvalue.parentKey
        ? {
            ...item,
            phrases: [
              ...item.phrases.flatMap((phrase) =>
                clearWhitespaces(phrase) === openEditKeywordvalue.phraseKey ? editKeywordsValue : phrase,
              ),
            ],
          }
        : item,
    );
    setBulletPoints(result);
    handleCloseEditKeywordValue();
  };

  const improvePhrase = (bulletPoint: IFundingBulletPoint) => {
    setIsLoading(true);
    handleFundingImprovePhrase(bulletPoint);
  };

  useEffect(() => {
    if (!improvePhraseLoading && isLoading) {
      setIsLoading(false);
    }
  }, [improvePhraseLoading]);

  return (
    <div className='flex flex-col gap-3 mb-4'>
      {keywordTitleOnEditMode.key === clearWhitespaces(bulletPoint.title) ? (
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
          <h3 className='font-semibold text-xs leading-5 text-content-black'>{`${rowNumber}. ${bulletPoint.title}`}</h3>
          <IconButton className='!p-0' onClick={() => addKeywordTitleToEditMode(bulletPoint.title)}>
            <PencilSquareIcon className='w-4 h-4 text-content-black' />
          </IconButton>
          {/* <IconButton className='!p-0' onClick={() => handleRemoveBulletPoint(bulletPoint.title)}>
            <TrashIcon className='w-4 h-4 text-content-black' />
          </IconButton> */}
        </div>
      )}
      <div className='flex flex-wrap gap-2 whitespace-pre-wrap'>
        {bulletPoint.phrases.map((phrase, index) =>
          clearWhitespaces(phrase) &&
          clearWhitespaces(phrase) === openEditKeywordvalue.phraseKey &&
          clearWhitespaces(bulletPoint.title) === openEditKeywordvalue.parentKey ? (
            <div className='flex items-center relative max-w-fit' key={clearWhitespaces(phrase)}>
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
          ) : clearWhitespaces(phrase).length > 0 ? (
            <div
              className='flex items-center px-2 py-1 gap-2 bg-content-grey-100 rounded-4'
              key={clearWhitespaces(phrase)}
            >
              <span className='text-xs leading-5 text-content-black'>{phrase}</span>
              <IconButton className='!p-0' onClick={() => handleOpenEditKeywordValue(phrase, bulletPoint.title)}>
                <PencilSquareIcon className='w-4 h-4 text-content-grey-600 hover:text-content-accent' />
              </IconButton>
              <IconButton className='!p-0' onClick={() => handleRemoveBulletPointPhrase(bulletPoint.title, index)}>
                <TrashIcon className='w-4 h-4 text-content-grey-600 hover:text-content-red-600' />
              </IconButton>
            </div>
          ) : (
            <span className='w-full' />
          ),
        )}

        <div
          className='flex items-center bg-content-grey-100 text-content-accent rounded-4 gap-2 py-1 px-2 
              cursor-pointer transition-all hover:text-content-accent-hover'
          onClick={() => {
            setAddNewKeywordCategoryId(clearWhitespaces(bulletPoint.title));
            setAddKewordModal(true);
          }}
        >
          <span className='text-xs '>Add keyword</span>
          <IconButton className='!p-0'>
            <PlusIcon className='w-4 h-4 text-content-accent' />
          </IconButton>
        </div>
      </div>
      <Button
        title={isLoading ? '' : 'Verbessern'}
        variant='outline'
        loading={isLoading}
        disabled={isLoading || bulletPoint.phrases.length === 0}
        onClick={() => improvePhrase(bulletPoint)}
        className='rounded-[40px] w-[220px] !h-8'
      />
    </div>
  );
};

export default ApplicationSectionRow;
