/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {ArrowsUpDownIcon} from '@heroicons/react/20/solid';
import {useDispatch, useSelector} from 'react-redux';

import {getAllTeamMembers} from '@/app/lib/features/teamMembers/teamMemberSlice';
import {selectTeamMembers} from '@/app/lib/features/teamMembers/teamMembersSelector';
import {AppDispatch} from '@/app/lib/store';
import {RemoveTeamMemberModal} from '@/components/modals/RemoveTeamMemberModal';
import {ResetTeamMemberPasswordModal} from '@/components/modals/ResetTeamMemberPasswordModal';
import {IUser} from '@/types';

import {TeamMemberTableRow} from './teamMemberTableRow';

const TeamMebersTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {entities, isLoading} = useSelector(selectTeamMembers);
  const [openDeleteUserDialog, setDeleteUserDialog] = useState(false);
  const [openResetMemberPassDialog, setOpenResetMemberPassDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleOpenResetMemberPasswordDialog = (member: IUser) => {
    console.log({member});
    setSelectedUser(member);
    setOpenResetMemberPassDialog(true);
  };

  const handleOpenDeleteDialog = (member: IUser) => {
    setSelectedUser(member);
    setDeleteUserDialog(true);
  };

  const handleCloseResetMemberPasswordDialog = () => {
    setSelectedUser(null);
    setDeleteUserDialog(false);
    setOpenResetMemberPassDialog(false);
  };
  const handleCloseRemoveMemberDialog = () => {
    setSelectedUser(null);
    setDeleteUserDialog(false);
  };

  useEffect(() => {
    dispatch(getAllTeamMembers());
  }, []);

  return (
    <>
      <div className='table-auto w-[638px] max-w-full'>
        <div className='h-8 flex items-centers'>
          <span className='w-[224px] text-grey-600 text-xs font-normal text-left self-center'>Name</span>

          <div
            className='w-[133px] text-grey-600 text-xs font-normal px-3 flex items-center cursor-pointer hover:text-grey-800'
            onClick={() => console.log('sort it dude :)')}
          >
            Date added
            <ArrowsUpDownIcon width={9} height={9} className='text-grey-600 ml-1.5' />
          </div>
          <span className='w-[122px] text-grey-600 text-xs font-normal text-left self-center'>User role</span>
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
              <div className='px-[2.5px] py-3 h-68-px border-b-grey-100 border-b'>
                <p className='text-lg text-primary uppercase'>not found</p>
              </div>
            )
          ) : (
            entities.map((user) => (
              <TeamMemberTableRow
                key={user.id}
                deleteUser={handleOpenDeleteDialog}
                user={user}
                resetUserPassword={handleOpenResetMemberPasswordDialog}
              />
            ))
          )}
        </div>
      </div>

      <ResetTeamMemberPasswordModal
        onClose={handleCloseResetMemberPasswordDialog}
        open={openResetMemberPassDialog}
        member={selectedUser}
      />

      {selectedUser && openDeleteUserDialog && (
        <RemoveTeamMemberModal
          onClose={handleCloseRemoveMemberDialog}
          open={openDeleteUserDialog}
          member={selectedUser}
        />
      )}
    </>
  );
};

export default TeamMebersTable;
