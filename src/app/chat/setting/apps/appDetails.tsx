import {useState} from 'react';

import {Disclosure} from '@headlessui/react';
import {ChevronUpIcon, TrashIcon} from '@heroicons/react/24/outline';

import {RemoveAppModal} from '@/components/modals/RemoveAppModal';
import CustomSwitch from '@/components/switch/custom-switch';
// import {useAuthContext} from '@/contexts/authContext';
// import {AxiosError} from 'axios';
// import {
//   deleteAppByIdApi,
//   deletetAiFunctionsByIdApi,
//   updateAppByIdApi,
//   updatetAiFunctionsByIdApi,
// } from '@/services/auth.service';
// import toast from 'react-hot-toast';
import {IApp} from '@/types';

import AppsBadge from './badge';
// import CustomCheckbox from '@/components/custom-checkbox';
// import {IconButton} from '@/components/buttons';
// import {Spinner} from '@/components/spinner';
// import {PLUGINSTATUS} from '@/constant';
// import {useSettingsContext} from '@/contexts/settingsContext';
// import classNames from 'classnames';

const APPS: IApp[] = [
  {
    id: 'd018fb3c-2e04-4f12-aaab-8ccdc5a5ce8f',
    ai_functions: null,
    device_map: '',
    health_check_execution_time: 0,
    health_check_status: 'Ok',
    is_enabled: true,
    original_file_name: 'information_retrieval.py',
    original_function_body: '',
    parser_feedback: null,
    port: 10001,
    processed_function_body: '',
    progress: 100,
    required_python_version: 'cp311',
    setup_execution_time: 0,
    setup_status: 'NotPerformed',
    status: 'Running',
    created_at: '2023-11-23T15:04:37Z',
    deleted_at: null,
    health_check_at: '2023-12-01T09:33:38Z',
    setup_at: '2023-11-29T15:22:43Z',
    updated_at: '2023-12-01T09:33:38Z',
  },
  {
    id: 'bbdce71b-4ca0-46d8-8c9e-304047fca844',
    ai_functions: null,
    device_map: '',
    health_check_execution_time: 0,
    health_check_status: 'Ok',
    is_enabled: true,
    original_file_name: 'information_retrieval.py',
    original_function_body: '',
    parser_feedback: null,
    port: 10000,
    processed_function_body: '',
    progress: 100,
    required_python_version: 'cp311',
    setup_execution_time: 0,
    setup_status: 'NotPerformed',
    status: 'Running',
    created_at: '2023-11-23T13:10:22Z',
    deleted_at: null,
    health_check_at: '2023-12-01T09:33:38Z',
    setup_at: '2023-11-29T15:29:13Z',
    updated_at: '2023-12-01T09:33:38Z',
  },
];

