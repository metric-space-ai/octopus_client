import React, {useState} from 'react';

import {Button} from '@/components/buttons';
import {AddNewMemberModal} from '@/components/modals/AddNewMemberModal';

import TeamMebersTable from './teamMemberTable';

const DESCRIPTIONS = [
  {
    key: 'description-1',
    title: 'Admin user',
    content: 'User Management and Tab Control. Access to a confidential workspace.',
  },
  {key: 'description-2', title: 'Private user', content: 'Access to public space and confidential workspace.'},
  {key: 'description-3', title: 'Public user', content: 'Access to public space only. '},
];
const TeamMembers = () => {
  const [addNewUserModal, setAddNewUserModal] = useState(false);

  return (
    <>
      <div className='w-full pt-9 flex md:gap-4 lg:gap-6 px-6'>
        <div className='flex flex-col w-full max-w-[689px] px-6 py-4 rounded-xl bg-grey-0'>
          <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
            <h1 className='text-lg leading-7 text-grey-900 font-semibold'>team members</h1>
            <Button
              className='!px-6 font-semibold text-sm !h-34-px'
              variant='primary'
              title='Add member'
              onClick={() => setAddNewUserModal(true)}
            />
          </div>
          <div className='h-full max-h-[460px] overflow-auto relative -mx-4 px-4 custom-scrollbar-thumb'>
            <TeamMebersTable />
          </div>
        </div>
        <div className='hidden lg:flex flex-col gap-6 w-44 pr-1'>
          {DESCRIPTIONS.map((desc) => (
            <div key={desc.key} className='flex flex-col gap-1'>
              <h2 className='text-grey-800 font-semibold text-sm leading-5'>{desc.title}</h2>
              <p className='text-grey-600 text-xs leading-5 font-regular '>{desc.content}</p>
            </div>
          ))}
        </div>
      </div>
      <AddNewMemberModal open={addNewUserModal} onClose={() => setAddNewUserModal(false)} />
    </>
  );
};

export default TeamMembers;
