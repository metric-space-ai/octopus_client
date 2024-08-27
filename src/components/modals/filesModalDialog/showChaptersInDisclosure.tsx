import React, {Fragment} from 'react';

import classNames from 'classnames';
import dynamic from 'next/dynamic';

type Props = {
  chapters: string[];
};
const DynamicMarkdownContent = dynamic(async () => (await import('../../markdown')).MarkdownContent, {
  loading: () => <div className='flex items-center justify-center p-7 h-32 bg-grey-150 animate-pulse' />,
});

const ShowChaptersInDisclosure = ({chapters}: Props) => {
  return (
    <div className='flex flex-col gap-2.5 max-h-[640px] custom-scrollbar-thumb'>
      {chapters?.map((chapter, index) => (
        <Fragment key={`chapter-${index}`}>
          <h3 className='text-grey-800 dark:text-grey-50 font-semibold pl-3'>
            <b>{`Chapter #${index + 1}`}</b>
          </h3>
          <div
            className={classNames(
              'min-h-[240px] max-h-[360px] p-1 flex flex-1 max-w-full text-left flex-col custom-scrollbar-thumb mb-0.5',
              '[&_pre]:flex-1',
            )}
            style={{direction: 'rtl'}}
          >
            <span className='flex flex-col gap-2' style={{direction: 'ltr'}}>
              <DynamicMarkdownContent content={chapter ?? ''} />
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default ShowChaptersInDisclosure;
