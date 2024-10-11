import React, {Fragment, useRef} from 'react';

import {Popover, Transition} from '@headlessui/react';
import {InformationCircleIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';

type Props = {
  title?: string;
  description: string;
};

const PopOverDescription = ({title, description}: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  //   const updatePopoverPosition = () => {
  //     if (buttonRef.current && popoverRef.current) {
  //       const buttonRect = buttonRef.current.getBoundingClientRect();
  //       const popoverWidth = popoverRef.current.offsetWidth;
  //       const popoverHeight = popoverRef.current.offsetHeight;
  //       console.log({
  //         buttonRect,
  //         popoverWidth,
  //         popoverHeight,
  //         top: buttonRect.bottom + window.scrollY + 8,
  //         left: buttonRect.left + window.scrollX + 8 - popoverWidth / 2 + buttonRect.width / 2,
  //       });
  //       const top = `${buttonRect.top + 8}px`;
  //       const left = `${buttonRect.left}px`;
  //       //   const top = `${buttonRect.bottom + window.scrollY + 8}px`;
  //       //   const left = `${buttonRect.left + window.scrollX + 8 - popoverWidth / 2 + buttonRect.width / 2}px`;

  //       return {top, left};
  //     }
  //     return {top: 0, left: 0};
  //   };

  return (
    <Popover className='relative'>
      {({open}) => (
        <>
          <Popover.Button
            ref={buttonRef}
            className={classNames(
              'focus-visible:ring-2 focus-visible:ring-grey-0/75',
              open ? 'text-grey-0' : 'text-grey-0/90',
            )}
          >
            <InformationCircleIcon className='w-4 h-4 text-grey-900 hover:text-primary cursor-pointer' />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-200'
            enterFrom='opacity-0 translate-y-1'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 translate-y-1'
          >
            <Popover.Panel
              ref={popoverRef}
              static={false}
              //   style={{top: updatePopoverPosition().top, left: updatePopoverPosition().left}}
              className={classNames(
                // updatePopoverPosition().top === 0 && updatePopoverPosition().left === 0 && 'opacity-0 hidden',
                'fixed shadow-operation-selection pl-5 pr-6 py-4 flex flex-col gap-2 bg-grey-0 z-20 w-[540px] rounded-xl max-h-44 cursor-default',
              )}
              style={{bottom: '0px', right: '0px'}}
            >
              {title && <h5 className='text-base mb-2'>{title}</h5>}
              <p className='text-grey-900 text-sm font-normal relative -mr-1.5 custom-scrollbar-thumb max-h-full'>
                {description}
              </p>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default PopOverDescription;
