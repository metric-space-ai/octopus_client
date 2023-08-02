export const RightPanel = () => (
  <div className='relative px-20 flex flex-col items-center justify-center bg-auth-background bg-no-repeat bg-cover rounded-[20px]'>
    <span className='text-32 font-semibold text-content-white text-center'>
      “Unlock Efficiency and <span className='text-content-accent-100'>Be More Productive”</span>
    </span>
    <div className='absolute bottom-10 flex flex-col sm:flex-row gap-4'>
      <div className='text-12 font-semibold text-content-white text-center border border-content-white rounded-[32px] px-5 py-2'>
        Increased Efficiency
      </div>
      <div className='text-12 font-semibold text-content-white border border-content-white rounded-[32px] px-5 py-2'>
        Knowledge Amplification
      </div>
      <div className='text-12 font-semibold text-content-white border border-content-white rounded-[32px] px-5 py-2'>
        Problem Solving Support
      </div>
    </div>
  </div>
);
