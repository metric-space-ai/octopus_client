import {useState, useEffect, Fragment} from 'react';
import {Disclosure} from '@headlessui/react';

import {TrashIcon, ChevronUpIcon} from '@heroicons/react/24/outline';
import {RemovePluginModal} from '@/components/modals/RemovePluginModal';
import {useAuthContext} from '@/contexts/authContext';
import {AxiosError} from 'axios';
import {
  deletePluginByIdApi,
  deletetAiFunctionsByIdApi,
  updatePluginByIdApi,
  updatetAiFunctionsByIdApi,
} from '@/services/auth.service';
import toast from 'react-hot-toast';
import {IAIFunctions, IPlugin, IPluginActivation} from '@/types/plugin';
import CustomCheckbox from '@/components/custom-checkbox';
import {IconButton} from '@/components/buttons';
import {Spinner} from '@/components/spinner';
import {bytesCalculator} from '@/helpers';

export default function PluginsDetails() {
  const [removePluginsModal, setRemovePluginsModal] = useState(false);
  const [aiFunctionsLoading, setAiFunctionsLoading] = useState(false);
  const [deleteFunctionsIsLoading, setDeleteFunctionsIsLoading] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState<IPlugin>();

  const {loading, getAllPlugins, plugins, setPlugins, reloadPluginAvailable} = useAuthContext();

  const handleOpenDeletePluginModal = (plugin: IPlugin) => {
    setSelectedPlugin(plugin);
    setRemovePluginsModal(true);
  };

  const handleConfirmDeletePlugin = async () => {
    if (!selectedPlugin) return;
    try {
      const {status} = await deletePluginByIdApi(selectedPlugin.id);
      if (status === 204) {
        getAllPlugins();
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
    }
  };

  const handleChangePluginActivation = async (plugin_id: string, check: boolean) => {
    if (!plugins) return;

    const payload: IPluginActivation = {operation: check ? 'Enable' : 'Disable', is_enabled: check};
    const beforeChange = [...plugins];
    setPlugins([...plugins.flatMap((p) => (p.id === plugin_id ? {...p, is_enabled: check} : p))]);
    try {
      const {status} = await updatePluginByIdApi(plugin_id, payload);
      if (status === 201) {
        toast.success('updated successfully');
      } else {
        setPlugins(beforeChange);
      }
    } catch (err) {
      setPlugins(beforeChange);
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
    }
  };

  const handleChangeAiFunctionActivation = async (
    index: number,
    funcIndex: number,
    func: IAIFunctions,
    check: boolean,
  ) => {
    if (!plugins) return;
    setAiFunctionsLoading(true);
    const payload = {is_enabled: check};
    const beforeChange = [...plugins];
    const result = [...plugins];
    result[index].ai_functions![funcIndex].is_enabled = check;
    setPlugins(result);
    try {
      const {status} = await updatetAiFunctionsByIdApi(func.ai_service_id, func.id, payload);
      if (status === 200) {
        toast.success('updated successfully');
      } else {
        setPlugins(beforeChange);
      }
    } catch (err) {
      setPlugins(beforeChange);
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setAiFunctionsLoading(false);
    }
  };

  const handleDeleteServiceAiFunction = async (index: number, func: IAIFunctions) => {
    if (!plugins) return;
    setDeleteFunctionsIsLoading(true);
    try {
      const {status} = await deletetAiFunctionsByIdApi(func.ai_service_id, func.id);
      if (status === 204) {
        toast.success('deleted successfully');
        getAllPlugins();
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setDeleteFunctionsIsLoading(false);
    }
  };

  useEffect(() => {
    getAllPlugins();
  }, []);

  return (
    <>
      <div className='w-full'>
        <div className='mx-auto w-full max-w-[560px] rounded-2xl bg-white'>
          <div className='flex mb-2'>
            <div className='w-52'>
              <span
                className='font-poppins-medium text-xs leading-5 text-content-grey-600'
              >
                Name
              </span>
            </div>
            <div className='w-28'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600 pl-2'>Size</span>
            </div>
            <div className='w-28 flex justify-center'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>Availability</span>
            </div>
          </div>

          <div className='max-h-[420px] overflow-auto custom-scrollbar-thumb relative -mr-2'>
            {reloadPluginAvailable && (
              <div className='w-full'>
                <h2
                  className='uppercase text-content-accent cursor-pointer text-center py-6 hover:underline'
                  onClick={() => getAllPlugins()}
                >
                  try again
                </h2>
              </div>
            )}
            {!plugins || plugins.length === 0
              ? !loading && (
                  <div className='flex justify-center py-3 items-center border-t border-content-grey-100'>
                    <h2 className='text-lg text-content-accent uppercase'>not found</h2>
                  </div>
                )
              : plugins.map((plugin, index) => (
                  <Disclosure key={plugin.id}>
                    {({open}) => (
                      <Fragment>
                        <div className='flex justify-start py-3 items-center border-t border-content-grey-100'>
                          <div className='flex gap-3 w-52 items-center text-ellipsis overflow-hidden ...'>
                            <div className={`flex items-center ${plugin.ai_functions ? '' : 'pl-8'}`}>
                              <p className='text-xs leading-5 text-content-black font-poppins-semibold ml-3'>
                                {plugin.original_file_name}
                              </p>
                            </div>
                          </div>
                          <p className='text-xxs leading-4 w-28 text-content-grey-900 font-poppins-medium pl-2'>
                            {bytesCalculator(224500000)}
                          </p>
                          <div className='flex justify-center items-center w-28'>
                            <p className='text-xs leading-5 text-content-grey-900 font-poppins-semibold ml-3'>
                              Only me
                            </p>
                            {plugin.ai_functions && plugin.ai_functions.length > 0 && (
                              <Disclosure.Button className='flex items-center ml-1'>
                                <ChevronUpIcon
                                  className={`${!open ? 'rotate-180 transform' : ''} h-3 w-3 text-content-grey-900`}
                                />
                              </Disclosure.Button>
                            )}
                          </div>

                          <span
                            className='ml-auto p-1.5 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
                            onClick={() => handleOpenDeletePluginModal(plugin)}
                          >
                            <TrashIcon width={16} height={16} className='text-content-grey-900 cursor-pointer' />
                          </span>
                        </div>
                        {plugin.ai_functions && (
                          <Disclosure.Panel className='pl-5 flex justify-between items-center mt-2 pb-3'>
                            <div className='flex flex-col gap-3 pl-9 w-full'>
                              {plugin.ai_functions.map((func, funcIndex) => (
                                <div key={func.id} className='flex w-full items-center justify-between'>
                                  <CustomCheckbox
                                    active={func.is_enabled}
                                    onChange={(check: boolean) =>
                                      !aiFunctionsLoading
                                        ? handleChangeAiFunctionActivation(index, funcIndex, func, check)
                                        : {}
                                    }
                                    disabled={aiFunctionsLoading}
                                    title={func.description}
                                  />
                                  <IconButton
                                    className='top-4 right-4 mr-5 ml-1 bg-content-red-600/20 hover:bg-content-red-600/40'
                                    onClick={() => handleDeleteServiceAiFunction(index, func)}
                                  >
                                    {deleteFunctionsIsLoading ? (
                                      <Spinner />
                                    ) : (
                                      <TrashIcon className='w-4 h-4 text-content-primary' />
                                    )}
                                  </IconButton>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        )}
                      </Fragment>
                    )}
                  </Disclosure>
                ))}
          </div>
          {loading && (
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
      {selectedPlugin && (
        <RemovePluginModal
          onDelete={handleConfirmDeletePlugin}
          open={removePluginsModal}
          plugin={selectedPlugin}
          onClose={() => {
            setRemovePluginsModal(false);
            setSelectedPlugin(undefined);
          }}
        />
      )}
    </>
  );
}
