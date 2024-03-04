import React from 'react';
import {RESEARCHSTEPS} from './researchConstant';

type Props = {researchSteps: number};

const HeaderSection = ({researchSteps}: Props) => {
  return (
    <>
      {researchSteps === RESEARCHSTEPS.startTopic && (
        <>
          <h2 className='font-semibold text-sm leading-5 mb-1 text-content-accent-hover'>Research Topic:</h2>
          <p className='text-xs leading-5 text-content-black mb-3'>Provide details about your Reasearch.</p>
        </>
      )}
      {researchSteps === RESEARCHSTEPS.Specification && (
        <>
          <h2 className='font-semibold text-sm leading-5 mb-1 text-content-accent-hover'>Proposed specification</h2>
          <p className='text-xs leading-5 text-content-black mb-4'>Check and edit proposed specification of the AI</p>
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
    </>
  );
};

export default HeaderSection;
