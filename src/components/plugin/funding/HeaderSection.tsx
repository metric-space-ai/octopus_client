import React from 'react';
import {FUNDSTEPS} from './fundingConstant';

type Props = {currentStep: number};

const HeaderSection = ({currentStep}: Props) => {
  return (
    <>
      {currentStep === FUNDSTEPS.CoreIdea && (
        <>
          <h2 className='font-semibold text-sm leading-5 mb-1 text-content-accent-hover'>Core-idea:</h2>
          <p className='text-xs leading-5 text-content-black mb-3'>Provide details about your idea.</p>
        </>
      )}
      {currentStep === FUNDSTEPS.Application && (
        <>
          <h2 className='font-semibold text-sm leading-5 mb-1 text-content-accent-hover'>
            Keywords generated based on your core-idea
          </h2>
          <p className='text-xs leading-5 text-content-black mb-3'>Check your keywords and edit them if necessary.</p>
        </>
      )}
      {currentStep === FUNDSTEPS.Formulation && (
        <>
          <h2 className='font-semibold text-sm leading-5 mb-4 text-content-accent-hover'>Formulation results</h2>
        </>
      )}
     
    </>
  );
};

export default HeaderSection;
