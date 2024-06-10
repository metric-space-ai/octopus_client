import React, {useState} from 'react';

import {RadioGroup} from '@headlessui/react';

import classNames from 'classnames';

type Props = {
  active?: boolean | undefined;
  title?: string;
  description?: string;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
};

const CustomRadiobox = ({active, onChange, title, description, disabled = false}: Props) => {
  let [plan, setPlan] = useState('startup');
  return (
    <RadioGroup value={plan} onChange={setPlan} className={'flex flex-col text-left'}>
      <RadioGroup.Label className='text-left font-semibold text-xs uppercase text-grey-800 mb-3'>
        Document accessibility
      </RadioGroup.Label>
      <RadioGroup.Option value='startup'>
        {({checked}) => (
          <div className='flex gap-2 mb-2 items-center text-xs text-grey-900'>
            <span
              className={classNames(
                `w-4 h-4 border border-grey-900 rounded-full relative transition-all  
                  before:w-3 before:h-3 before:block before:absolute before:left-[1px] before:top-[1px] before:rounded-full`,
                {
                  'before:opacity-100 before:bg-primary': checked,
                  'before:opacity-0 before:bg-transparent': !checked,
                },
              )}
            ></span>
            <span className={` ${checked ? '' : ''}`}>Only me</span>
          </div>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value='business'>
        {({checked}) => (
          <div className='flex gap-2 mb-2 items-center text-xs text-grey-900'>
            <span
              className={classNames(
                `w-4 h-4 border border-grey-900 rounded-full relative transition-all  
                  before:w-3 before:h-3 before:block before:absolute before:left-[1px] before:top-[1px] before:rounded-full`,
                {
                  'before:opacity-100 before:bg-primary': checked,
                  'before:opacity-0 before:bg-transparent': !checked,
                },
              )}
            ></span>
            <span className={` ${checked ? '' : ''}`}>Everyone</span>
          </div>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  );
};

export default CustomRadiobox;
