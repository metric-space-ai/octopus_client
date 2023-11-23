import {ArrowsUpDownIcon} from '@heroicons/react/20/solid';
import React, { useEffect} from 'react';

import {useSettingsContext} from '@/contexts/settingsContext';
import {TeamMemberTableRow} from './teamMemberTableRow';

type Props = {};

const TeamMebersTable = (props: Props) => {
  
  const {getTeamMembers, teamMembers, settingIsLoading} = useSettingsContext();

  useEffect(() => {
    getTeamMembers();
  }, []);

  return (
    <table className='table-auto w-[608px] max-w-full'>
      <thead>
        <tr className='h-7'>
          <th className='text-content-grey-600 text-xs font-normal text-left'>Name</th>
          <th className='text-content-grey-600 text-xs font-normal px-3 text-center'>
            <div
              className='flex items-center justify-center cursor-pointer hover:text-content-grey-900'
              onClick={() => console.log('sort it dude :)')}
            >
              Date added
              <ArrowsUpDownIcon width={9} height={9} className='text-content-grey-600 ml-1.5' />
            </div>
          </th>
          <th className='text-content-grey-600 text-xs font-normal text-left'>User role</th>
        </tr>
      </thead>
      <tbody>
        {settingIsLoading ? (
          <>
            <tr className='px-[2.5px] py-3 h-68-px border-b-content-grey-100 border-b'>
              <div className='flex justify-start py-3 items-center animate-pulse'>
                <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-96'></div>
              </div>
            </tr>
            <tr className='px-[2.5px] py-3 h-68-px border-b-content-grey-100 border-b'>
              <div className='flex justify-start py-3 items-center animate-pulse'>
                <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-96'></div>
              </div>
            </tr>
          </>
        ) : !teamMembers || teamMembers.length === 0 ? (
          !settingIsLoading && (
            <tr className='px-[2.5px] py-3 h-68-px border-b-content-grey-100 border-b'>
              <h2 className='text-lg text-content-accent uppercase'>not found</h2>
            </tr>
          )
        ) : (
          teamMembers.map((user) => <TeamMemberTableRow user={user} />)
        )}
      </tbody>
    </table>
  );
};

export default TeamMebersTable;
