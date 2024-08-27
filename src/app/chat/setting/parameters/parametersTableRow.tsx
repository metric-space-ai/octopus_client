import React from 'react';

import {PencilSquareIcon, TrashIcon} from '@heroicons/react/24/outline';

import {IParameter} from '@/types';

type Props = {
  parameter: IParameter;
  onDeleteParameter: (parameter: IParameter) => void;
  onEditParameter: (parameter: IParameter) => void;
};

export const ParameterTableRow = ({parameter, onDeleteParameter, onEditParameter}: Props) => {
  return (
    <div className='h-[51px] flex border-b-grey-100 border-b items-center py-[15px]'>
      <h6 className={`w-48 truncate ... font-normal text-xs leading-5 text-grey-900 block mr-4`} title={parameter.name}>
        {parameter.name}
      </h6>

      <div className='flex justify-start items-center flex-1'>
        <span
          className={`w-36 truncate ... block items-center text-xs leading-5 text-grey-900`}
          title={parameter.value}
        >
          {/* {parameter.value ? 'Active' : 'Deactive'} */}
          {parameter.value}
        </span>
        <div className='ml-auto flex gap-4'>
          <PencilSquareIcon
            width={16}
            height={16}
            onClick={() => onEditParameter(parameter)}
            className='text-grey-900 cursor-pointer'
          />
          <TrashIcon
            width={16}
            height={16}
            className='text-grey-900 cursor-pointer'
            onClick={() => onDeleteParameter(parameter)}
          />
        </div>
      </div>
    </div>
  );
};
