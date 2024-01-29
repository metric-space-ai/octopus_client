import {Tab} from '@headlessui/react';
import classNames from 'classnames';
import React from 'react';
import AiServices from '../ai-services';
import SimpleApps from '../simpleApps';
import WaspApps from '../waspApps';

type Props = {};

const plugin = (props: Props) => {
  return (
    <div className='flex flex-col mt-[76px] px-6 w-full max-w-[700px]'>
      <Tab.Group>
        <Tab.List className='flex rounded-t-xl'>
          <Tab
            className={({selected}) =>
              classNames(
                'w-[196px] rounded-t-20 py-2.5 h-10 text-sm font-semibold leading-5 text-content-black focus:outline-none',
                selected ? 'bg-white' : 'hover:bg-content-grey-tab/50 bg-content-grey-tab',
              )
            }
          >
            AI Services
          </Tab>
          <Tab
            className={({selected}) =>
              classNames(
                'w-[196px] rounded-t-20 py-2.5 h-10 text-sm font-semibold leading-5 text-content-black focus:outline-none',
                selected ? 'bg-white' : 'hover:bg-content-grey-tab/50 bg-content-grey-tab',
              )
            }
          >
            HTML
          </Tab>
          <Tab
            className={({selected}) =>
              classNames(
                'w-[196px] rounded-t-20 py-2.5 h-10 text-sm font-semibold leading-5 text-content-black focus:outline-none ',
                selected ? 'bg-white' : 'hover:bg-content-grey-tab/50 bg-content-grey-tab',
              )
            }
          >
            WASP
          </Tab>
        </Tab.List>
        <Tab.Panels className='h-[420px] max-h-[420px] flex flex-col w-full py-[18px] px-6 rounded-r-20 rounded-bl-20 bg-white'>
          <Tab.Panel className={classNames('rounded-xl bg-white relative -mx-4', 'focus:outline-none')}>
            <AiServices />
          </Tab.Panel>
          <Tab.Panel className={classNames('rounded-xl bg-white relative -mx-4', 'focus:outline-none')}>
            <SimpleApps />
          </Tab.Panel>
          <Tab.Panel className={classNames('rounded-xl bg-white relative -mx-4', 'focus:outline-none')}>
            <WaspApps />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default plugin;
