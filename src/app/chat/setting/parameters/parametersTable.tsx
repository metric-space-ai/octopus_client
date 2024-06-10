import React, {useEffect, useState} from 'react';
import {ArrowsUpDownIcon} from '@heroicons/react/20/solid';

import {useSettingsContext} from '@/contexts/settingsContext';
import {ParameterTableRow} from './parametersTableRow';
import {RemoveParameterModal} from '@/components/modals/RemoveParameterModal';
import {IParameter} from '@/types';
import {AddParameterModal} from '@/components/modals/AddParameterModal';

type Props = {
  parameters: IParameter[] | null;
  parametersIsLoading: boolean;
  handleOpenEditDialog: (parameter: IParameter) => void;
  handleOpenDeleteDialog: (parameter: IParameter) => void;
};

const parametersTable = ({parameters, handleOpenDeleteDialog, handleOpenEditDialog, parametersIsLoading}: Props) => {
  // useEffect(() => {
  //   getTeamMembers();
  // }, []);

  return (
    <>
      <div className='table-auto flex flex-col w-[608px] max-w-full'>
        <div className='h-7 flex items-centers'>
          <span className='w-52 text-grey-600 text-xs font-normal text-left'>Name</span>

          <span className='w-28 text-grey-600 text-xs font-normal text-left'>Value</span>
        </div>
        <div className='flex flex-col max-h-[420px] custom-scrollbar-thumb relative -mr-4 pr-4'>
          {parametersIsLoading ? (
            <>
              <div className='flex justify-start items-center animate-pulse w-full pr-3 h-[59px]'>
                <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-full'></div>
              </div>
              <div className='flex justify-start items-center animate-pulse w-full pr-3 h-[59px]'>
                <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-full'></div>
              </div>
            </>
          ) : !parameters || parameters.length === 0 ? (
            !parametersIsLoading && (
              <div className='px-[2.5px] h-68-px border-b-grey-100 border-b'>
                <h2 className='text-lg text-primary uppercase w-full text-center'>not found</h2>
              </div>
            )
          ) : (
            parameters.map((parameter) => (
              <ParameterTableRow
                key={parameter.id}
                onEditParameter={handleOpenEditDialog}
                onDeleteParameter={handleOpenDeleteDialog}
                parameter={parameter}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default parametersTable;
