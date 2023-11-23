import {Button} from '@/components/buttons';
import React, {useState} from 'react';
import TeamMebersTable from './teamMemberTable';
import {AddNewMemberModal} from '@/components/modals/AddNewMemberModal';

type Props = {};

const TeamMembers = (props: Props) => {
  const [addNewUserModal, setAddNewUserModal] = useState(false);

  return (
    <>
      <div className='w-full pt-[84px] flex flex-col items-center '>
        <div className='flex flex-col w-full max-w-[608px] px-6 py-4 rounded-20 bg-white'>
          <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
            <h1 className='text-lg leading-7 text-content-black font-semibold'>team members</h1>
            <Button
              className='!px-6 font-poppins-semibold text-sm !h-34-px'
              variant='primary'
              title='Add member'
              onClick={() => setAddNewUserModal(true)}
            />
          </div>
          <div className='max-w-full'>
            <TeamMebersTable />
          </div>
        </div>
      </div>
      <AddNewMemberModal open={addNewUserModal} onClose={() => setAddNewUserModal(false)} />
    </>
  );
};

export default TeamMembers;
