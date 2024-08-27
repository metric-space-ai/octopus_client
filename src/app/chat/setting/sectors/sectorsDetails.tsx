import {Disclosure} from '@headlessui/react';
import {
  BuildingOfficeIcon,
  LockClosedIcon,
  PencilSquareIcon,
  TrashIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

import {WORKSPACETYPE} from '@/constant';
import {IWorkspace} from '@/types';

type Props = {
  isLoading: boolean;
  workspaces: IWorkspace[];
  onEditWorkspace: (workspace: IWorkspace) => void;
  onDeleteWorkspace: (workspace: IWorkspace) => void;
};

export default function SectorsData({isLoading, workspaces, onEditWorkspace, onDeleteWorkspace}: Props) {
  return (
    <div className='mx-auto w-full max-w-[560px] rounded-lg bg-grey-0'>
      <div className='flex mb-2'>
        <div className='w-60'>
          <span className='font-medium text-xs leading-5 text-grey-600'>Name</span>
        </div>
        <div className=''>
          <span className='font-medium text-xs leading-5 text-grey-600'>Device ID</span>
        </div>
      </div>
      {(!workspaces || workspaces.length === 0) && !isLoading && (
        <div className='flex justify-center py-3 items-center border-t'>
          <h2 className='text-lg text-primary uppercase'>not found</h2>
        </div>
      )}
      {!isLoading && workspaces.length > 0 && (
        <div className='flex flex-col custom-scrollbar-thumb pr-2 max-h-[420px]'>
          {workspaces.map((workspace) => (
            <Disclosure key={workspace.id}>
              {() => (
                <>
                  <div className='flex justify-start py-3 items-center'>
                    <div className='flex gap-3 w-60 items-center'>
                      {/* <Disclosure.Button className='flex items-center'>
                          <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`} />
                        </Disclosure.Button> */}
                      <div className='flex items-center '>
                        <span className='bg-secondary-700/15 h-7 w-7 flex justify-center items-center rounded-full'>
                          {workspace.type === WORKSPACETYPE.PUBLIC ? (
                            <UserGroupIcon className='w-4 h-4 text-primary-400' />
                          ) : (
                            <LockClosedIcon className='w-4 h-4 text-secondary-600' />
                          )}
                          {/* <BuildingOfficeIcon className=' text-secondary-700' width={12} height={12} /> */}
                        </span>
                        <p
                          className='text-xs h-5 w-44 leading-5 text-grey-900 font-normal ml-3 truncate overflow-hidden ...'
                          title={workspace.name}
                        >
                          {workspace.name}
                        </p>
                      </div>
                    </div>
                    <p
                      className='text-xs w-56 max-w-full h-5 leading-5 text-grey-800 font-normal truncate overflow-hidden ...'
                      title={`ID: ${workspace.id}`}
                    >{`ID: ${workspace.id}`}</p>
                    <div className='ml-auto flex gap-4'>
                      <PencilSquareIcon
                        width={16}
                        height={16}
                        onClick={() => onEditWorkspace(workspace)}
                        className='text-grey-900 cursor-pointer'
                      />
                      <TrashIcon
                        width={16}
                        height={16}
                        className='text-grey-900 cursor-pointer'
                        onClick={() => onDeleteWorkspace(workspace)}
                      />
                    </div>
                  </div>
                  <Disclosure.Panel className='pl-5 flex justify-between items-center mt-2 py-3'>
                    <div className='flex items-center'>
                      <span className='bg-primary-400/10 h-7 w-7 flex justify-center items-center rounded-full'>
                        <BuildingOfficeIcon className=' text-primary-medium' width={12} height={12} />
                      </span>
                      <p className='text-xs leading-5 text-grey-900 font-normal ml-3'>First Sector</p>
                    </div>
                    <p className='text-xs leading-5 text-grey-600 font-normal'>Public tab</p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      )}
      {isLoading && (
        <Disclosure>
          {() => (
            <>
              <div className='flex justify-start py-3 items-center animate-pulse'>
                <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-96'></div>
              </div>
            </>
          )}
        </Disclosure>
      )}
    </div>
  );
}
