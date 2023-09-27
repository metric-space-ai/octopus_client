import {ArrowsUpDownIcon} from '@heroicons/react/20/solid';
import React from 'react';

import userImageSample from './../../../../../public/images/user-sample.png';
import {TrashIcon} from '@heroicons/react/24/outline';
import Dropdown from '@/components/dropdown';

type Props = {};

const TeamMebersTable = (props: Props) => {
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
        <tr className='px-[2.5px] py-3 h-68-px border-b-content-grey-100 border-b'>
          <td>
            <div className='flex gap-4'>
              <img src={userImageSample.src} className='rounded-full w-11 h-11' />
              <div className='flex flex-col gap-0.5'>
                <h6 className='font-semibold text-xs leading-5'>Jenny Wilson</h6>
                <p className='font-normal text-xs leading-5'>jenny.wilson@gmail.com</p>
              </div>
            </div>
          </td>
          <td>
            <span className='w-full h-full flex items-center justify-center text-xs leading-5'>15 Jul, 2023</span>
          </td>
          <td>
            <div className='flex justify-start items-center'>
              <Dropdown />
              <span className='ml-9 cursor-pointer'>
                <TrashIcon
                  width={16}
                  height={16}
                  className='text-content-grey-600 hover:text-content-grey-900'
                  onClick={() => console.log('remove it')}
                />
              </span>
            </div>
          </td>
        </tr>
        <tr className='px-[2.5px] py-3 h-68-px border-b-content-grey-100 border-b-2'>
          <td>
            <div className='flex gap-4'>
              <img src={userImageSample.src} className='rounded-full w-11 h-11' />
              <div className='flex flex-col gap-0.5'>
                <h6 className='font-semibold text-xs leading-5'>Cody Fisher</h6>
                <p className='font-normal text-xs leading-5'>cody.fisher@gmail.com</p>
              </div>
            </div>
          </td>
          <td>
            <span className='w-full h-full flex items-center justify-center text-xs leading-5'>23 Jul, 2023</span>
          </td>
          <td>
            <div className='flex justify-start items-center'>
              <Dropdown />
              <span className='ml-9 cursor-pointer'>
                <TrashIcon
                  width={16}
                  height={16}
                  className='text-content-grey-600 hover:text-content-grey-900'
                  onClick={() => console.log('remove it')}
                />
              </span>
            </div>
          </td>
        </tr>
        <tr className='px-[2.5px] py-3 h-68-px border-b-content-grey-100 border-b-2'>
          <td>
            <div className='flex gap-4'>
              <img src={userImageSample.src} className='rounded-full w-11 h-11' />
              <div className='flex flex-col gap-0.5'>
                <h6 className='font-semibold text-xs leading-5'>Jenny Wilson</h6>
                <p className='font-normal text-xs leading-5'>jenny.wilson@gmail.com</p>
              </div>
            </div>
          </td>
          <td>
            <span className='w-full h-full flex items-center justify-center text-xs leading-5'>15 Jul, 2023</span>
          </td>
          <td>
            <div className='flex justify-start items-center'>
              <Dropdown />
              <span className='ml-9 cursor-pointer'>
                <TrashIcon
                  width={16}
                  height={16}
                  className='text-content-grey-600 hover:text-content-grey-900'
                  onClick={() => console.log('remove it')}
                />
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TeamMebersTable;
