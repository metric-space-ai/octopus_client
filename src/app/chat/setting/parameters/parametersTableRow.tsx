import React from 'react';
import {IParameter} from '@/types';

import {PencilSquareIcon, TrashIcon} from '@heroicons/react/24/outline';

type Props = {
  parameter: IParameter;
  onDeleteParameter: (parameter: IParameter) => void;
  onEditParameter: (parameter: IParameter) => void;
};

export const ParameterTableRow = ({parameter, onDeleteParameter, onEditParameter}: Props) => {
  return (
    <div className='h-[51px] flex border-b-content-grey-100 border-b items-center py-[15px]'>
      <h6
        className={`w-48 truncate ... font-normal text-xs leading-5 text-content-black font-poppins-semibold block mr-4`}
      >
        {parameter.name}
      </h6>


      <div className='flex justify-start items-center flex-1'>
        <span
          className={`w-28 truncate ... block items-center text-xs leading-5 
            text-content-black`}
        >
          {/* {parameter.value ? 'Active' : 'Deactive'} */}
          {parameter.value}
        </span>
        <div className='ml-auto flex gap-4'>
          <PencilSquareIcon
            width={16}
            height={16}
            onClick={() => onEditParameter(parameter)}
            className='text-content-black cursor-pointer'
          />
          <TrashIcon
            width={16}
            height={16}
            className='text-content-black cursor-pointer'
            onClick={() => onDeleteParameter(parameter)}
          />
        </div>
      </div>
    </div>
  );
};
