import React, {Fragment} from 'react';
import {Menu, Transition} from '@headlessui/react';

import {IWorkspace} from '@/types';
import {MoreTabProps} from './moreTab';

interface MoreTabsProps {
  tabs: IWorkspace[];
  itemsFrom: number;
  children: React.ReactNode;
  className?: string;
  selectedId: string;
  size?: 'large' | 'medium' | 'small';
  onChange: (index: string) => void;
}

export const MoreTabs = ({tabs, itemsFrom, className, selectedId, children, onChange, ...props}: MoreTabsProps) => {
  return (
    <Menu as='div' className='z-10 relative'>
      {({open}) => (
        <>
          <Menu.Button
            className={`w-[220px] relative h-10 flex items-center justify-start pl-4 pr-3 rounded-t-xl text-sm font-semibold ${
              open ? 'text-grey-100 bg-grey-0 dark:text-grey-900' : 'bg-grey-50 dark:bg-grey-800 dark:text-grey-50 text-grey-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className={`bg-red rounded-full mr-2
              text-primary-medium text-xxs leading-2.5 font-bold w-7 h-7 flex justify-center items-center
              ${open ? 'bg-primary-400/10' : 'bg-grey-0'} 
              `}
            >{`+${tabs.length - itemsFrom}`}</span>
            Tabs
          </Menu.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items
              className='absolute w-[257px] -left-1.5 origin-top-right divide-y divide-gray-100 rounded-xs bg-grey-50 shadow-lg border focus:outline-none'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='px-2 pt-2 pb-1'>
                {React.Children.toArray(children)
                  .filter((child) => React.isValidElement(child))
                  .map((child) => {
                    if (!React.isValidElement<MoreTabProps>(child)) {
                      return child;
                    }
                    return React.cloneElement(child, {
                      isFocused: selectedId === child.props.tabId,
                      onClick: () => {
                        onChange(child.props.tabId);
                      },
                    });
                  })}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