export default function AppsDetails() {
  // const [activeFunction, setActiveFunction] = useState({f1: true, f2: false, f3: false});
  const [removeAppsModal, setRemoveAppsModal] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [aiFunctionsLoading, setAiFunctionsLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<IApp>();
  const [apps, setApps] = useState(APPS);

  const handleOpenDeleteAppModal = (app: IApp) => {
    setSelectedApp(app);
    setRemoveAppsModal(true);
  };

  const handleConfirmDeleteApp = async () => {
    if (!selectedApp) return;
    const result = [...apps].filter((app) => app.id !== selectedApp.id);
    setApps(result);

    // if (!selectedApp) return;
    // try {
    //   const {status} = await deleteAppByIdApi(selectedApp.id);
    //   if (status === 204) {
    //     getAllApps();
    //   }
    // } catch (err) {
    //   if (err instanceof AxiosError) {
    //     toast.error(err?.response?.data.error);
    //   }
    // } finally {
    // }
  };

  // const handleChangeAppActivation = async (app_id: string, check: boolean) => {
  //   if (!apps) return;
  //   const payload: IAppActivation = {operation: check ? 'Enable' : 'Disable', is_enabled: check};
  //   const beforeChange = [...apps];
  //   setApps([...apps.flatMap((p) => (p.id === app_id ? {...p, is_enabled: check} : p))]);
  //   try {
  //     const {status} = await updateAppByIdApi(app_id, payload);
  //     if (status === 201) {
  //       toast.success('updated successfully');
  //     } else {
  //       setApps(beforeChange);
  //     }
  //   } catch (err) {
  //     setApps(beforeChange);
  //     if (err instanceof AxiosError) {
  //       toast.error(err?.response?.data.error);
  //     }
  //   } finally {
  //   }
  // };

  // const handleChangeAiFunctionActivation = async (
  //   index: number,
  //   funcIndex: number,
  //   func: IAIFunctions,
  //   check: boolean,
  // ) => {
  //   if (!apps) return;
  //   setAiFunctionsLoading(true);
  //   const payload = {is_enabled: check};
  //   const beforeChange = [...apps];
  //   const result = [...apps];
  //   result[index].ai_functions![funcIndex].is_enabled = check;
  //   setApps(result);
  //   try {
  //     const {status} = await updatetAiFunctionsByIdApi(func.ai_service_id, func.id, payload);
  //     if (status === 200) {
  //       toast.success('updated successfully');
  //     } else {
  //       setApps(beforeChange);
  //     }
  //   } catch (err) {
  //     setApps(beforeChange);
  //     if (err instanceof AxiosError) {
  //       toast.error(err?.response?.data.error);
  //     }
  //   } finally {
  //     setAiFunctionsLoading(false);
  //   }
  // };

  // const handleDeleteServiceAiFunction = async (index: number, func: IAIFunctions) => {
  //   if (!apps) return;
  //   setDeleteFunctionsIsLoading(true);
  //   try {
  //     const {status} = await deletetAiFunctionsByIdApi(func.ai_service_id, func.id);
  //     if (status === 204) {
  //       toast.success('deleted successfully');
  //       getAllApps();
  //     }
  //   } catch (err) {
  //     if (err instanceof AxiosError) {
  //       toast.error(err?.response?.data.error);
  //     }
  //   } finally {
  //     setDeleteFunctionsIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getAllApps();
  // }, []);

  return (
    <>
      <div className='w-full'>
        <div className='mx-auto w-full max-w-[560px] rounded-lg bg-grey-0'>
          <div className='flex mb-2'>
            <div className='w-52'>
              <span className='font-medium text-xs leading-5 text-grey-600'>Name</span>
            </div>
            <div className='w-28'>
              <span className='font-medium text-xs leading-5 text-grey-600'>Size</span>
            </div>
            <div className='w-24 flex justify-center'>
              <span className='font-medium text-xs leading-5 text-grey-600 '>Status</span>
            </div>
            <div className='w-20 flex justify-center'>
              <span className='font-medium text-xs leading-5 text-grey-600'>On/Off</span>
            </div>
          </div>

          <div className='max-h-[420px] overflow-auto custom-scrollbar-thumb relative -mr-2'>
            {/* {reloadAppAvailable && (
              <div className='w-full'>
                <h2
                  className='uppercase text-primary cursor-pointer text-center py-6 hover:underline'
                  onClick={() => getAllApps()}
                >
                  try again
                </h2>
              </div>
            )} */}
          </div>
          {apps.length > 0 &&
            apps.map((app) => (
              <Disclosure key={`app-${app.id}`}>
                {({open}) => (
                  <>
                    <div className='flex justify-start py-3 items-center border-t'>
                      <div className='flex gap-3 w-52 items-center'>
                        <Disclosure.Button className='flex items-center'>
                          <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`} />
                        </Disclosure.Button>
                        <div className='flex items-center '>
                          <p className='text-xs leading-5 text-grey-900 font-semibold ml-3'>App name 1</p>
                        </div>
                      </div>
                      <p className='text-xxs leading-4 w-28 text-grey-800 font-medium'>0.7 / 24GB on GPU2</p>
                      <div className='w-24 text-xs flex justify-center'>
                        <AppsBadge variant='info' label='Setup' />
                      </div>
                      <div className='flex justify-center items-center w-20'>
                        <CustomSwitch
                          active={app.is_enabled}
                          onChange={(check: boolean) => {
                            setApps((prev) =>
                              [...prev].flatMap((elem) => (elem.id === app.id ? {...elem, is_enabled: check} : elem)),
                            );
                          }}
                        />
                      </div>

                      <span
                        className='ml-auto p-1.5 hover:bg-danger-500/10 cursor-pointer transition rounded-full'
                        onClick={() => handleOpenDeleteAppModal(app)}
                      >
                        <TrashIcon width={16} height={16} className='text-grey-900 cursor-pointer' />
                      </span>
                    </div>
                    <Disclosure.Panel className='pl-5 flex justify-between items-center mt-2 py-3'>
                      <p className='w-full text-xs leading-5 text-grey-800 font-medium ml-3'>
                        Enhance your ChatGPT experience with ImageFlow Connect - a powerful app that seamlessly
                        integrates image uploading capabilities into your conversations. With ImageFlow Connect, you can
                        effortlessly share visual context by uploading images directly within the chat interface.
                      </p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
        </div>
      </div>
      {selectedApp && (
        <RemoveAppModal
          onDelete={handleConfirmDeleteApp}
          open={removeAppsModal}
          app={selectedApp}
          onClose={() => {
            setRemoveAppsModal(false);
            setSelectedApp(undefined);
          }}
        />
      )}
    </>
  );
}
