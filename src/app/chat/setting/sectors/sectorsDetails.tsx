import {Disclosure} from '@headlessui/react';

import {
  BuildingOfficeIcon,
  TrashIcon,
  PencilSquareIcon,
  UserGroupIcon,
  LockClosedIcon,
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
    <div className='w-full'>
      <div className='mx-auto w-full max-w-[560px] rounded-2xl bg-white'>
        <div className='flex mb-2'>
          <div className='w-60'>
            <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>Name</span>
          </div>
          <div className=''>
            <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>Device ID</span>
          </div>
        </div>
        {!workspaces || workspaces.length === 0
          ? !isLoading && (
              <div className='flex justify-center py-3 items-center border-t border-content-grey-100'>
                <h2 className='text-lg text-content-accent uppercase'>not found</h2>
              </div>
            )
          : workspaces.map((workspace, index) => (
              <Disclosure>
                {({open}) => (
                  <>
                    <div className='flex justify-start py-3 items-center'>
                      <div className='flex gap-3 w-60 items-center'>
                        {/* <Disclosure.Button className='flex items-center'>
                          <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`} />
                        </Disclosure.Button> */}
                        <div className='flex items-center '>
                          <span className='bg-content-blue-dark-11 h-7 w-7 flex justify-center items-center rounded-full'>
                            {workspace.type === WORKSPACETYPE.PUBLIC ? (
                              <UserGroupIcon className='w-4 h-4 text-content-accent-400' />
                            ) : (
                              <LockClosedIcon className='w-4 h-4 text-content-blue-light' />
                            )}
                            {/* <BuildingOfficeIcon className=' text-content-blue-dark' width={12} height={12} /> */}
                          </span>
                          <p
                            className='text-xs h-5 w-44 leading-5 text-content-black font-normal ml-3 truncate overflow-hidden ...'
                            title={workspace.name}
                          >
                            {workspace.name}
                          </p>
                        </div>
                      </div>
                      <p
                        className='text-xs w-56 max-w-full h-5 leading-5 text-content-grey-900 font-normal truncate overflow-hidden ...'
                        title={`ID: ${workspace.id}`}
                      >{`ID: ${workspace.id}`}</p>
                      <div className='ml-auto flex gap-4'>
                        <PencilSquareIcon
                          width={16}
                          height={16}
                          onClick={() => onEditWorkspace(workspace)}
                          className='text-content-black cursor-pointer'
                        />
                        <TrashIcon
                          width={16}
                          height={16}
                          className='text-content-black cursor-pointer'
                          onClick={() => onDeleteWorkspace(workspace)}
                        />
                      </div>
                    </div>
                    <Disclosure.Panel className='pl-5 flex justify-between items-center mt-2 py-3'>
                      <div className='flex items-center'>
                        <span className='bg-content-accent-light-11 h-7 w-7 flex justify-center items-center rounded-full'>
                          <BuildingOfficeIcon className=' text-content-accent-hover' width={12} height={12} />
                        </span>
                        <p className='text-xs leading-5 text-content-black font-normal ml-3'>First Sector</p>
                      </div>
                      <p className='text-xs leading-5 text-content-grey-600 font-normal'>Public tab</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
        {isLoading && (
          <Disclosure>
            {({open}) => (
              <>
                <div className='flex justify-start py-3 items-center animate-pulse'>
                  <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-96'></div>
                </div>
              </>
            )}
          </Disclosure>
        )}
        {/* <Disclosure>
          {({open}) => (
            <>
              <div className='flex justify-start py-3 items-center border-t border-content-grey-100'>
                <div className='flex gap-3 w-60 items-center'>
                  <Disclosure.Button className='flex items-center'>
                    <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`} />
                  </Disclosure.Button>
                  <div className='flex items-center '>
                    <span className='bg-content-blue-dark-11 h-7 w-7 flex justify-center items-center rounded-full'>
                      <BuildingOfficeIcon className=' text-content-blue-dark' width={12} height={12} />
                    </span>
                    <p className='text-xs leading-5 text-content-black font-normal ml-3'>Sector 1</p>
                  </div>
                </div>
                <p className='text-xs leading-5 text-content-grey-900 font-normal'>ID: GH33YT5566KI22</p>
                <div className='ml-auto flex gap-4'>
                  <PencilSquareIcon
                    width={16}
                    height={16}
                    className='text-content-black cursor-pointer'
                    onClick={() => console.log('edit')}
                  />
                  <TrashIcon
                    width={16}
                    height={16}
                    className='text-content-black cursor-pointer'
                    onClick={() => console.log('delete')}
                  />
                </div>
              </div>
              <Disclosure.Panel className='pl-5 flex justify-between items-center mt-2 h-12'>
                <div className='flex items-center'>
                  <span className='bg-content-accent-light-11 h-7 w-7 flex justify-center items-center rounded-full'>
                    <BuildingOfficeIcon className=' text-content-accent-hover' width={12} height={12} />
                  </span>
                  <p className='text-xs leading-5 text-content-black font-normal ml-3'>First Sector</p>
                </div>
                <p className='text-xs leading-5 text-content-grey-600 font-normal'>Public tab</p>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure> */}
      </div>
    </div>
  );
}
