import React, {useEffect, useState} from 'react';
import {ArrowsUpDownIcon} from '@heroicons/react/20/solid';

import {TeamMemberTableRow} from './teamMemberTableRow';
import {RemoveTeamMemberModal} from '@/components/modals/RemoveTeamMemberModal';
import {IUser} from '@/types';
import {useDispatch, useSelector} from 'react-redux';
import {deleteTeamMember, getAllTeamMembers} from '@/app/lib/features/teamMembers/teamMemberSlice';
import {selectTeamMembers} from '@/app/lib/features/teamMembers/teamMembersSelector';
import {getAllPlugins} from '@/app/lib/features/aiServices/aiServicesSlice';
import { selectAiServicess } from '@/app/lib/features/aiServices/aiServicesSelector';
import { AppDispatch } from '@/app/lib/store';

type Props = {};

const TeamMebersTable = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const {entities, isLoading} = useSelector(selectTeamMembers);
  const {entities:plugins, isLoading: pluginsIsLoading} = useSelector(selectAiServicess);
  const [openDeleteUserDialog, setDeleteUserDialog] = useState(false);
  const [selectedUserForRemove, setSelectedUserForRemove] = useState<IUser | null>(null);

  // const {getTeamMembers, teamMembers, deleteTeamMember} = useSettingsContext();

  const handleOpenDeleteDialog = (member: IUser) => {
    setSelectedUserForRemove(member);
    setDeleteUserDialog(true);
  };
  const handleCloseRemoveMemberDialog = () => {
    setSelectedUserForRemove(null);
    setDeleteUserDialog(false);
  };

  const handleAcceptDeleteMember = () => {
    if (selectedUserForRemove) {
      // deleteTeamMember(selectedUserForRemove.id);
      dispatch(deleteTeamMember(selectedUserForRemove.id));
      handleCloseRemoveMemberDialog();
    }
  };

  // useEffect(() => {
  //   getTeamMembers();
  // }, []);

  useEffect(() => {
    dispatch(getAllTeamMembers());
    dispatch(getAllPlugins());
  }, []);

  return (
    <>
      <div className='table-auto w-[638px] max-w-full'>
    
        <div className='h-8 flex items-centers'>
          <span className='w-[224px] text-content-grey-600 text-xs font-normal text-left self-center'>Name</span>

          <div
            className='w-[133px] text-content-grey-600 text-xs font-normal px-3 flex items-center cursor-pointer hover:text-content-grey-900'
            onClick={() => console.log('sort it dude :)')}
          >
            Date added
            <ArrowsUpDownIcon width={9} height={9} className='text-content-grey-600 ml-1.5' />
          </div>
          <span className='w-[122px] text-content-grey-600 text-xs font-normal text-left self-center'>User role</span>
          <span className='w-[122px] text-content-grey-600 text-xs font-normal text-left self-center'>AI access</span>
        </div>
        <div className='flex flex-col'>
          {isLoading ? (
            <>
              <div className='flex justify-start items-center animate-pulse w-full pr-3 h-[59px]'>
                <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-full'></div>
              </div>
              <div className='flex justify-start items-center animate-pulse w-full pr-3 h-[59px]'>
                <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-full'></div>
              </div>
            </>
          ) : !entities || entities.length === 0 ? (
            !isLoading && (
              <div className='px-[2.5px] py-3 h-68-px border-b-content-grey-100 border-b'>
                <p className='text-lg text-content-accent uppercase'>not found</p>
              </div>
            )
          ) : (
            entities.map((user) => <TeamMemberTableRow key={user.id} deleteUser={handleOpenDeleteDialog} user={user} plugins={plugins} pluginsIsLoading={pluginsIsLoading}/>)
          )}
        </div>
      </div>
      {selectedUserForRemove && openDeleteUserDialog && (
        <RemoveTeamMemberModal
          onClose={handleCloseRemoveMemberDialog}
          open={openDeleteUserDialog}
          member={selectedUserForRemove}
          onDelete={handleAcceptDeleteMember}
        />
      )}
    </>
  );
};

export default TeamMebersTable;
