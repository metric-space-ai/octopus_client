import {Disclosure} from '@headlessui/react';

import {BuildingOfficeIcon, TrashIcon, ChevronUpIcon, PencilSquareIcon} from '@heroicons/react/24/outline';

export default function SectorsData() {
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
        <Disclosure>
          {({open}) => (
            <>
              <div className='flex justify-start py-3 items-center'>
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
        <Disclosure>
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
        </Disclosure>
        <Disclosure>
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
        </Disclosure>
        <Disclosure>
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
        </Disclosure>
        
      </div>
    </div>
  );
}
