import React from 'react';
import {IFundingText} from './types';

import {Button} from '@/components/buttons';

import FormulationRow from './FormulationRow';
import {clearWhitespaces} from '@/helpers';

type Props = {
  formulationResults: IFundingText[] | undefined;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  handleImproveWritingText: (row: IFundingText) => Promise<void>;
};

const FormulationSection = ({formulationResults, setStep, handleImproveWritingText}: Props) => {
  // const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className='flex flex-col gap-5'>
      <div className='custom-scrollbar-thumb h-[402px] flex flex-col gap-8'>
        {formulationResults &&
          formulationResults.map((result, index) => (
            <FormulationRow
              key={clearWhitespaces(result.title)}
              result={result}
              handleImproveWritingText={handleImproveWritingText}
            />
          ))}
      </div>
      <Button
        title='Back to keywords list'
        variant='outline'
        onClick={() => setStep((currentStep) => currentStep - 1)}
        className='rounded-[40px] w-[220px] !h-9'
      />
    </div>
  );
};

export default FormulationSection;
