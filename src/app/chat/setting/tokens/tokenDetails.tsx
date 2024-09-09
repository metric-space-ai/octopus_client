/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useEffect, useMemo, useState} from 'react';

import {FunnelIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import toast from 'react-hot-toast';
import {useDispatch, useSelector} from 'react-redux';

import {selectTokens} from '@/app/lib/features/tokens/tokensSelector';
import {getChatTokenAuditsCompanyReport} from '@/app/lib/features/tokens/tokensSlice';
import {AppDispatch} from '@/app/lib/store';
import {Button} from '@/components/buttons';
import {useAuthContext} from '@/contexts/authContext';
import {numberWithCommas} from '@/helpers';
import {ChatTokenUserReport} from '@/types';

const TokensAuditReport = () => {
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());
  const dispatch = useDispatch<AppDispatch>();
  const {currentUserCompany} = useAuthContext();
  const {reports, reportsIsLoading, reloadTokenAuditsReportIsAvailable} = useSelector(selectTokens);

  const handleSubmitFilter = async () => {
    if (startDate > endDate) {
      return toast.error('Start date must be before or equal to the end date.');
    }

    if (!currentUserCompany) return;
    handleGetData(currentUserCompany.id);
  };

  const handleGetData = async (company_id: string) => {
    const starts_at = startDate?.toISOString();
    const ends_at = endDate?.toISOString();
    await dispatch(getChatTokenAuditsCompanyReport({company_id, starts_at, ends_at}));
  };
  useEffect(() => {
    if (currentUserCompany) {
      handleGetData(currentUserCompany.id);
    }
  }, [currentUserCompany]);

  const formatReportData = useCallback((report: ChatTokenUserReport) => {
    return Object.entries(report).flatMap(([email, emailReport]) => {
      return Object.entries(emailReport).flatMap(([llm, sectionReport]) => {
        return Object.entries(sectionReport).map(([model, detail]) => ({
          email,
          llm,
          model,
          input_tokens: detail.input_tokens,
          output_tokens: detail.output_tokens,
        }));
      });
    });
  }, []);

  const getReportRows = useMemo(() => {
    const renderRows = (report: ChatTokenUserReport) => {
      const formattedData = formatReportData(report);

      return (
        <>
          {formattedData.map((elem) => (
            <div
              className='flex justify-start py-3 items-center border-t text-xs'
              key={`${elem.email}-${elem.model}-${elem.input_tokens}-${elem.output_tokens}`}
            >
              <div className='w-40 truncate ...' title={elem.email}>
                {elem.email}
              </div>
              <div className='w-20 text-center ml-2 truncate ...'>{elem.llm}</div>
              <div className='w-36 ml-2 truncate ...' title={elem.model}>
                {elem.model}
              </div>
              <div className='w-20 text-center ml-2'>{numberWithCommas(elem.input_tokens)}</div>
              <div className='w-20 text-center ml-2'>{numberWithCommas(elem.output_tokens)}</div>
            </div>
          ))}
        </>
      );
    };

    renderRows.displayName = 'RenderReportRows';

    return renderRows;
  }, [formatReportData]);

  return (
    <>
      <div className='w-full'>
        <div className='flex gap-6 mb-5 items-center'>
          <input
            type='datetime-local'
            id='start-date'
            name='startDate'
            value={startDate?.toISOString().slice(0, 16)}
            min='2018-06-07T00:00'
            onChange={(e) => setStartDate(new Date(e.target.value))}
            max={new Date().toISOString().slice(0, 16)}
          />
          <input
            type='datetime-local'
            id='endt-date'
            name='endDate'
            value={endDate?.toISOString().slice(0, 16)}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            max={new Date().toISOString().slice(0, 16)}
          />
          <Button
            variant='secondary'
            className={classNames(`flex-1 h-9 !px-3`, reportsIsLoading && 'pointer-events-none')}
            title={'Apply Filters'}
            onClick={handleSubmitFilter}
            iconBefore={<FunnelIcon className='w-4 h-4 text-grey-0' />}
          />
        </div>
        <div className='mx-auto w-full max-w-[620px] rounded-lg bg-grey-0'>
          <div className='flex mb-2 text-sm'>
            <div className='w-40 font-medium leading-5 text-grey-600' title='Large Language Model'>
              Email
            </div>
            <div className='w-20 ml-2 text-center font-medium leading-5 text-grey-600' title='Large Language Model'>
              llm
            </div>
            <div className='w-36 ml-2 font-medium leading-5 text-grey-600'>Model</div>
            <div className='w-20 ml-2 text-center font-medium leading-5 text-grey-600' title='Input tokens'>
              Input
            </div>
            <div className='w-20 ml-2 text-center font-medium leading-5 text-grey-600' title='Output tokens'>
              Output
            </div>
          </div>

          <div className='max-h-[420px] overflow-auto custom-scrollbar-thumb relative -mr-2'>
            {reloadTokenAuditsReportIsAvailable && (
              <div className='w-full'>
                <h2
                  className='uppercase text-primary cursor-pointer text-center py-6 hover:underline'
                  onClick={() => {
                    console.log('reloading..');
                    if (currentUserCompany) handleGetData(currentUserCompany.id);
                  }}
                >
                  try again
                </h2>
              </div>
            )}

            {!reports && !reportsIsLoading && (
              <div className='flex justify-center py-3 items-center border-t'>
                <h2 className='text-lg text-primary uppercase'>nothing found</h2>
              </div>
            )}
            {!reportsIsLoading && reports && <>{getReportRows(reports.report)}</>}
          </div>
          {reportsIsLoading && (
            <div className='flex justify-start py-3 items-center animate-pulse'>
              <div className='w-40 font-medium leading-5 text-grey-600 h-5 bg-gray-300 rounded-full dark:bg-gray-600' />
              <div className='w-20 ml-2 text-center font-medium leading-5 text-grey-600 h-5 bg-gray-300 rounded-full dark:bg-gray-600' />
              <div className='w-36 ml-2 font-medium leading-5 text-grey-600 h-5 bg-gray-300 rounded-full dark:bg-gray-600' />
              <div className='w-20 ml-2 text-center font-medium leading-5 text-grey-600 h-5 bg-gray-300 rounded-full dark:bg-gray-600' />
              <div className='w-20 ml-2 text-center font-medium leading-5 text-grey-600 h-5 bg-gray-300 rounded-full dark:bg-gray-600' />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default TokensAuditReport;
