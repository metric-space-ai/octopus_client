import {useState, useEffect, Fragment} from 'react';
import {Disclosure, Transition} from '@headlessui/react';

import {TrashIcon, ChevronUpIcon} from '@heroicons/react/24/outline';
import CustomSwitch from '@/components/switch/custom-switch';
import {ISimpleApp} from '@/types';
import {useSelector, useDispatch} from 'react-redux';
import {getAllSimpleApps, deleteSimpleAppById} from '@/app/lib/features/simpleApps/simpleAppsSlice';
import {getAllTeamMembers} from '@/app/lib/features/teamMembers/teamMemberSlice';

import {RemoveSimpleAppModal} from '@/components/modals/RemoveSimpeAppModal';
import {selectSimpleApps} from '@/app/lib/features/simpleApps/simpleAppsSelector';
import Highlight from 'react-highlight';

import './../../../../assets/atelier-cave-dark.css';
import { AppDispatch } from '@/app/lib/store';

export default function SimpleAppsDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const {entities: simpleApps, isLoading, reloadSimpleAppIsAvailable} = useSelector(selectSimpleApps);

  const [removeSimpleAppsModal, setRemoveSimpleAppsModal] = useState(false);
  const [selectedSimpleApp, setSelectedSimpleApp] = useState<ISimpleApp>();

  const handleOpenDeleteSimpleAppModal = (simpleApp: ISimpleApp) => {
    setSelectedSimpleApp(simpleApp);
    setRemoveSimpleAppsModal(true);
  };

  const handleConfirmDeleteSimpleApp = async () => {
    if (!selectedSimpleApp) return;
    dispatch(deleteSimpleAppById(selectedSimpleApp.id));
  };

  const handleChangeSimpleAppActivation = async (app_id: string, check: boolean) => {
    if (!simpleApps) return;

    // const payload: ISimpleAppActivation = {operation: check ? 'Enable' : 'Disable', is_enabled: check};
    // const beforeChange = [...simpleApps];
    // setSimpleApps([...simpleApps.flatMap((p) => (p.id === app_id ? {...p, is_enabled: check} : p))]);
    // dispatch(deleteSimpleAppById({app_id, payload}));
    // try {
    //   const {status} = await updateSimpleAppByIdApi(app_id, payload);
    //   if (status === 201) {
    //     toast.success('updated successfully');
    //   } else {
    //     setSimpleApps(beforeChange);
    //   }
    // } catch (err) {
    //   setSimpleApps(beforeChange);
    //   if (err instanceof AxiosError) {
    //     toast.error(err?.response?.data.error);
    //   }
    // } finally {
    // }
  };

  useEffect(() => {
    dispatch(getAllSimpleApps());
    dispatch(getAllTeamMembers());
  }, []);

  return (
    <>
      <div className='w-full'>
        <div className='mx-auto custom-scrollbar-thumb'>
          <div className='flex mb-2'>
            <div className='w-52'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>Name</span>
            </div>
            <div className='w-32'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600 pl-1.5'>Description</span>
            </div>
            <div className='w-32'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600 pl-1.5'>Formatted name</span>
            </div>
            <div className='w-20 flex justify-center'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600 pl-1.5'>On/Off</span>
            </div>
          </div>

          <div className='max-h-[280px] h-full min-w-[570px] custom-scrollbar-thumb'>
            {reloadSimpleAppIsAvailable && (
              <div className='w-full'>
                <h2
                  className='uppercase text-content-accent cursor-pointer text-center py-6 hover:underline'
                  onClick={() => getAllSimpleApps()}
                >
                  try again
                </h2>
              </div>
            )}
            {!simpleApps || simpleApps.length === 0
              ? !isLoading && (
                  <div className='flex justify-center py-3 items-center border-t border-content-grey-100'>
                    <h2 className='text-lg text-content-accent uppercase'>not found</h2>
                  </div>
                )
              : simpleApps.map((app, index) => (
                  <Disclosure key={app.id}>
                    {({open}) => (
                      <>
                        <div className='flex justify-start py-3 items-center border-t border-content-grey-100'>
                          <div className='flex gap-3 w-52 items-center'>
                            <Disclosure.Button className='flex items-center'>
                              <ChevronUpIcon
                                className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`}
                              />
                            </Disclosure.Button>
                            <div className={`flex items-center flex-1 ${app.code ? '' : 'pl-8'}`}>
                              <p
                                className='text-xs leading-5 h-5 text-content-black font-poppins-semibold ml-3 w-36 truncate ...'
                                title={app.name}
                              >
                                {app.name}
                              </p>
                            </div>
                          </div>
                          <p className='text-xxs w-32 pl-1.5 leading-4 h-4 text-content-grey-900 font-poppins-medium truncate ...'>
                            {app.description}
                          </p>
                          <p className='text-xxs w-32 pl-1.5 leading-4 h-4 text-content-grey-900 font-poppins-medium truncate ...'>
                            {app.formatted_name}
                          </p>

                          <div className='flex justify-center items-center w-20 pl-1.5'>
                            <CustomSwitch
                              active={app.is_enabled}
                              onChange={(check: boolean) => handleChangeSimpleAppActivation(app.id, check)}
                            />
                          </div>

                          <span
                            className='ml-auto p-1.5 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
                            onClick={() => handleOpenDeleteSimpleAppModal(app)}
                          >
                            <TrashIcon width={16} height={16} className='text-content-black cursor-pointer' />
                          </span>
                        </div>
                        <Disclosure.Panel className='pl-5 flex justify-between items-center mt-2 '>
                          <Transition
                            as={Fragment}
                            leave='transition ease-in duration-100'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                          >
                            <div className='custom-scrollbar-thumb h-40 w-full bg-content-black'>
                              {/* <MarkdownContent content={app.code} /> */}
                              <Highlight
                                innerHTML={false}
                                // className='text-content-white [&_.hljs-name]:text-content-blue-light [&_.hljs-tag]:text-content-green [&_.hljs-keyword]:text-content-red-400
                                // [&_.hljs-meta]:text-content-grey-400 [&_.hljs-meta]:italic [&_.hljs-class]:text-green-500  [&_.hljs-params]:text-green-500
                                // [&_.hljs-function]:text-yellow-200 [&_.hljs-built_in]:text-yellow-500  '
                              >
                                {app.code}
                              </Highlight>
                            </div>
                          </Transition>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
          </div>
          {isLoading && (
            <Disclosure>
              {({open}) => (
                <>
                  <div className='flex justify-start py-3 items-center animate-pulse'>
                    <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-52'></div>

                    <div className='w-24 mx-2 h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>
                    <div className='w-24  h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>
                    <div className='w-16 mx-2 h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>

                    <div className='ml-auto h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-5 mx-1.5'></div>
                  </div>
                </>
              )}
            </Disclosure>
          )}
        </div>
      </div>
      {selectedSimpleApp && (
        <RemoveSimpleAppModal
          onDelete={handleConfirmDeleteSimpleApp}
          open={removeSimpleAppsModal}
          simpleApp={selectedSimpleApp}
          onClose={() => {
            setRemoveSimpleAppsModal(false);
            setSelectedSimpleApp(undefined);
          }}
        />
      )}
    </>
  );
}
