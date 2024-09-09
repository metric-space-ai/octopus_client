import React from 'react';

import classNames from 'classnames';

import Picture from '@/components/picture';
import {ImagesBaseUrl} from '@/constant';
import {formatDateString, formatTimeStringHoursAndMinutes, numberWithCommas} from '@/helpers';
import {ITokenAudit, IUser} from '@/types';

import userIcon from './../../../../public/images/user_icon.png';

type Props = {index: number; token: ITokenAudit; usersIsLoading: boolean; usersObject: Record<string, IUser> | null};

const AuditDetailsRow = ({index, token, usersIsLoading, usersObject}: Props) => {
  return (
    <div
      className={classNames(
        'flex justify-start py-2.5 items-center text-sm',
        index !== 0 && 'border-t border-t-grey-100/50',
      )}
    >
      <div className='flex gap-2 w-52 text-left items-center truncate ...'>
        {/* {getUserInfoWithUserId(token.user_id)} */}

        {usersIsLoading && !usersObject && (
          <>
            <div className='rounded-full min-w-[2rem] w-8 h-8 bg-grey-100 animate-pulse' />
            <div className='flex flex-col gap-0.5'>
              <p className='w-14 h-5 rounded-lg bg-grey-100 animate-pulse' />
              <p className='w-32 h-5 rounded-lg bg-grey-100 animate-pulse' />
            </div>
          </>
        )}
        {usersObject && usersObject[token.user_id] && (
          <>
            <Picture
              src={`${ImagesBaseUrl}public/${usersObject[token.user_id].profile?.photo_file_name}`}
              onErrorSrc={userIcon.src}
              loading='lazy'
              alt='user avatar'
              width={32}
              height={32}
              className='w-8 h-8 min-w-[2rem] rounded-full'
            />
            <div className='flex flex-col gap-1 flex-1 max-w-[100%_-_2.5rem]'>
              <p className='text-left text-sm truncate ...' title={usersObject[token.user_id].profile?.name ?? '-'}>
                {usersObject[token.user_id].profile?.name ?? '-'}
              </p>
              <p className='text-left text-xs truncate ...' title={usersObject[token.user_id].email ?? '-'}>
                {usersObject[token.user_id].email ?? '-'}
              </p>
            </div>
          </>
        )}
      </div>
      <div className='w-20 ml-2'>{token.llm}</div>
      <div className='w-40 text-left ml-3 truncate ...' title={token.model}>
        {token.model}
      </div>
      <div className='w-16 text-center ml-3'>{numberWithCommas(token.input_tokens)}</div>
      <div className='w-16 text-center ml-3'>{numberWithCommas(token.output_tokens)}</div>
      <div className='w-28 text-center ml-3 hidden md:block'>
        {formatDateString(token.created_at)}
        <br />
        {formatTimeStringHoursAndMinutes(token.created_at)}
      </div>
    </div>
  );
};

export default AuditDetailsRow;
