/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';

import {selectParameters} from '@/app/lib/features/parameters/parametersSelector';
import {
  createNewParameter,
  deleteParameterById,
  getAllParameters,
  updateParameter,
} from '@/app/lib/features/parameters/parametersSlice';
import {AppDispatch} from '@/app/lib/store';
import {Button} from '@/components/buttons';
import {AddParameterModal} from '@/components/modals/AddParameterModal';
import {RemoveParameterModal} from '@/components/modals/RemoveParameterModal';
import {IParameter} from '@/types';

import TeamMebersTable from './parametersTable';

const Parameters = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {entities: parameters, isLoading} = useSelector(selectParameters);

  const [openNewParameterModal, setOpenNewParameterModal] = useState(false);
  const [openDeleteParameterDialog, setOpenDeleteParameterDialog] = useState(false);
  const [parametersIsLoading, setParametersIsLoading] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState<IParameter | undefined>(undefined);

  const handleOpenDeleteDialog = (parameter: IParameter) => {
    setSelectedParameter(parameter);
    setOpenDeleteParameterDialog(true);
  };
  const handleOpenEditDialog = (parameter: IParameter) => {
    setSelectedParameter(parameter);
    setOpenNewParameterModal(true);
  };
  const handleCloseRemoveParameterDialog = () => {
    setSelectedParameter(undefined);
    setOpenDeleteParameterDialog(false);
  };
  const handleCloseAddParameterDialog = () => {
    setSelectedParameter(undefined);
    setOpenNewParameterModal(false);
  };

  const handleAcceptDeleteMember = () => {
    if (selectedParameter) {
      dispatch(deleteParameterById(selectedParameter.id));
      // deleteTeamMember(selectedParameter.id);
      // const result = [...parameters].filter((parameters) => parameters.id !== selectedParameter.id);
      // setParameters(result);
      handleCloseRemoveParameterDialog();
    }
  };

  const addNewParameter = (parameter: IParameter) => {
    setParametersIsLoading(true);

    try {
      if (selectedParameter?.id) {
        const {name, value} = parameter;
        dispatch(updateParameter({parameter_id: selectedParameter.id, name, value}));
      } else {
        dispatch(createNewParameter(parameter));
      }
    } finally {
      handleCloseAddParameterDialog();
      setParametersIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getAllParameters());
  }, []);
  return (
    <>
      <div className='w-full pt-9 flex flex-col px-6 '>
        <div className='flex flex-col w-full max-w-[608px] px-6 py-4 rounded-xl bg-grey-0'>
          <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
            <h1 className='text-lg leading-7 text-grey-900 font-semibold' onClick={() => console.log({parameters})}>
              Parameter Section
            </h1>
            <Button
              className='!px-6 font-semibold text-sm !h-34-px'
              variant='primary'
              title='Add parameter'
              onClick={() => setOpenNewParameterModal(true)}
            />
          </div>
          <div className='max-w-full'>
            <TeamMebersTable
              parameters={parameters}
              parametersIsLoading={parametersIsLoading || isLoading}
              handleOpenEditDialog={handleOpenEditDialog}
              handleOpenDeleteDialog={handleOpenDeleteDialog}
            />
          </div>
        </div>
      </div>
      {selectedParameter && openDeleteParameterDialog && (
        <RemoveParameterModal
          onClose={handleCloseRemoveParameterDialog}
          open={openDeleteParameterDialog}
          onDelete={handleAcceptDeleteMember}
        />
      )}
      <AddParameterModal
        onClose={handleCloseAddParameterDialog}
        open={openNewParameterModal}
        parameter={selectedParameter}
        onSubmitParameter={addNewParameter}
      />
    </>
  );
};

export default Parameters;
