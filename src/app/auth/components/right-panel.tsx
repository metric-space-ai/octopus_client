export const RightPanel = () => (
  <div className='relative px-20 flex flex-col items-center justify-center bg-auth-background bg-no-repeat bg-cover rounded-xl'>
    <span className='text-32 font-semibold text-grey-0 text-center'>
      “Unlock Efficiency and <span className='text-primary-150'>Be More Productive”</span>
    </span>
    <div className='absolute bottom-10 flex flex-col sm:flex-row gap-4'>
      <div className='text-xs font-semibold text-grey-0 text-center border border-grey-0 rounded-3xl px-5 py-2'>
        Increased Efficiency
      </div>
      <div className='text-xs font-semibold text-grey-0 border border-grey-0 rounded-3xl px-5 py-2'>
        Knowledge Amplification
      </div>
      <div className='text-xs font-semibold text-grey-0 border border-grey-0 rounded-3xl px-5 py-2'>
        Problem Solving Support
      </div>
    </div>
  </div>
);
