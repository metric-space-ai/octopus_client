import React from 'react';

import {Tab} from '@headlessui/react';
import classNames from 'classnames';

import CompanySettings from './company-settings';
import ThemeSettings from '../theme-settings';

const companies = () => {
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
            Theme
          </Tab>
          <Tab
            className={({selected}) =>
              classNames(
                'w-[196px] rounded-t-xl py-2.5 h-10 text-sm font-semibold leading-5 text-grey-900 focus:outline-none',
                selected ? 'bg-grey-0' : 'hover:bg-grey-150/50 bg-grey-150',
              )
            }
          >
            settings
          </Tab>
        </Tab.List>
        <Tab.Panels className='max-h-[640px] custom-scrollbar-thumb flex flex-col w-full py-[18px] px-6 rounded-r-xl rounded-bl-xl bg-grey-0'>
          <Tab.Panel className={classNames('rounded-md bg-grey-0 relative -mx-4', 'focus:outline-none')}>
            <ThemeSettings />
          </Tab.Panel>
          <Tab.Panel className={classNames('rounded-md bg-grey-0 relative -mx-4', 'focus:outline-none')}>
            <CompanySettings />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default companies;
