import React, {useState} from 'react';

import dynamic from 'next/dynamic';

import {Button} from '@/components/buttons';

import TokensAuditReport from './tokenDetails';

const DynamicTokenAuditsDetailsModalDialog = dynamic(
  async () => (await import('@/components/modals')).TokenAuditsDetailsModalDialog,
  {
    ssr: false,
  },
);

const Tokens = () => {
  const [openTokenAuditDetailsDialog, setOpenTokenAuditDetailsDialog] = useState(false);
  return (
    <>
      <div className='w-full pt-9 flex flex-col px-6'>
        <div className='flex flex-col w-full max-w-[680px] px-6 py-4 rounded-xl bg-grey-0'>
          <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
            <h1 className='text-lg leading-7 text-grey-900 font-semibold'>Tokens</h1>
            <Button
              className='!px-6 font-semibold text-sm !h-34-px'
              variant='primary'
              title='Consumption details'
              onClick={() => setOpenTokenAuditDetailsDialog(true)}
            />
          </div>
          <div className='max-w-full'>
            <TokensAuditReport />
          </div>
        </div>
      </div>

      <DynamicTokenAuditsDetailsModalDialog
        open={openTokenAuditDetailsDialog}
        onClose={() => setOpenTokenAuditDetailsDialog(false)}
      />
    </>
  );
};

export default Tokens;
