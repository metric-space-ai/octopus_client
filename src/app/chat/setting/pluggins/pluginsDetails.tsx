import {Disclosure, Switch} from '@headlessui/react';

import {BuildingOfficeIcon, TrashIcon, ChevronUpIcon, PencilSquareIcon} from '@heroicons/react/24/outline';
import PluginsBadge from './badge';
import classNames from 'classnames';
import {useState} from 'react';

export default function SectorsData() {
  const [active, setActive] = useState<boolean>();

  return (
    <div className='w-full'>
      <div className='mx-auto w-full max-w-[560px] rounded-2xl bg-white'>
        <div className='flex mb-2'>
          <div className='w-52'>
            <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>Name</span>
          </div>
          <div className='w-28'>
            <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>Size</span>
          </div>
          <div className='w-24 flex justify-center'>
            <span className='font-poppins-medium text-xs leading-5 text-content-grey-600 '>Status</span>
          </div>
          <div className='w-20 flex justify-center'>
            <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>On/Off</span>
          </div>
        </div>
        <Disclosure>
          {({open}) => (
            <>
              <div className='flex justify-start py-3 items-center'>
                <div className='flex gap-3 w-52 items-center'>
                  <Disclosure.Button className='flex items-center'>
                    <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`} />
                  </Disclosure.Button>
                  <div className='flex items-center '>
                    <p className='text-xs leading-5 text-content-black font-poppins-semibold ml-3'>Plugin name 1</p>
                  </div>
                </div>
                <p className='text-xxs leading-4 w-28 text-content-grey-900 font-poppins-medium'>0.7 / 24GB on GPU2</p>
                <div className='w-24 text-xs flex justify-center'>
                  <PluginsBadge variant='error' label='error' />
                </div>
                <div className='flex justify-center items-center w-20'>
                  <Switch
                    checked={active}
                    onChange={(checked) => setActive(checked)}
                    className={classNames(
                      `${
                        active
                          ? 'bg-content-accent shadow-switch-active'
                          : ' shadow-switch-deactive bg-content-grey-100'
                      } relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`,
                    )}
                  >
                    {' '}
                    <span className='sr-only'>Use setting</span>
                    <span
                      aria-hidden='true'
                      className={classNames(
                        `${
                          active
                            ? 'translate-x-5 shadow-switch-circle-active bg-content-grey-100'
                            : 'translate-x-0 shadow-switch-circle-deactive bg-white'
                        } pointer-events-none inline-block h-4 w-4 transform rounded-full ring-0 transition duration-200 ease-in-out`,
                      )}
                    />
                  </Switch>
                </div>

                <span
                  className='ml-auto p-1.5 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
                  onClick={() => console.log('delete')}
                >
                  <TrashIcon width={16} height={16} className='text-content-black cursor-pointer' />
                </span>
              </div>
              <Disclosure.Panel className='pl-5 flex justify-between items-center mt-2 py-3'>
                <p className='w-full text-xs leading-5 text-content-grey-900 font-poppins-medium ml-3'>
                  Enhance your ChatGPT experience with ImageFlow Connect – a powerful plugin that seamlessly integrates
                  image uploading capabilities into your conversations. With ImageFlow Connect, you can effortlessly
                  share visual context by uploading images directly within the chat interface.
                </p>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure>
          {({open}) => (
            <>
              <div className='flex justify-start py-3 items-center border-t border-content-grey-100'>
                <div className='flex gap-3 w-52 items-center'>
                  <Disclosure.Button className='flex items-center'>
                    <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`} />
                  </Disclosure.Button>
                  <div className='flex items-center '>
                    <p className='text-xs leading-5 text-content-black font-poppins-semibold ml-3'>Plugin name 1</p>
                  </div>
                </div>
                <p className='text-xxs leading-4 w-28 text-content-grey-900 font-poppins-medium'>0.7 / 24GB on GPU2</p>
                <div className='w-24 text-xs flex justify-center'>
                  <PluginsBadge variant='normal' label='Running' />
                </div>
                <div className='flex justify-center items-center w-20'>
                  <Switch
                    checked={active}
                    onChange={(checked) => setActive(checked)}
                    className={classNames(
                      `${
                        active
                          ? 'bg-content-accent shadow-switch-active'
                          : ' shadow-switch-deactive bg-content-grey-100'
                      } relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`,
                    )}
                  >
                    {' '}
                    <span className='sr-only'>Use setting</span>
                    <span
                      aria-hidden='true'
                      className={classNames(
                        `${
                          active
                            ? 'translate-x-5 shadow-switch-circle-active bg-content-grey-100'
                            : 'translate-x-0 shadow-switch-circle-deactive bg-white'
                        } pointer-events-none inline-block h-4 w-4 transform rounded-full ring-0 transition duration-200 ease-in-out`,
                      )}
                    />
                  </Switch>
                </div>

                <span
                  className='ml-auto p-1.5 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
                  onClick={() => console.log('delete')}
                >
                  <TrashIcon width={16} height={16} className='text-content-black cursor-pointer' />
                </span>
              </div>
              <Disclosure.Panel className='pl-5 flex justify-between items-center mt-2 py-3'>
                <p className='w-full text-xs leading-5 text-content-grey-900 font-poppins-medium ml-3'>
                  Enhance your ChatGPT experience with ImageFlow Connect – a powerful plugin that seamlessly integrates
                  image uploading capabilities into your conversations. With ImageFlow Connect, you can effortlessly
                  share visual context by uploading images directly within the chat interface.
                </p>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure>
          {({open}) => (
            <>
              <div className='flex justify-start py-3 items-center border-t border-content-grey-100'>
                <div className='flex gap-3 w-52 items-center'>
                  <Disclosure.Button className='flex items-center'>
                    <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`} />
                  </Disclosure.Button>
                  <div className='flex items-center '>
                    <p className='text-xs leading-5 text-content-black font-poppins-semibold ml-3'>Plugin name 1</p>
                  </div>
                </div>
                <p className='text-xxs leading-4 w-28 text-content-grey-900 font-poppins-medium'>0.7 / 24GB on GPU2</p>
                <div className='w-24 text-xs flex justify-center'>
                  <PluginsBadge variant='info' label='Setup' />
                </div>
                <div className='flex justify-center items-center w-20'>
                  <Switch
                    checked={active}
                    onChange={(checked) => setActive(checked)}
                    className={classNames(
                      `${
                        active
                          ? 'bg-content-accent shadow-switch-active'
                          : ' shadow-switch-deactive bg-content-grey-100'
                      } relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`,
                    )}
                  >
                    {' '}
                    <span className='sr-only'>Use setting</span>
                    <span
                      aria-hidden='true'
                      className={classNames(
                        `${
                          active
                            ? 'translate-x-5 shadow-switch-circle-active bg-content-grey-100'
                            : 'translate-x-0 shadow-switch-circle-deactive bg-white'
                        } pointer-events-none inline-block h-4 w-4 transform rounded-full ring-0 transition duration-200 ease-in-out`,
                      )}
                    />
                  </Switch>
                </div>

                <span
                  className='ml-auto p-1.5 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
                  onClick={() => console.log('delete')}
                >
                  <TrashIcon width={16} height={16} className='text-content-black cursor-pointer' />
                </span>
              </div>
              <Disclosure.Panel className='pl-5 flex justify-between items-center mt-2 py-3'>
                <p className='w-full text-xs leading-5 text-content-grey-900 font-poppins-medium ml-3'>
                  Enhance your ChatGPT experience with ImageFlow Connect – a powerful plugin that seamlessly integrates
                  image uploading capabilities into your conversations. With ImageFlow Connect, you can effortlessly
                  share visual context by uploading images directly within the chat interface.
                </p>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
