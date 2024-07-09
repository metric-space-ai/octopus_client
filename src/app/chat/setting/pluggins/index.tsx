import {Tab} from '@headlessui/react';
import classNames from 'classnames';
import React from 'react';
import AiServices from '../ai-services';
import SimpleApps from '../simpleApps';
import WaspApps from '../waspApps';

type Props = {};

const plugin = (props: Props) => {
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
            <AiServices />
          </Tab.Panel>
          <Tab.Panel className={classNames('rounded-md bg-grey-0 relative -mx-4', 'focus:outline-none')}>
            <SimpleApps />
          </Tab.Panel>
          <Tab.Panel className={classNames('rounded-md bg-grey-0 relative -mx-4', 'focus:outline-none')}>
            <WaspApps />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default plugin;
