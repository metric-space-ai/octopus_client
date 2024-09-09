import React from 'react';

import {Tab} from '@headlessui/react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

import {Spinner} from '@/components/spinner';

const DynamicAiServices = dynamic(async () => (await import('../ai-services')).default, {
  ssr: false,
  loading: () => <ComponentLoading />,
});
const DynamicSimpleApps = dynamic(async () => (await import('../simpleApps')).default, {
  ssr: false,
  loading: () => <ComponentLoading />,
});
const DynamicWaspApps = dynamic(async () => (await import('../waspApps')).default, {
  ssr: false,
  loading: () => <ComponentLoading />,
});

const ComponentLoading = () => (
  <div className='w-full flex items-center justify-center py-10 h-56'>
    <Spinner size='medium' />
  </div>
);

const Plugin = () => {
  return (
    <div className='flex flex-col pt-9 px-6 w-full max-w-[780px]'>
      <Tab.Group>
        <Tab.List className='flex rounded-t-md'>
          <Tab
            className={({selected}) =>
              classNames(
                'w-[196px] rounded-t-xl py-2.5 h-10 text-sm font-semibold leading-5 text-grey-900 focus:outline-none',
                selected ? 'bg-grey-0' : 'hover:bg-grey-150/50 bg-grey-150',
              )
            }
          >
            AI Services
          </Tab>
          <Tab
            className={({selected}) =>
              classNames(
                'w-[196px] rounded-t-xl py-2.5 h-10 text-sm font-semibold leading-5 text-grey-900 focus:outline-none',
                selected ? 'bg-grey-0' : 'hover:bg-grey-150/50 bg-grey-150',
              )
            }
          >
            HTML
          </Tab>
          <Tab
            className={({selected}) =>
              classNames(
                'w-[196px] rounded-t-xl py-2.5 h-10 text-sm font-semibold leading-5 text-grey-900 focus:outline-none ',
                selected ? 'bg-grey-0' : 'hover:bg-grey-150/50 bg-grey-150',
              )
            }
          >
            WASP
          </Tab>
        </Tab.List>
        <Tab.Panels className='h-[420px] max-h-[420px] flex flex-col w-full py-[18px] px-6 rounded-r-xl rounded-bl-xl bg-grey-0'>
          <Tab.Panel className={classNames('rounded-md bg-grey-0 relative -mx-4', 'focus:outline-none')}>
            <DynamicAiServices />
          </Tab.Panel>
          <Tab.Panel className={classNames('rounded-md bg-grey-0 relative -mx-4', 'focus:outline-none')}>
            <DynamicSimpleApps />
          </Tab.Panel>
          <Tab.Panel className={classNames('rounded-md bg-grey-0 relative -mx-4', 'focus:outline-none')}>
            <DynamicWaspApps />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Plugin;
