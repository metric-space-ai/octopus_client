import {Button} from '@/components/buttons';
import React, {useState} from 'react';
import TeamMebersTable from './teamMemberTable';
import {AddNewMemberModal} from '@/components/modals/AddNewMemberModal';

type Props = {};

const DESCRIPTIONS = [
  {
    key: 'description-1',
    title: 'Admin user',
    content: 'User Management and Tab Control. Access to a confidential workspace.',
  },
  {key: 'description-2', title: 'Private user', content: 'Access to public space and confidential workspace.'},
  {key: 'description-3', title: 'Public user', content: 'Access to public space only. '},
];
const TeamMembers = (props: Props) => {
  const [addNewUserModal, setAddNewUserModal] = useState(false);

  return (
    <>
       <div className='w-full pt-[84px] flex md:gap-12 lg:gap-16 xl:gap-20 pl-6'>
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
        <div className='hidden lg:flex flex-col gap-6'>
          {DESCRIPTIONS.map((desc) => (
            <div key={desc.key} className='flex flex-col gap-1'>
              <h2 className='text-content-grey-900 font-poppins-semibold text-sm leading-5'>{desc.title}</h2>
              <p className='text-content-grey-600 text-xs leading-5 font-poppins-regular '>{desc.content}</p>
            </div>
          ))}
        </div>
      </div>
      <AddNewMemberModal open={addNewUserModal} onClose={() => setAddNewUserModal(false)} />
    </>
  );
};

export default TeamMembers;
