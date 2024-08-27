import {Fragment, useEffect, useState} from 'react';

import {Disclosure, Transition} from '@headlessui/react';
import {ChevronUpIcon, TrashIcon} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import {useDispatch, useSelector} from 'react-redux';

import {selectSimpleApps} from '@/app/lib/features/simpleApps/simpleAppsSelector';
import {deleteSimpleAppById, getAllSimpleApps} from '@/app/lib/features/simpleApps/simpleAppsSlice';
import {getAllTeamMembers} from '@/app/lib/features/teamMembers/teamMemberSlice';
import {AppDispatch} from '@/app/lib/store';
import {RemoveSimpleAppModal} from '@/components/modals/RemoveSimpeAppModal';
import CustomSwitch from '@/components/switch/custom-switch';
import {ISimpleApp} from '@/types';
// import Highlight from 'react-highlight';
import './../../../../assets/atelier-cave-dark.css';

const DynamicHighlight = dynamic(async () => (await import('react-highlight')).default, {
  loading: () => <div className='flex items-center justify-center p-7 h-32 bg-grey-150 animate-pulse' />,
});

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
    console.log({app_id, check});
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className='w-full'>
        <div className='mx-auto custom-scrollbar-thumb'>
          <div className='flex mb-2'>
            <div className='w-52'>
              <span className='font-medium text-xs leading-5 text-grey-600'>Name</span>
            </div>
            <div className='w-32'>
              <span className='font-medium text-xs leading-5 text-grey-600 pl-1.5'>Description</span>
            </div>
            <div className='w-32'>
              <span className='font-medium text-xs leading-5 text-grey-600 pl-1.5'>Formatted name</span>
            </div>
            <div className='w-20 flex justify-center'>
              <span className='font-medium text-xs leading-5 text-grey-600 pl-1.5'>On/Off</span>
            </div>
          </div>

          <div className='max-h-[280px] h-full min-w-[570px] custom-scrollbar-thumb'>
            {reloadSimpleAppIsAvailable && (
              <div className='w-full'>
                <h2
                  className='uppercase text-primary cursor-pointer text-center py-6 hover:underline'
                  onClick={() => getAllSimpleApps()}
                >
                  try again
                </h2>
              </div>
            )}
            {!simpleApps || simpleApps.length === 0
              ? !isLoading && (
                  <div className='flex justify-center py-3 items-center border-t'>
                    <h2 className='text-lg text-primary uppercase'>not found</h2>
                  </div>
                )
              : simpleApps.map((app) => (
                  <Disclosure key={app.id}>
                    {({open}) => (
                      <>
                        <div className='flex justify-start py-3 items-center border-t'>
                          <div className='flex gap-3 w-52 items-center'>
                            <Disclosure.Button className='flex items-center'>
                              <ChevronUpIcon
                                className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`}
                              />
                            </Disclosure.Button>
                            <div className={`flex items-center flex-1 ${app.code ? '' : 'pl-8'}`}>
                              <p
                                className='text-xs leading-5 h-5 text-grey-900 font-semibold ml-3 w-36 truncate ...'
                                title={app.name}
                              >
                                {app.name}
                              </p>
                            </div>
                          </div>
                          <p className='text-xxs w-32 pl-1.5 leading-4 h-4 text-grey-800 font-medium truncate ...'>
                            {app.description}
                          </p>
                          <p className='text-xxs w-32 pl-1.5 leading-4 h-4 text-grey-800 font-medium truncate ...'>
                            {app.formatted_name}
                          </p>

                          <div className='flex justify-center items-center w-20 pl-1.5'>
                            <CustomSwitch
                              active={app.is_enabled}
                              onChange={(check: boolean) => handleChangeSimpleAppActivation(app.id, check)}
                            />
                          </div>

                          <span
                            className='ml-auto p-1.5 hover:bg-danger-500/10 cursor-pointer transition rounded-full'
                            onClick={() => handleOpenDeleteSimpleAppModal(app)}
                          >
                            <TrashIcon width={16} height={16} className='text-grey-900 cursor-pointer' />
                          </span>
                        </div>
                        <Disclosure.Panel className='pl-5 flex justify-between items-center mt-2 '>
                          <Transition
                            as={Fragment}
                            leave='transition ease-in duration-100'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                          >
                            <div className='custom-scrollbar-thumb h-40 w-full bg-background'>
                              {/* <MarkdownContent content={app.code} /> */}
                              <DynamicHighlight
                                innerHTML={false}
                                // className='text-grey-0 [&_.hljs-name]:text-secondary-600 [&_.hljs-tag]:text-secondary [&_.hljs-keyword]:text-danger-300
                                // [&_.hljs-meta]:text-grey-400 [&_.hljs-meta]:italic [&_.hljs-class]:text-green-500  [&_.hljs-params]:text-green-500
                                // [&_.hljs-function]:text-yellow-200 [&_.hljs-built_in]:text-yellow-500  '
                              >
                                {app.code}
                              </DynamicHighlight>
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
              {() => (
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
