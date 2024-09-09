/* eslint-disable react-hooks/exhaustive-deps */
import {Fragment, useEffect, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {ArrowPathIcon, XMarkIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import {useDispatch, useSelector} from 'react-redux';

import {getAllTeamMembers} from '@/app/lib/features/teamMembers/teamMemberSlice';
import {selectTeamMembers} from '@/app/lib/features/teamMembers/teamMembersSelector';
import {getAllTokenAudits} from '@/app/lib/features/tokens/tokensSlice';
import {AppDispatch} from '@/app/lib/store';
import {ITokenAudit} from '@/types';

import {IconButton} from '../../buttons';

const DynamicAuditDetailsRow = dynamic(async () => (await import('./auditDetailsRow')).default, {
  ssr: false,
  loading: () => (
    <div className='h-11 flex items-center justify-center px-4 gap-4 rounded-xl bg-grey-50 animate-pulse mt-6 w-full' />
  ),
});

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export const TokenAuditsDetailsModalDialog = ({open, onClose}: ModalProps) => {
  const [entities, setEntities] = useState<ITokenAudit[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [reloadIsAvailable, setReloadIsAvailable] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const {entitiesObject: usersObject, isLoading: usersIsLoading} = useSelector(selectTeamMembers);

  const handleGetAllTokenAudit = async () => {
    setIsLoading(true);
    setReloadIsAvailable(false);
    try {
      const {meta, payload} = await dispatch(getAllTokenAudits());
      if (meta.requestStatus === 'fulfilled') {
        setEntities(payload as ITokenAudit[]);
      }
    } catch (err) {
      setReloadIsAvailable(true);
      console.log({err});
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (open && !isLoading && entities === undefined) handleGetAllTokenAudit();
  }, [open]);

  useEffect(() => {
    if (entities && entities.length > 0 && !usersObject) {
      dispatch(getAllTeamMembers());
    }
  }, [entities]);

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog className='relative z-10' as='div' onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-grey-900/50 transition-opacity' />
          </Transition.Child>
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-4xl transform border border-content-primary bg-grey-100 px-10 py-10 rounded-xl align-middle shadow-xl transition-all'>
                  <div className='flex justify-between items-start mb-6'>
                    <Dialog.Title
                      as='h3'
                      className='text-2xl font-semibold text-grey-900 text-left flex gap-3 items-center'
                    >
                      <ArrowPathIcon
                        className={classNames(
                          'text-primary-medium w-6 h-6 hover:text-primary cursor-pointer',
                          isLoading && 'animate-spin',
                        )}
                        onClick={handleGetAllTokenAudit}
                        title={'reload'}
                      />
                      {'Consumption details'}
                    </Dialog.Title>
                    <IconButton className='top-4 right-4' onClick={onClose}>
                      <XMarkIcon className='w-5 h-5 text-content-primary' />
                    </IconButton>
                  </div>
                  <div className='mx-auto w-full rounded-lg bg-grey-0 p-6'>
                    <div className='flex pb-2 text-sm border-b border-b-grey-100/40'>
                      <div className='w-52 font-medium leading-5 text-grey-600'>User</div>
                      <div className='w-20 ml-2 font-medium leading-5 text-grey-600' title='Large Language Model'>
                        llm
                      </div>
                      <div className='w-40 flex ml-3 font-medium leading-5 text-grey-600'>Model</div>
                      <div className='w-16 ml-3 text-center font-medium leading-5 text-grey-600' title='Input tokens'>
                        Input
                      </div>
                      <div className='w-16 ml-3 text-center font-medium leading-5 text-grey-600' title='Output tokens'>
                        Output
                      </div>
                      <div className='w-28 ml-3 text-center font-medium leading-5 text-grey-600 hidden md:block'>
                        Date
                      </div>
                    </div>

                    <div className='max-h-[420px] overflow-auto custom-scrollbar-thumb relative -mr-2'>
                      {reloadIsAvailable && (
                        <div className='w-full'>
                          <h2
                            className='uppercase text-primary cursor-pointer text-center py-6 hover:underline'
                            onClick={handleGetAllTokenAudit}
                          >
                            try again
                          </h2>
                        </div>
                      )}

                      {(entities === undefined || entities.length === 0) && !isLoading ? (
                        <div className='flex justify-center py-3 items-center border-t'>
                          <h2 className='text-lg text-primary uppercase'>not found</h2>
                        </div>
                      ) : (
                        !isLoading &&
                        entities?.map((token, index) => (
                          <DynamicAuditDetailsRow
                            key={token.id}
                            index={index}
                            usersIsLoading={usersIsLoading}
                            token={token}
                            usersObject={usersObject}
                          />
                          // <div
                          //   className={classNames(
                          //     'flex justify-start py-2.5 items-center text-sm',
                          //     index !== 0 && 'border-t border-t-grey-100/50',
                          //   )}
                          //   key={token.id}
                          // >
                          //   <div className='flex gap-2 w-52 text-left items-center truncate ...'>
                          //     {/* {getUserInfoWithUserId(token.user_id)} */}

                          //     {usersIsLoading && !usersObject && (
                          //       <>
                          //         <div className='rounded-full min-w-[2rem] w-8 h-8 bg-grey-100 animate-pulse' />
                          //         <div className='flex flex-col gap-0.5'>
                          //           <p className='w-14 h-5 rounded-lg bg-grey-100 animate-pulse' />
                          //           <p className='w-32 h-5 rounded-lg bg-grey-100 animate-pulse' />
                          //         </div>
                          //       </>
                          //     )}
                          //     {usersObject && usersObject[token.user_id] && (
                          //       <>
                          //         <Picture
                          //           src={`${ImagesBaseUrl}public/${
                          //             usersObject[token.user_id].profile?.photo_file_name
                          //           }`}
                          //           onErrorSrc={userIcon.src}
                          //           loading='lazy'
                          //           blurDataURL={userIcon.src}
                          //           alt='user avatar'
                          //           width={32}
                          //           height={32}
                          //           className='w-8 h-8 min-w-[2rem] rounded-full'
                          //         />
                          //         <div className='flex flex-col gap-1 flex-1 max-w-[100%_-_2.5rem]'>
                          //           <p
                          //             className='text-left text-sm truncate ...'
                          //             title={usersObject[token.user_id].profile?.name ?? '-'}
                          //           >
                          //             {usersObject[token.user_id].profile?.name ?? '-'}
                          //           </p>
                          //           <p
                          //             className='text-left text-xs truncate ...'
                          //             title={usersObject[token.user_id].email ?? '-'}
                          //           >
                          //             {usersObject[token.user_id].email ?? '-'}
                          //           </p>
                          //         </div>
                          //       </>
                          //     )}
                          //   </div>
                          //   <div className='w-20 ml-2'>{token.llm}</div>
                          //   <div className='w-40 text-left ml-3 truncate ...' title={token.model}>
                          //     {token.model}
                          //   </div>
                          //   <div className='w-16 text-center ml-3'>{numberWithCommas(token.input_tokens)}</div>
                          //   <div className='w-16 text-center ml-3'>{numberWithCommas(token.output_tokens)}</div>
                          //   <div className='w-28 text-center ml-3 hidden md:block'>
                          //     {formatDateString(token.created_at)}
                          //     <br />
                          //     {formatTimeStringHoursAndMinutes(token.created_at)}
                          //   </div>
                          // </div>
                        ))
                      )}
                    </div>
                    {isLoading && (
                      <div className='flex justify-start py-3 items-center animate-pulse'>
                        <div className='w-52 h-5 bg-gray-300 rounded-full dark:bg-gray-600' />
                        <div className='w-20 ml-3 h-5 bg-gray-300 rounded-full dark:bg-gray-600' />
                        <div className='w-40 h-5 bg-gray-300 rounded-full dark:bg-gray-600 ml-3' />
                        <div className='w-16 ml-3 h-5 bg-gray-300 rounded-full dark:bg-gray-600' />
                        <div className='w-16 h-5 bg-gray-300 rounded-full dark:bg-gray-600 ml-3' />
                        <div className='w-28 ml-3 h-5 bg-gray-300 rounded-full dark:bg-gray-600' />
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
